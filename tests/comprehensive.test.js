import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { createProject } from "../bin/actions.js";
import { questions } from "../bin/questions.js";
import { validateProjectName } from "../bin/lib/utils.js";
import {
    detectProjectConfiguration,
    getPackageName,
} from "../bin/lib/projectDetector.js";
import { updateConcurrentlyScripts } from "../bin/lib/scriptGenerator.js";
import {
    getGitHubUsername,
    validateGitHubRepository,
    constructGitHubUrl,
    initializeGit,
} from "../bin/lib/gitHandler.js";
import {
    LOCK_FILE_MANAGERS,
    CONCURRENTLY_DEPENDENCIES,
    GITHUB_URL_PATTERN,
    REPO_NAME_PATTERN,
} from "../bin/lib/constants.js";

vi.mock("execa");

describe("CMA CLI Comprehensive Tests", () => {
    const testDir = path.join(process.cwd(), "test-comprehensive");

    beforeEach(async () => {
        await fs.ensureDir(testDir);
        process.chdir(testDir);
        vi.clearAllMocks();
        vi.mocked(execa).mockResolvedValue({ stdout: "1.0.0" });
    });

    afterEach(async () => {
        process.chdir(process.cwd());
        await fs.remove(testDir);
    });

    describe("Project Name Validation", () => {
        it("should validate correct project names", () => {
            const validNames = ["my-app", "MyApp", "my_app", "app123", "a"];
            validNames.forEach((name) => {
                const result = validateProjectName(name);
                expect(result.valid).toBe(true);
                expect(result.name).toBe(name);
            });
        });

        it("should reject invalid project names", () => {
            const invalidCases = [
                { name: null, expectedError: "Project name is required" },
                { name: "", expectedError: "Project name is required" },
                { name: "   ", expectedError: "Project name cannot be empty" },
                {
                    name: "my app",
                    expectedError:
                        "Project name can only contain letters, numbers, hyphens, and underscores",
                },
                {
                    name: "my@app",
                    expectedError:
                        "Project name can only contain letters, numbers, hyphens, and underscores",
                },
                {
                    name: "a".repeat(215),
                    expectedError:
                        "Project name is too long (max 214 characters)",
                },
            ];

            invalidCases.forEach(({ name, expectedError }) => {
                const result = validateProjectName(name);
                expect(result.valid).toBe(false);
                expect(result.error).toBe(expectedError);
            });
        });

        it("should trim whitespace from project names", () => {
            const result = validateProjectName("  my-app  ");
            expect(result.valid).toBe(true);
            expect(result.name).toBe("my-app");
        });
    });

    describe("Project Configuration Detection", () => {
        it("should detect npm lock file", async () => {
            await fs.writeFile(path.join(testDir, "package-lock.json"), "{}");

            const result = await detectProjectConfiguration(testDir);

            expect(result.lockFiles).toContain("package-lock.json");
            expect(result.allSuggestions).toContain("npm");
            expect(result.suggestedManager).toBe("npm");
            expect(result.hasMultipleLockFiles).toBe(false);
        });

        it("should detect multiple lock files", async () => {
            await fs.writeFile(path.join(testDir, "package-lock.json"), "{}");
            await fs.writeFile(path.join(testDir, "yarn.lock"), "");

            const result = await detectProjectConfiguration(testDir);

            expect(result.lockFiles).toHaveLength(2);
            expect(result.hasMultipleLockFiles).toBe(true);
            expect(result.allSuggestions).toContain("npm");
            expect(result.allSuggestions).toContain("yarn");
        });

        it("should detect packageManager field in package.json", async () => {
            const packageJson = { name: "test", packageManager: "pnpm@8.0.0" };
            await fs.writeJson(path.join(testDir, "package.json"), packageJson);

            const result = await detectProjectConfiguration(testDir);

            expect(result.allSuggestions).toContain("pnpm");
            expect(result.packageJsonConfig).toEqual(packageJson);
        });

        it("should handle no configuration gracefully", async () => {
            const result = await detectProjectConfiguration(testDir);

            expect(result.lockFiles).toHaveLength(0);
            expect(result.allSuggestions).toHaveLength(0);
            expect(result.suggestedManager).toBeNull();
            expect(result.hasMultipleLockFiles).toBe(false);
        });
    });

    describe("Package Name Resolution", () => {
        it("should return package name from package.json", async () => {
            const clientDir = path.join(testDir, "client");
            await fs.ensureDir(clientDir);
            await fs.writeJson(path.join(clientDir, "package.json"), {
                name: "my-app-client",
            });

            const result = await getPackageName(testDir, "client");
            expect(result).toBe("my-app-client");
        });

        it("should return directory name if no package.json", async () => {
            const result = await getPackageName(testDir, "client");
            expect(result).toBe("client");
        });

        it("should handle invalid package.json gracefully", async () => {
            const clientDir = path.join(testDir, "client");
            await fs.ensureDir(clientDir);
            await fs.writeFile(
                path.join(clientDir, "package.json"),
                "invalid json",
            );

            const result = await getPackageName(testDir, "client");
            expect(result).toBe("client");
        });
    });

    describe("Script Generation for Package Managers", () => {
        beforeEach(async () => {
            await fs.ensureDir(path.join(testDir, "client"));
            await fs.ensureDir(path.join(testDir, "server"));
            await fs.writeJson(path.join(testDir, "client", "package.json"), {
                name: "test-app-client",
            });
            await fs.writeJson(path.join(testDir, "server", "package.json"), {
                name: "test-app-server",
            });
        });

        const packageManagers = [
            {
                name: "npm",
                command: "npm",
                expectedClient: "npm run dev --workspace client",
            },
            {
                name: "yarn",
                command: "yarn",
                expectedClient: "yarn workspace test-app-client dev",
            },
            {
                name: "pnpm",
                command: "pnpm",
                expectedClient: "pnpm --filter test-app-client dev",
            },
            {
                name: "bun",
                command: "bun",
                expectedClient: "bun --filter test-app-client dev",
            },
        ];

        packageManagers.forEach(({ name, command, expectedClient }) => {
            it(`should generate ${name} scripts correctly`, async () => {
                const packageJsonPath = path.join(testDir, "package.json");
                const packageJson = {
                    scripts: {},
                    devDependencies: { concurrently: "^9.1.2" },
                };
                await fs.writeJson(packageJsonPath, packageJson);

                const packageManager = { name, command };
                await updateConcurrentlyScripts(
                    packageJsonPath,
                    packageManager,
                );

                const result = await fs.readJson(packageJsonPath);

                expect(result.scripts.client).toBe(expectedClient);
                expect(result.scripts.dev).toContain("concurrently");

                if (name === "pnpm") {
                    expect(result.workspaces).toBeUndefined();
                }
            });
        });

        it("should add concurrently dependencies for all package managers", async () => {
            const packageJsonPath = path.join(testDir, "package.json");
            const packageJson = {
                scripts: {},
                devDependencies: { concurrently: "^9.1.2" },
            };
            await fs.writeJson(packageJsonPath, packageJson);

            const packageManager = { name: "pnpm", command: "pnpm" };
            await updateConcurrentlyScripts(packageJsonPath, packageManager);

            const result = await fs.readJson(packageJsonPath);

            Object.keys(CONCURRENTLY_DEPENDENCIES).forEach((dep) => {
                expect(result.devDependencies[dep]).toBeDefined();
            });
        });

        it("should not overwrite existing dependencies", async () => {
            const packageJsonPath = path.join(testDir, "package.json");
            const packageJson = {
                scripts: {},
                devDependencies: {
                    concurrently: "^9.1.2",
                    yargs: "^16.0.0",
                },
            };
            await fs.writeJson(packageJsonPath, packageJson);

            const packageManager = { name: "pnpm", command: "pnpm" };
            await updateConcurrentlyScripts(packageJsonPath, packageManager);

            const result = await fs.readJson(packageJsonPath);

            expect(result.devDependencies.yargs).toBe("^16.0.0");
            expect(result.devDependencies["supports-color"]).toBeDefined();
        });
    });

    describe("Git Integration", () => {
        beforeEach(() => {
            vi.mocked(execa).mockClear();
        });

        it("should get GitHub username from git config", async () => {
            vi.mocked(execa).mockResolvedValueOnce({ stdout: "testuser" });

            const result = await getGitHubUsername();

            expect(result).toBe("testuser");
            expect(execa).toHaveBeenCalledWith("git", [
                "config",
                "--global",
                "github.user",
            ]);
        });

        it("should fallback to user.name if github.user not set", async () => {
            vi.mocked(execa)
                .mockRejectedValueOnce(new Error("not found"))
                .mockResolvedValueOnce({ stdout: "Test User" });

            const result = await getGitHubUsername();

            expect(result).toBe("Test User");
            expect(execa).toHaveBeenCalledWith("git", [
                "config",
                "--global",
                "user.name",
            ]);
        });

        it("should validate GitHub repository URLs", async () => {
            vi.mocked(execa).mockResolvedValueOnce({});

            const result = await validateGitHubRepository(
                "https://github.com/user/repo.git",
            );

            expect(result).toBe(true);
            expect(execa).toHaveBeenCalledWith(
                "git",
                ["ls-remote", "--heads", "https://github.com/user/repo.git"],
                {
                    timeout: 10000,
                    stdio: "ignore",
                },
            );
        });

        it("should construct GitHub URLs correctly", () => {
            const testCases = [
                {
                    input: "https://github.com/user/repo.git",
                    username: "testuser",
                    expected: "https://github.com/user/repo.git",
                },
                {
                    input: "my-repo",
                    username: "testuser",
                    expected: "https://github.com/testuser/my-repo.git",
                },
                {
                    input: "  my-repo  ",
                    username: "testuser",
                    expected: "https://github.com/testuser/my-repo.git",
                },
            ];

            testCases.forEach(({ input, username, expected }) => {
                const result = constructGitHubUrl(input, username);
                expect(result).toBe(expected);
            });
        });

        it("should throw error for invalid repository formats", () => {
            expect(() => constructGitHubUrl("my-repo", null)).toThrow();
            expect(() =>
                constructGitHubUrl("invalid/repo/name", "testuser"),
            ).toThrow();
        });

        it("should initialize git repository successfully", async () => {
            const mockProjectPath = path.join(testDir, "test-project");
            await fs.ensureDir(mockProjectPath);

            vi.mocked(execa)
                .mockResolvedValueOnce({ stdout: "testuser" })
                .mockResolvedValue({});

            await initializeGit(mockProjectPath, "my-repo");

            expect(execa).toHaveBeenCalledWith("git", ["--version"]);
            expect(execa).toHaveBeenCalledWith("git", ["init"], {
                cwd: mockProjectPath,
            });
            expect(execa).toHaveBeenCalledWith(
                "git",
                [
                    "remote",
                    "add",
                    "origin",
                    "https://github.com/testuser/my-repo.git",
                ],
                {
                    cwd: mockProjectPath,
                },
            );
        });
    });

    describe("Constants Validation", () => {
        it("should have correct lock file mappings", () => {
            expect(LOCK_FILE_MANAGERS["package-lock.json"]).toBe("npm");
            expect(LOCK_FILE_MANAGERS["yarn.lock"]).toBe("yarn");
            expect(LOCK_FILE_MANAGERS["pnpm-lock.yaml"]).toBe("pnpm");
            expect(LOCK_FILE_MANAGERS["bun.lockb"]).toBe("bun");
        });

        it("should have valid dependency versions", () => {
            Object.values(CONCURRENTLY_DEPENDENCIES).forEach((version) => {
                expect(version).toMatch(/^\^?\d+\.\d+\.\d+$/);
            });
        });

        it("should validate GitHub URL pattern", () => {
            const validUrls = [
                "https://github.com/user/repo.git",
                "https://github.com/user-name/repo-name.git",
                "https://github.com/user123/repo123.git",
            ];

            const invalidUrls = [
                "https://github.com/user/repo",
                "http://github.com/user/repo.git",
                "https://gitlab.com/user/repo.git",
            ];

            validUrls.forEach((url) => {
                expect(GITHUB_URL_PATTERN.test(url)).toBe(true);
            });

            invalidUrls.forEach((url) => {
                expect(GITHUB_URL_PATTERN.test(url)).toBe(false);
            });
        });

        it("should validate repository name pattern", () => {
            const validNames = [
                "repo",
                "my-repo",
                "my_repo",
                "repo123",
                "repo.name",
            ];
            const invalidNames = ["my repo", "my/repo", "my@repo", ""];

            validNames.forEach((name) => {
                expect(REPO_NAME_PATTERN.test(name)).toBe(true);
            });

            invalidNames.forEach((name) => {
                expect(REPO_NAME_PATTERN.test(name)).toBe(false);
            });
        });
    });

    describe("End-to-End Project Creation", () => {
        beforeEach(async () => {
            const templateDir = path.join(testDir, "templates", "js");
            await fs.ensureDir(templateDir);
            await fs.ensureDir(path.join(templateDir, "client"));
            await fs.ensureDir(path.join(templateDir, "server"));

            await fs.writeJson(path.join(templateDir, "package.json"), {
                name: "mern-workspace",
                scripts: {
                    dev: 'concurrently "npm run server" "npm run client"',
                },
                devDependencies: { concurrently: "^9.1.2" },
            });

            await fs.writeJson(
                path.join(templateDir, "client", "package.json"),
                {
                    name: "client",
                    scripts: { dev: "vite" },
                },
            );

            await fs.writeJson(
                path.join(templateDir, "server", "package.json"),
                {
                    name: "server",
                    scripts: { dev: "nodemon src/server.js" },
                },
            );
        });

        const testConfigs = [
            {
                name: "npm with concurrently",
                config: {
                    projectName: "test-npm-project",
                    language: "JavaScript",
                    packageManager: "npm",
                    concurrently: true,
                    installDependencies: false,
                    gitRepo: false,
                    initializeParts: "both",
                },
                expectedScriptPattern: "npm run dev --workspace",
            },
            {
                name: "pnpm with workspace",
                config: {
                    projectName: "test-pnpm-project",
                    language: "JavaScript",
                    packageManager: "pnpm",
                    concurrently: true,
                    installDependencies: false,
                    gitRepo: false,
                    initializeParts: "both",
                },
                expectedScriptPattern: "pnpm --filter",
                shouldHavePnpmWorkspace: true,
            },
            {
                name: "client only",
                config: {
                    projectName: "test-client-only",
                    language: "JavaScript",
                    packageManager: "npm",
                    concurrently: false,
                    installDependencies: false,
                    gitRepo: false,
                    initializeParts: "client",
                },
                clientOnly: true,
            },
            {
                name: "server only",
                config: {
                    projectName: "test-server-only",
                    language: "JavaScript",
                    packageManager: "npm",
                    concurrently: false,
                    installDependencies: false,
                    gitRepo: false,
                    initializeParts: "server",
                },
                serverOnly: true,
            },
        ];

        testConfigs.forEach(
            ({
                name,
                config,
                expectedScriptPattern,
                shouldHavePnpmWorkspace,
                clientOnly,
                serverOnly,
            }) => {
                it(`should create project with ${name}`, async () => {
                    const projectPath = path.join(testDir, config.projectName);

                    await createProject(config);

                    expect(await fs.pathExists(projectPath)).toBe(true);

                    if (clientOnly) {
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "client"),
                            ),
                        ).toBe(true);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "server"),
                            ),
                        ).toBe(false);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "package.json"),
                            ),
                        ).toBe(false);
                    } else if (serverOnly) {
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "server"),
                            ),
                        ).toBe(true);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "client"),
                            ),
                        ).toBe(false);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "package.json"),
                            ),
                        ).toBe(false);
                    } else {
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "client"),
                            ),
                        ).toBe(true);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "server"),
                            ),
                        ).toBe(true);
                        expect(
                            await fs.pathExists(
                                path.join(projectPath, "package.json"),
                            ),
                        ).toBe(true);

                        const rootPackageJson = await fs.readJson(
                            path.join(projectPath, "package.json"),
                        );
                        expect(rootPackageJson.name).toBe(config.projectName);

                        if (expectedScriptPattern) {
                            expect(rootPackageJson.scripts.client).toContain(
                                expectedScriptPattern,
                            );
                        }

                        if (shouldHavePnpmWorkspace) {
                            expect(
                                await fs.pathExists(
                                    path.join(
                                        projectPath,
                                        "pnpm-workspace.yaml",
                                    ),
                                ),
                            ).toBe(true);
                            expect(rootPackageJson.workspaces).toBeUndefined();
                        }
                    }

                    if (!clientOnly) {
                        const serverPackageJson = await fs.readJson(
                            path.join(projectPath, "server", "package.json"),
                        );
                        expect(serverPackageJson.name).toBe(
                            `${config.projectName}-server`,
                        );
                    }

                    if (!serverOnly) {
                        const clientPackageJson = await fs.readJson(
                            path.join(projectPath, "client", "package.json"),
                        );
                        expect(clientPackageJson.name).toBe(
                            `${config.projectName}-client`,
                        );
                    }
                });
            },
        );

        it("should handle git initialization", async () => {
            const config = {
                projectName: "test-git-project",
                language: "JavaScript",
                packageManager: "npm",
                concurrently: true,
                installDependencies: false,
                gitRepo: true,
                gitRepoUrl: "https://github.com/user/repo.git",
                initializeParts: "both",
            };

            await createProject(config);

            expect(execa).toHaveBeenCalledWith("git", ["--version"]);
            expect(execa).toHaveBeenCalledWith("git", ["init"], {
                cwd: path.join(testDir, config.projectName),
            });
        });

        it("should handle errors gracefully", async () => {
            const config = {
                projectName: "invalid/name",
                language: "JavaScript",
                packageManager: "npm",
                concurrently: true,
                installDependencies: false,
                gitRepo: false,
                initializeParts: "both",
            };

            await expect(createProject(config)).rejects.toThrow();
        });

        it("should create project without helper routes when disabled", async () => {
            const config = {
                projectName: "test-no-helper-routes",
                language: "JavaScript",
                packageManager: "npm",
                concurrently: true,
                initializeParts: "both",
                installDependencies: false,
                gitRepo: false,
                includeHelperRoutes: false,
            };

            await createProject(config);

            const projectPath = path.join(testDir, config.projectName);
            const serverPath = path.join(projectPath, "server");

            // Check that helper route files are not present
            const authMiddlewarePath = path.join(
                serverPath,
                "src",
                "middleware",
                "authMiddleware.js",
            );
            const userModelPath = path.join(
                serverPath,
                "src",
                "models",
                "user.js",
            );
            const usersRoutePath = path.join(
                serverPath,
                "src",
                "routes",
                "users.js",
            );
            const generateTokenPath = path.join(
                serverPath,
                "src",
                "utils",
                "generateToken.js",
            );

            expect(await fs.pathExists(authMiddlewarePath)).toBe(false);
            expect(await fs.pathExists(userModelPath)).toBe(false);
            expect(await fs.pathExists(usersRoutePath)).toBe(false);
            expect(await fs.pathExists(generateTokenPath)).toBe(false);

            // Check that index route doesn't have users import/route
            const indexRoutePath = path.join(
                serverPath,
                "src",
                "routes",
                "index.js",
            );
            const indexContent = await fs.readFile(indexRoutePath, "utf8");

            expect(indexContent).not.toContain(
                'import users from "./users.js"',
            );
            expect(indexContent).not.toContain('router.use("/users", users)');

            // Verify other files still exist
            const errorMiddlewarePath = path.join(
                serverPath,
                "src",
                "middleware",
                "errorMiddleware.js",
            );
            const querySanitizerPath = path.join(
                serverPath,
                "src",
                "middleware",
                "querySanitizer.js",
            );

            expect(await fs.pathExists(errorMiddlewarePath)).toBe(true);
            expect(await fs.pathExists(querySanitizerPath)).toBe(true);
        });

        it("should create project with helper routes when enabled", async () => {
            const config = {
                projectName: "test-with-helper-routes",
                language: "JavaScript",
                packageManager: "npm",
                concurrently: true,
                initializeParts: "both",
                installDependencies: false,
                gitRepo: false,
                includeHelperRoutes: true,
            };

            await createProject(config);

            const projectPath = path.join(testDir, config.projectName);
            const serverPath = path.join(projectPath, "server");

            // Check that helper route files are present
            const authMiddlewarePath = path.join(
                serverPath,
                "src",
                "middleware",
                "authMiddleware.js",
            );
            const userModelPath = path.join(
                serverPath,
                "src",
                "models",
                "user.js",
            );
            const usersRoutePath = path.join(
                serverPath,
                "src",
                "routes",
                "users.js",
            );
            const generateTokenPath = path.join(
                serverPath,
                "src",
                "utils",
                "generateToken.js",
            );

            expect(await fs.pathExists(authMiddlewarePath)).toBe(true);
            expect(await fs.pathExists(userModelPath)).toBe(true);
            expect(await fs.pathExists(usersRoutePath)).toBe(true);
            expect(await fs.pathExists(generateTokenPath)).toBe(true);

            // Check that index route has users import/route
            const indexRoutePath = path.join(
                serverPath,
                "src",
                "routes",
                "index.js",
            );
            const indexContent = await fs.readFile(indexRoutePath, "utf8");

            expect(indexContent).toContain('import users from "./users.js"');
            expect(indexContent).toContain('router.use("/users", users)');
        });
    });

    describe("Questions Configuration", () => {
        it("should have valid question structure", () => {
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);

            questions.forEach((question) => {
                expect(question).toHaveProperty("type");
                expect(question).toHaveProperty("name");
                expect(question).toHaveProperty("message");
            });
        });

        it("should have project name question with validation", () => {
            const projectNameQuestion = questions.find(
                (q) => q.name === "projectName",
            );
            expect(projectNameQuestion).toBeDefined();
            expect(projectNameQuestion.type).toBe("input");
            expect(projectNameQuestion.default).toBeDefined();
        });

        it("should have package manager question with choices", () => {
            const packageManagerQuestion = questions.find(
                (q) => q.name === "packageManager",
            );
            expect(packageManagerQuestion).toBeDefined();
            expect(packageManagerQuestion.type).toBe("list");
            expect(typeof packageManagerQuestion.choices).toBe("function");
        });

        it("should have git repository validation", () => {
            const gitRepoQuestion = questions.find(
                (q) => q.name === "gitRepoUrl",
            );
            expect(gitRepoQuestion).toBeDefined();
            expect(typeof gitRepoQuestion.validate).toBe("function");
        });

        it("should have helper routes question with conditional logic", () => {
            const helperRoutesQuestion = questions.find(
                (q) => q.name === "includeHelperRoutes",
            );
            expect(helperRoutesQuestion).toBeDefined();
            expect(helperRoutesQuestion.type).toBe("confirm");
            expect(helperRoutesQuestion.default).toBe(true);
            expect(typeof helperRoutesQuestion.when).toBe("function");

            // Test the conditional logic
            expect(helperRoutesQuestion.when({ concurrently: true })).toBe(
                true,
            );
            expect(
                helperRoutesQuestion.when({
                    concurrently: false,
                    initializeParts: "both",
                }),
            ).toBe(true);
            expect(
                helperRoutesQuestion.when({
                    concurrently: false,
                    initializeParts: "server",
                }),
            ).toBe(true);
            expect(
                helperRoutesQuestion.when({
                    concurrently: false,
                    initializeParts: "client",
                }),
            ).toBe(false);
        });
    });
});
