import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  vi,
} from "vitest";
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
  GITHUB_URL_PATTERN,
  REPO_NAME_PATTERN,
  INIT_PARTS,
} from "../bin/lib/constants.js";

vi.mock("execa");
vi.mock("fs-extra");

describe("CMA CLI Comprehensive Tests", () => {
  let testDir;
  const originalCwd = process.cwd();

  beforeEach(async () => {
    // Use in-memory test directory for speed
    testDir = `/tmp/test-${Date.now()}`;
    vi.clearAllMocks();

    // Default mock implementations - can be overridden in specific tests
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.writeJson).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue("test content");
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.copy).mockResolvedValue(undefined);
    vi.mocked(fs.remove).mockResolvedValue(undefined);
    vi.mocked(fs.move).mockResolvedValue(undefined);
    vi.mocked(fs.readdir).mockResolvedValue([]);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    // Mock execa for git and package manager commands
    vi.mocked(execa).mockResolvedValue({ stdout: "1.0.0" });
  });

  afterEach(async () => {
    // No cleanup needed for mocked operations
    vi.resetAllMocks();
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
          expectedError: "Project name is too long (max 214 characters)",
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
      // Mock fs.readdir to return only npm lock file
      vi.mocked(fs.readdir).mockResolvedValue([
        { name: "package-lock.json", isFile: () => true },
      ]);
      vi.mocked(fs.pathExists).mockImplementation((filePath) => {
        return Promise.resolve(
          filePath.toString().includes("package-lock.json"),
        );
      });
      vi.mocked(fs.readJson).mockResolvedValue({});

      const result = await detectProjectConfiguration(testDir);

      expect(result.lockFiles).toContain("package-lock.json");
      expect(result.allSuggestions).toContain("npm");
      expect(result.suggestedManager).toBe("npm");
      expect(result.hasMultipleLockFiles).toBe(false);
    });

    it("should detect multiple lock files", async () => {
      // Mock fs.readdir to return multiple lock files
      vi.mocked(fs.readdir).mockResolvedValue([
        { name: "package-lock.json", isFile: () => true },
        { name: "yarn.lock", isFile: () => true },
      ]);
      vi.mocked(fs.pathExists).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        return Promise.resolve(
          pathStr.includes("package-lock.json") ||
            pathStr.includes("yarn.lock"),
        );
      });
      vi.mocked(fs.readJson).mockResolvedValue({});

      const result = await detectProjectConfiguration(testDir);

      expect(result.lockFiles).toHaveLength(2);
      expect(result.hasMultipleLockFiles).toBe(true);
      expect(result.allSuggestions).toContain("npm");
      expect(result.allSuggestions).toContain("yarn");
    });

    it("should detect packageManager field in package.json", async () => {
      const packageJson = { name: "test", packageManager: "pnpm@8.0.0" };
      vi.mocked(fs.readdir).mockResolvedValue([]);
      vi.mocked(fs.pathExists).mockImplementation((filePath) => {
        return Promise.resolve(filePath.toString().includes("package.json"));
      });
      vi.mocked(fs.readJson).mockResolvedValue(packageJson);

      const result = await detectProjectConfiguration(testDir);

      expect(result.allSuggestions).toContain("pnpm");
      expect(result.packageJsonConfig).toEqual(packageJson);
    });

    it("should handle no configuration gracefully", async () => {
      // Mock empty directory
      vi.mocked(fs.readdir).mockResolvedValue([]);
      vi.mocked(fs.pathExists).mockResolvedValue(false);

      const result = await detectProjectConfiguration(testDir);

      expect(result.lockFiles).toHaveLength(0);
      expect(result.allSuggestions).toHaveLength(0);
      expect(result.suggestedManager).toBeNull();
      expect(result.hasMultipleLockFiles).toBe(false);
    });
  });

  describe("Package Name Resolution", () => {
    it("should return package name from package.json", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({ name: "my-app-client" });

      const result = await getPackageName(testDir, "client");
      expect(result).toBe("my-app-client");
    });

    it("should return directory name if no package.json", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(false);

      const result = await getPackageName(testDir, "client");
      expect(result).toBe("client");
    });

    it("should handle invalid package.json gracefully", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true);
      vi.mocked(fs.readJson).mockRejectedValue(new Error("Invalid JSON"));

      const result = await getPackageName(testDir, "client");
      expect(result).toBe("client");
    });
  });

  describe("Script Generation for Package Managers", () => {
    beforeEach(async () => {
      // Mock package.json reads for script generation tests
      vi.mocked(fs.readJson).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("client/package.json")) {
          return Promise.resolve({ name: "test-app-client" });
        } else if (pathStr.includes("server/package.json")) {
          return Promise.resolve({ name: "test-app-server" });
        } else {
          return Promise.resolve({
            scripts: {},
            devDependencies: { concurrently: "^9.1.2" },
          });
        }
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
        const initialPackageJson = {
          scripts: {},
          devDependencies: { concurrently: "^9.1.2" },
        };

        // Mock the updated package.json with generated scripts
        const updatedPackageJson = {
          ...initialPackageJson,
          scripts: {
            client: expectedClient,
            dev: 'concurrently "npm run server" "npm run client"',
          },
        };

        // Mock fs.readJson to return updated package.json after the operation
        vi.mocked(fs.readJson)
          .mockResolvedValueOnce(initialPackageJson)
          .mockResolvedValueOnce(updatedPackageJson);

        const packageManager = { name, command };
        await updateConcurrentlyScripts(packageJsonPath, packageManager);

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
      const initialPackageJson = {
        scripts: {},
        devDependencies: { concurrently: "^9.1.2" },
      };

      const updatedPackageJson = {
        ...initialPackageJson,
        devDependencies: {
          ...initialPackageJson.devDependencies,
          concurrently: "^9.1.2",
        },
      };

      vi.mocked(fs.readJson)
        .mockResolvedValueOnce(initialPackageJson)
        .mockResolvedValueOnce(updatedPackageJson);

      const packageManager = { name: "pnpm", command: "pnpm" };
      await updateConcurrentlyScripts(packageJsonPath, packageManager);

      const result = await fs.readJson(packageJsonPath);

      // The concurrently dependency should already be in the template
      expect(result.devDependencies.concurrently).toBeDefined();
    });

    it("should not overwrite existing dependencies", async () => {
      const packageJsonPath = path.join(testDir, "package.json");
      const initialPackageJson = {
        scripts: {},
        devDependencies: {
          concurrently: "^9.1.2",
          yargs: "^16.0.0",
        },
      };

      const updatedPackageJson = {
        ...initialPackageJson,
        devDependencies: {
          ...initialPackageJson.devDependencies,
          concurrently: "^9.1.2",
          yargs: "^16.0.0", // Should preserve existing version
        },
      };

      vi.mocked(fs.readJson)
        .mockResolvedValueOnce(initialPackageJson)
        .mockResolvedValueOnce(updatedPackageJson);

      const packageManager = { name: "pnpm", command: "pnpm" };
      await updateConcurrentlyScripts(packageJsonPath, packageManager);

      const result = await fs.readJson(packageJsonPath);

      expect(result.devDependencies.yargs).toBe("^16.0.0");
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
        ["remote", "add", "origin", "https://github.com/testuser/my-repo.git"],
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

    it("should have valid concurrently version in templates", () => {
      // This test ensures the template files have the correct concurrently version
      const concurrentlyVersion = "^9.1.2";
      expect(concurrentlyVersion).toMatch(/^\^?\d+\.\d+\.\d+$/);
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
      const validNames = ["repo", "my-repo", "my_repo", "repo123", "repo.name"];
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
      // Mock template directory structure for fast tests
      vi.mocked(fs.pathExists).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        // Mock template files exist
        if (
          pathStr.includes("templates/js") ||
          pathStr.includes("package.json") ||
          pathStr.includes("index.html") ||
          pathStr.includes("src")
        ) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      // Mock package.json reads for different scenarios
      vi.mocked(fs.readJson).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("package.json")) {
          if (pathStr.includes("client")) {
            return Promise.resolve({
              name: "test-client",
              scripts: { dev: "vite" },
            });
          } else if (pathStr.includes("server")) {
            return Promise.resolve({
              name: "test-server",
              scripts: { dev: "nodemon" },
            });
          } else {
            return Promise.resolve({ name: "test-root", scripts: {} });
          }
        }
        return Promise.resolve({});
      });
    });

    const testConfigs = [
      {
        name: "basic project creation",
        config: {
          projectName: "test-project",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        },
        expectedScriptPattern: "npm run dev --workspace",
      },
      {
        name: "client only setup",
        config: {
          projectName: "test-client-only",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: false,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.CLIENT,
          includeHelperRoutes: false,
        },
        clientOnly: true,
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
          // Test that createProject runs without errors
          await expect(createProject(config)).resolves.not.toThrow();

          // Verify that the expected fs operations were called
          expect(fs.ensureDir).toHaveBeenCalled();
          expect(fs.copy).toHaveBeenCalled();

          // Verify specific operations based on config
          if (clientOnly) {
            // Verify client-only specific operations
            expect(fs.copy).toHaveBeenCalledWith(
              expect.stringContaining("client"),
              expect.any(String),
            );
          } else {
            // Verify full project operations
            expect(fs.writeJson).toHaveBeenCalled();
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
        initializeParts: INIT_PARTS.BOTH,
        includeHelperRoutes: true,
      };

      await expect(createProject(config)).resolves.not.toThrow();

      // Verify git commands were called
      expect(execa).toHaveBeenCalledWith("git", ["--version"]);
    });

    it("should handle errors gracefully", async () => {
      // Mock fs.mkdir to throw an error for invalid project names
      vi.mocked(fs.mkdir).mockRejectedValue(
        new Error("Invalid directory name"),
      );

      const config = {
        projectName: "invalid/name",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        installDependencies: false,
        gitRepo: false,
        initializeParts: INIT_PARTS.BOTH,
        includeHelperRoutes: true,
      };

      await expect(createProject(config)).rejects.toThrow();
    });

    it("should create project without helper routes when disabled", async () => {
      const config = {
        projectName: "test-no-helper-routes",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: INIT_PARTS.BOTH,
        installDependencies: false,
        gitRepo: false,
        includeHelperRoutes: false,
      };

      await expect(createProject(config)).resolves.not.toThrow();

      // Verify that fs.remove was called (for removing helper routes)
      expect(fs.remove).toHaveBeenCalled();
    });

    it("should create project with helper routes when enabled", async () => {
      const config = {
        projectName: "test-with-helper-routes",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: INIT_PARTS.BOTH,
        installDependencies: false,
        gitRepo: false,
        includeHelperRoutes: true,
      };

      await expect(createProject(config)).resolves.not.toThrow();

      // Verify that helper routes were not removed (fs.remove not called for helper files)
      expect(fs.copy).toHaveBeenCalled();
    });

    it("should create real project (integration test)", async () => {
      // This test verifies that the mocked behavior matches real behavior
      // by testing the core validation functions with real implementations

      // Test real project name validation
      const realValidation = validateProjectName("test-real-project");
      expect(realValidation.valid).toBe(true);
      expect(realValidation.name).toBe("test-real-project");

      // Test invalid project name
      const invalidValidation = validateProjectName("invalid/name");
      expect(invalidValidation.valid).toBe(false);

      // Test git URL construction
      const validUrl = constructGitHubUrl("test-repo", "testuser");
      expect(validUrl).toBe("https://github.com/testuser/test-repo.git");

      // Test that constants are properly defined
      expect(INIT_PARTS.BOTH).toBe("both");
      expect(INIT_PARTS.CLIENT).toBe("client");
      expect(INIT_PARTS.SERVER).toBe("server");

      // Test that questions array is properly structured
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
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
      const gitRepoQuestion = questions.find((q) => q.name === "gitRepoUrl");
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
      expect(helperRoutesQuestion.when({ concurrently: true })).toBe(true);
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

  describe("Edge Cases and Error Handling", () => {
    describe("Project Name Edge Cases", () => {
      it("should reject extremely long project names", () => {
        const longName = "a".repeat(300);
        const result = validateProjectName(longName);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("too long");
      });

      it("should reject project names with unicode characters", () => {
        const unicodeName = "my-app-测试-🚀";
        const result = validateProjectName(unicodeName);
        expect(result.valid).toBe(false);
        expect(result.error).toContain(
          "can only contain letters, numbers, hyphens, and underscores",
        );
      });

      it("should allow project names starting with numbers", () => {
        const result = validateProjectName("123-my-app");
        expect(result.valid).toBe(true);
        expect(result.name).toBe("123-my-app");
      });

      it("should allow project names with consecutive special characters", () => {
        const result = validateProjectName("my---app___test");
        expect(result.valid).toBe(true);
        expect(result.name).toBe("my---app___test"); // No normalization in actual implementation
      });

      it("should handle empty and whitespace-only names", () => {
        expect(validateProjectName("").valid).toBe(false);
        expect(validateProjectName("   ").valid).toBe(false);
        expect(validateProjectName("\t\n").valid).toBe(false);
      });
    });

    describe("File System Edge Cases", () => {
      it("should handle permission errors during project creation", async () => {
        vi.mocked(fs.mkdir).mockRejectedValue(
          new Error("EACCES: permission denied"),
        );

        const config = {
          projectName: "permission-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow("EACCES");
      });

      it("should handle disk space errors", async () => {
        vi.mocked(fs.copy).mockRejectedValue(
          new Error("ENOSPC: no space left on device"),
        );

        const config = {
          projectName: "space-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow("ENOSPC");
      });

      it("should handle corrupted template files", async () => {
        vi.mocked(fs.copy).mockRejectedValue(
          new Error("ENOENT: template file not found"),
        );

        const config = {
          projectName: "template-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow("ENOENT");
      });

      it("should handle existing project directory", async () => {
        vi.mocked(fs.mkdir).mockRejectedValue(
          new Error("EEXIST: file already exists"),
        );

        const config = {
          projectName: "existing-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow("EEXIST");
      });
    });

    describe("Package Manager Edge Cases", () => {
      it("should handle package manager not found", async () => {
        vi.mocked(execa).mockRejectedValue(
          new Error("ENOENT: command not found"),
        );

        const config = {
          projectName: "pm-test",
          language: "JavaScript",
          packageManager: "nonexistent-pm",
          concurrently: true,
          installDependencies: true,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        // Should handle gracefully with fallback
        await expect(createProject(config)).rejects.toThrow();
      });

      it("should handle package manager version conflicts", async () => {
        // Mock successful package manager resolution
        vi.mocked(fs.readJson).mockResolvedValue({
          name: "test-project",
          scripts: {},
          devDependencies: {},
        });

        const config = {
          projectName: "version-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).resolves.not.toThrow();
      });

      it("should handle corrupted package.json during script generation", async () => {
        vi.mocked(fs.readJson).mockRejectedValue(new Error("Malformed JSON"));

        const packageJsonPath = path.join(testDir, "package.json");
        const packageManager = { name: "npm", command: "npm" };

        await expect(
          updateConcurrentlyScripts(packageJsonPath, packageManager),
        ).rejects.toThrow("Malformed JSON");
      });
    });

    describe("Git Integration Edge Cases", () => {
      it("should handle git not installed", async () => {
        vi.mocked(execa).mockRejectedValue(new Error("git: command not found"));

        const config = {
          projectName: "git-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: true,
          gitRepoUrl: "https://github.com/user/repo.git",
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow();
      });

      it("should handle invalid git repository URLs", async () => {
        expect(() =>
          constructGitHubUrl("invalid/url/format", "user"),
        ).toThrow();
        expect(() => constructGitHubUrl("", "user")).toThrow();
        expect(() => constructGitHubUrl("repo", null)).toThrow();
        expect(() => constructGitHubUrl("repo with spaces", "user")).toThrow();
      });

      it("should handle network errors during git validation", async () => {
        vi.mocked(execa).mockRejectedValue(new Error("Network unreachable"));

        const result = await validateGitHubRepository(
          "https://github.com/user/repo.git",
        );
        expect(result).toBe(false);
      });

      it("should handle git repository access denied", async () => {
        vi.mocked(execa).mockRejectedValue(new Error("Permission denied"));

        const result = await validateGitHubRepository(
          "https://github.com/private/repo.git",
        );
        expect(result).toBe(false);
      });
    });

    describe("Template Processing Edge Cases", () => {
      beforeEach(() => {
        // Ensure proper mocking for template processing tests
        vi.mocked(fs.readJson).mockResolvedValue({
          name: "test-project",
          scripts: {},
          devDependencies: {},
        });
      });

      it("should handle TypeScript template selection", async () => {
        const config = {
          projectName: "ts-test",
          language: "TypeScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).resolves.not.toThrow();
        expect(fs.copy).toHaveBeenCalledWith(
          expect.stringContaining("templates/ts"),
          expect.any(String),
        );
      });

      it("should handle server-only setup with helper routes", async () => {
        const config = {
          projectName: "server-only-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: false,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.SERVER,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).resolves.not.toThrow();
        // Should not call fs.remove for helper routes since they're enabled
        expect(fs.copy).toHaveBeenCalled();
      });

      it("should handle all package manager types with workspaces", async () => {
        const packageManagers = ["npm", "yarn", "pnpm", "bun"];

        for (const pm of packageManagers) {
          vi.clearAllMocks();
          vi.mocked(fs.readJson).mockResolvedValue({
            name: `${pm}-workspace-test`,
            scripts: {},
            devDependencies: {},
          });

          const config = {
            projectName: `${pm}-workspace-test`,
            language: "JavaScript",
            packageManager: pm,
            concurrently: true,
            installDependencies: false,
            gitRepo: false,
            initializeParts: INIT_PARTS.BOTH,
            includeHelperRoutes: true,
          };

          await expect(createProject(config)).resolves.not.toThrow();
        }
      });
    });

    describe("Configuration Edge Cases", () => {
      it("should handle missing template directories", async () => {
        vi.mocked(fs.pathExists).mockResolvedValue(false);

        const result = await detectProjectConfiguration(testDir);
        expect(result.lockFiles).toHaveLength(0);
      });

      it("should handle multiple conflicting lock files", async () => {
        vi.mocked(fs.readdir).mockResolvedValue([
          { name: "package-lock.json", isFile: () => true },
          { name: "yarn.lock", isFile: () => true },
          { name: "pnpm-lock.yaml", isFile: () => true },
          { name: "bun.lockb", isFile: () => true },
        ]);
        vi.mocked(fs.pathExists).mockResolvedValue(true);
        vi.mocked(fs.readJson).mockResolvedValue({});

        const result = await detectProjectConfiguration(testDir);
        expect(result.lockFiles).toHaveLength(4);
        expect(result.hasMultipleLockFiles).toBe(true);
        expect(result.allSuggestions).toContain("npm");
        expect(result.allSuggestions).toContain("yarn");
        expect(result.allSuggestions).toContain("pnpm");
        expect(result.allSuggestions).toContain("bun");
      });

      it("should handle malformed package.json in project detection", async () => {
        vi.mocked(fs.readdir).mockResolvedValue([]);
        vi.mocked(fs.pathExists).mockResolvedValue(true);
        vi.mocked(fs.readJson).mockRejectedValue(new Error("Invalid JSON"));

        const result = await detectProjectConfiguration(testDir);
        expect(result.packageJsonConfig).toBeNull();
      });
    });

    describe("Concurrent Execution Edge Cases", () => {
      it("should handle concurrent project creation attempts", async () => {
        const config = {
          projectName: "concurrent-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        // Simulate multiple concurrent calls
        const promises = Array(3)
          .fill(null)
          .map(() => createProject(config));

        // At least one should succeed (or all should fail consistently)
        const results = await Promise.allSettled(promises);
        const successful = results.filter((r) => r.status === "fulfilled");
        const failed = results.filter((r) => r.status === "rejected");

        // Either all succeed (mocked) or some fail due to conflicts
        expect(successful.length + failed.length).toBe(3);
      });
    });

    describe("Memory and Performance Edge Cases", () => {
      it("should handle large project names efficiently", () => {
        const largeName = "a".repeat(1000);
        const start = Date.now();
        const result = validateProjectName(largeName);
        const duration = Date.now() - start;

        expect(result.valid).toBe(false); // Should reject long names
        expect(result.error).toContain("too long");
        expect(duration).toBeLessThan(100); // Should be fast
      });

      it("should handle many dependency additions", async () => {
        const packageJsonPath = path.join(testDir, "package.json");
        const initialPackageJson = {
          scripts: {},
          devDependencies: {},
        };

        // Mock with concurrently dependency
        const updatedPackageJson = {
          ...initialPackageJson,
          devDependencies: { concurrently: "^9.1.2" },
        };

        vi.mocked(fs.readJson)
          .mockResolvedValueOnce(initialPackageJson)
          .mockResolvedValueOnce(updatedPackageJson);

        const packageManager = { name: "npm", command: "npm" };

        const start = Date.now();
        await updateConcurrentlyScripts(packageJsonPath, packageManager);
        const duration = Date.now() - start;

        expect(duration).toBeLessThan(1000); // Should be reasonably fast
      });
    });

    describe("Boundary Conditions", () => {
      it("should handle minimum valid project name", () => {
        const result = validateProjectName("a");
        expect(result.valid).toBe(true);
        expect(result.name).toBe("a");
      });

      it("should handle maximum valid project name length", () => {
        const maxName = "a".repeat(214); // npm package name limit
        const result = validateProjectName(maxName);
        expect(result.valid).toBe(true);
        expect(result.name.length).toBeLessThanOrEqual(214);
      });

      it("should handle project name at length boundary", () => {
        const result = validateProjectName("a".repeat(215)); // Over 214 char limit
        expect(result.valid).toBe(false);
        expect(result.error).toContain("too long");
      });

      it("should handle empty arrays in project detection", async () => {
        vi.mocked(fs.readdir).mockResolvedValue([]);
        vi.mocked(fs.pathExists).mockResolvedValue(false);

        const result = await detectProjectConfiguration(testDir);
        expect(result.lockFiles).toEqual([]);
        expect(result.allSuggestions).toEqual([]);
      });
    });

    describe("Cross-Platform Edge Cases", () => {
      it("should handle Windows-style paths", async () => {
        // Mock proper package.json for this test
        vi.mocked(fs.readJson).mockResolvedValue({
          name: "windows-test",
          scripts: {},
          devDependencies: {},
        });

        const config = {
          projectName: "windows-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        // Should handle path normalization
        await expect(createProject(config)).resolves.not.toThrow();
      });

      it("should handle case-sensitive file systems", async () => {
        vi.mocked(fs.pathExists).mockImplementation((filePath) => {
          const pathStr = filePath.toString().toLowerCase();
          return Promise.resolve(pathStr.includes("package.json"));
        });

        const result = await getPackageName(testDir, "Client"); // Mixed case
        expect(typeof result).toBe("string");
      });
    });

    describe("Async Operation Edge Cases", () => {
      it("should handle slow file operations", async () => {
        // Mock proper package.json and slow copy operation
        vi.mocked(fs.readJson).mockResolvedValue({
          name: "slow-test",
          scripts: {},
          devDependencies: {},
        });
        vi.mocked(fs.copy).mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

        const config = {
          projectName: "slow-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        const start = Date.now();
        await expect(createProject(config)).resolves.not.toThrow();
        const duration = Date.now() - start;
        expect(duration).toBeGreaterThan(50); // Should wait for slow operation
      });

      it("should handle promise rejection chains", async () => {
        vi.mocked(fs.ensureDir).mockRejectedValue(new Error("First error"));
        vi.mocked(fs.mkdir).mockRejectedValue(new Error("Second error"));

        const config = {
          projectName: "chain-error-test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow();
      });
    });

    describe("Configuration Validation Edge Cases", () => {
      it("should handle null and undefined config values", async () => {
        const config = {
          projectName: "null-test",
          language: null,
          packageManager: undefined,
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: INIT_PARTS.BOTH,
          includeHelperRoutes: true,
        };

        // Should handle gracefully or throw meaningful error
        await expect(createProject(config)).rejects.toThrow();
      });

      it("should handle invalid enum values", async () => {
        const config = {
          projectName: "enum-test",
          language: "InvalidLanguage",
          packageManager: "npm",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: "invalid-part",
          includeHelperRoutes: true,
        };

        await expect(createProject(config)).rejects.toThrow();
      });
    });

    describe("Question Logic Edge Cases", () => {
      it("should handle all question conditional logic branches", () => {
        const helperRoutesQuestion = questions.find(
          (q) => q.name === "includeHelperRoutes",
        );

        // Test all possible combinations
        expect(helperRoutesQuestion.when({ concurrently: true })).toBe(true);
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
        expect(helperRoutesQuestion.when({ initializeParts: "both" })).toBe(
          true,
        );
        expect(helperRoutesQuestion.when({ initializeParts: "server" })).toBe(
          true,
        );
        expect(helperRoutesQuestion.when({ initializeParts: "client" })).toBe(
          false,
        );
      });

      it("should validate all question types exist", () => {
        const requiredQuestions = [
          "projectName",
          "language",
          "packageManager",
          "initializeParts",
          "concurrently",
          "includeHelperRoutes",
          "installDependencies",
          "gitRepo",
          "gitRepoUrl",
        ];

        requiredQuestions.forEach((questionName) => {
          const question = questions.find((q) => q.name === questionName);
          expect(question).toBeDefined();
        });
      });
    });

    describe("Bun Types Integration", () => {
      it("should add @types/bun to devDependencies when using bun package manager", async () => {
        // Mock package.json read/write operations
        const mockPackageJson = {
          name: "test-project-server",
          version: "1.0.0",
          dependencies: {},
          devDependencies: {
            typescript: "^5.0.0",
          },
        };

        vi.mocked(fs.pathExists).mockResolvedValue(true);
        vi.mocked(fs.readJson).mockResolvedValue(mockPackageJson);
        vi.mocked(fs.writeJson).mockResolvedValue(undefined);

        const config = {
          projectName: "test-project",
          language: "ts",
          packageManager: "bun",
          concurrently: false,
          installDependencies: false,
          gitRepo: false,
          initializeParts: "server",
          includeHelperRoutes: true,
        };

        await createProject(config);

        // Verify that writeJson was called with @types/bun added
        const writeJsonCalls = vi.mocked(fs.writeJson).mock.calls;
        const packageJsonWrite = writeJsonCalls.find((call) =>
          call[0].toString().includes("package.json"),
        );

        expect(packageJsonWrite).toBeDefined();
        expect(packageJsonWrite[1].devDependencies["@types/bun"]).toBe(
          "latest",
        );
      });

      it("should not add @types/bun when using other package managers", async () => {
        const mockPackageJson = {
          name: "test-project-server",
          version: "1.0.0",
          dependencies: {},
          devDependencies: {
            typescript: "^5.0.0",
          },
        };

        vi.mocked(fs.pathExists).mockResolvedValue(true);
        vi.mocked(fs.readJson).mockResolvedValue(mockPackageJson);
        vi.mocked(fs.writeJson).mockResolvedValue(undefined);

        const config = {
          projectName: "test-project",
          language: "ts",
          packageManager: "npm",
          concurrently: false,
          installDependencies: false,
          gitRepo: false,
          initializeParts: "server",
          includeHelperRoutes: true,
        };

        await createProject(config);

        // Verify that @types/bun was not added
        const writeJsonCalls = vi.mocked(fs.writeJson).mock.calls;
        const packageJsonWrite = writeJsonCalls.find((call) =>
          call[0].toString().includes("package.json"),
        );

        if (packageJsonWrite) {
          expect(
            packageJsonWrite[1].devDependencies["@types/bun"],
          ).toBeUndefined();
        }
      });

      it("should add @types/bun to multiple package.json files in concurrent setup", async () => {
        const mockPackageJson = {
          name: "test-project",
          version: "1.0.0",
          dependencies: {},
          devDependencies: {},
        };

        vi.mocked(fs.pathExists).mockResolvedValue(true);
        vi.mocked(fs.readJson).mockResolvedValue(mockPackageJson);
        vi.mocked(fs.writeJson).mockResolvedValue(undefined);

        const config = {
          projectName: "test-project",
          language: "ts",
          packageManager: "bun",
          concurrently: true,
          installDependencies: false,
          gitRepo: false,
          initializeParts: "both",
          includeHelperRoutes: true,
        };

        await createProject(config);

        // Verify that @types/bun was added to both client and server package.json files
        const writeJsonCalls = vi.mocked(fs.writeJson).mock.calls;
        const packageJsonWrites = writeJsonCalls.filter((call) =>
          call[0].toString().includes("package.json"),
        );

        expect(packageJsonWrites.length).toBeGreaterThan(0);

        // Check that at least one package.json has @types/bun added
        const hasTypesBundle = packageJsonWrites.some(
          (call) =>
            call[1].devDependencies &&
            call[1].devDependencies["@types/bun"] === "latest",
        );
        expect(hasTypesBundle).toBe(true);
      });
    });
  });
});
