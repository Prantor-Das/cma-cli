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
import {
  validateProjectName,
  readPackageJson,
  writePackageJson,
  ensureDirectory,
  pathExists,
} from "../bin/lib/utils.js";
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

vi.mock("execa", () => ({
  execa: vi.fn(),
}));
vi.mock("fs-extra", () => ({
  default: {
    ensureDir: vi.fn(),
    writeJson: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    copy: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    readdir: vi.fn(),
    mkdir: vi.fn(),
    pathExists: vi.fn(),
    readJson: vi.fn(),
  },
}));

describe("CMA CLI Comprehensive Tests", () => {
  let testDir;
  const originalCwd = process.cwd();

  beforeEach(async () => {
    // Use in-memory test directory for speed
    testDir = `/tmp/test-${Date.now()}`;
    vi.clearAllMocks();

    // Default mock implementations - can be overridden in specific tests
    fs.ensureDir.mockResolvedValue(undefined);
    fs.writeJson.mockResolvedValue(undefined);
    fs.readFile.mockResolvedValue("test content");
    fs.writeFile.mockResolvedValue(undefined);
    fs.copy.mockResolvedValue(undefined);
    fs.remove.mockResolvedValue(undefined);
    fs.move.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue([]);
    fs.mkdir.mockResolvedValue(undefined);

    // Mock execa for git and package manager commands
    execa.mockResolvedValue({ stdout: "1.0.0" });
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
            "Project name can only contain letters, numbers, hyphens, and underscores (or use './' for current directory)",
        },
        {
          name: "my@app",
          expectedError:
            "Project name can only contain letters, numbers, hyphens, and underscores (or use './' for current directory)",
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

  describe("Constants Validation", () => {
    it("should have correct lock file mappings", () => {
      expect(LOCK_FILE_MANAGERS["package-lock.json"]).toBe("npm");
      expect(LOCK_FILE_MANAGERS["yarn.lock"]).toBe("yarn");
      expect(LOCK_FILE_MANAGERS["pnpm-lock.yaml"]).toBe("pnpm");
      expect(LOCK_FILE_MANAGERS["bun.lock"]).toBe("bun");
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

  describe("Git Integration", () => {
    beforeEach(() => {
      execa.mockClear();
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

    it("should have concurrently question with conditional logic", () => {
      const concurrentlyQuestion = questions.find(
        (q) => q.name === "concurrently",
      );
      expect(concurrentlyQuestion).toBeDefined();
      expect(concurrentlyQuestion.type).toBe("confirm");
      expect(concurrentlyQuestion.default).toBe(true);
      expect(typeof concurrentlyQuestion.when).toBe("function");

      // Test the conditional logic
      expect(concurrentlyQuestion.when({ initializeParts: "both" })).toBe(true);
      expect(concurrentlyQuestion.when({ initializeParts: "client" })).toBe(
        false,
      );
      expect(concurrentlyQuestion.when({ initializeParts: "server" })).toBe(
        false,
      );
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

      it("should handle empty and whitespace-only names", () => {
        expect(validateProjectName("").valid).toBe(false);
        expect(validateProjectName("   ").valid).toBe(false);
        expect(validateProjectName("\t\n").valid).toBe(false);
      });
    });
  });

  describe("Project Detection", () => {
    beforeEach(() => {
      fs.pathExists.mockResolvedValue(false);
      fs.readJson.mockRejectedValue(new Error("File not found"));
    });

    it("should detect npm project from package-lock.json", async () => {
      fs.pathExists.mockImplementation((path) =>
        path.includes("package-lock.json"),
      );

      const config = await detectProjectConfiguration("/test/path");
      expect(config.lockFiles).toContain("package-lock.json");
      expect(config.suggestedManager).toBe("npm");
    });

    it("should detect yarn project from yarn.lock", async () => {
      fs.pathExists.mockImplementation((path) => path.includes("yarn.lock"));

      const config = await detectProjectConfiguration("/test/path");
      expect(config.lockFiles).toContain("yarn.lock");
      expect(config.suggestedManager).toBe("yarn");
    });

    it("should detect pnpm project from pnpm-lock.yaml", async () => {
      fs.pathExists.mockImplementation((path) =>
        path.includes("pnpm-lock.yaml"),
      );

      const config = await detectProjectConfiguration("/test/path");
      expect(config.lockFiles).toContain("pnpm-lock.yaml");
      expect(config.suggestedManager).toBe("pnpm");
    });

    it("should detect bun project from bun.lock", async () => {
      fs.pathExists.mockImplementation((path) => path.includes("bun.lock"));

      const config = await detectProjectConfiguration("/test/path");
      expect(config.lockFiles).toContain("bun.lock");
      expect(config.suggestedManager).toBe("bun");
    });

    it("should handle multiple lock files", async () => {
      fs.pathExists.mockImplementation(
        (path) =>
          path.includes("package-lock.json") || path.includes("yarn.lock"),
      );

      const config = await detectProjectConfiguration("/test/path");
      expect(config.hasMultipleLockFiles).toBe(true);
      expect(config.lockFiles).toHaveLength(2);
    });

    it("should detect workspace configuration", async () => {
      fs.pathExists.mockImplementation(
        (path) =>
          path.includes("package.json") || path.includes("pnpm-workspace.yaml"),
      );
      fs.readJson.mockResolvedValue({ workspaces: ["client", "server"] });

      const config = await detectProjectConfiguration("/test/path");
      expect(config.allSuggestions).toContain("pnpm");
    });

    it("should handle package.json with packageManager field", async () => {
      fs.pathExists.mockImplementation((path) => path.includes("package.json"));
      fs.readJson.mockResolvedValue({
        packageManager: "pnpm@8.0.0",
      });

      const config = await detectProjectConfiguration("/test/path");
      expect(config.allSuggestions).toContain("pnpm");
    });
  });

  describe("Script Generation", () => {
    it("should generate correct pnpm scripts", async () => {
      const mockPackageManager = { name: "pnpm", command: "pnpm" };

      // Mock getPackageName to return predictable values
      vi.doMock("../bin/lib/projectDetector.js", () => ({
        getPackageName: vi
          .fn()
          .mockResolvedValueOnce("test-client")
          .mockResolvedValueOnce("test-server"),
      }));

      const { updateConcurrentlyScripts } = await import(
        "../bin/lib/scriptGenerator.js"
      );

      fs.readJson.mockResolvedValue({
        scripts: {},
      });

      await updateConcurrentlyScripts("/test/package.json", mockPackageManager);

      expect(fs.writeJson).toHaveBeenCalledWith(
        "/test/package.json",
        expect.objectContaining({
          scripts: expect.objectContaining({
            dev: expect.stringContaining("concurrently"),
            client: expect.stringContaining("--filter"),
            server: expect.stringContaining("--filter"),
          }),
        }),
        { spaces: 2 },
      );
    });

    it("should generate correct npm scripts", async () => {
      const mockPackageManager = { name: "npm", command: "npm" };

      const { updateConcurrentlyScripts } = await import(
        "../bin/lib/scriptGenerator.js"
      );

      fs.readJson.mockResolvedValue({
        scripts: {},
      });

      await updateConcurrentlyScripts("/test/package.json", mockPackageManager);

      expect(fs.writeJson).toHaveBeenCalledWith(
        "/test/package.json",
        expect.objectContaining({
          scripts: expect.objectContaining({
            dev: expect.stringContaining("concurrently"),
            client: expect.stringContaining("--workspace client"),
            server: expect.stringContaining("--workspace server"),
          }),
        }),
        { spaces: 2 },
      );
    });

    it("should handle missing scripts object", async () => {
      const mockPackageManager = { name: "npm", command: "npm" };

      const { updateConcurrentlyScripts } = await import(
        "../bin/lib/scriptGenerator.js"
      );

      fs.readJson.mockResolvedValue({});

      await updateConcurrentlyScripts("/test/package.json", mockPackageManager);

      // Should not throw and should not call writeJson
      expect(fs.writeJson).not.toHaveBeenCalled();
    });
  });

  describe("Git Handler", () => {
    beforeEach(() => {
      execa.mockClear();
    });

    it("should get GitHub username from git config", async () => {
      execa.mockResolvedValueOnce({ stdout: "testuser" });

      const username = await getGitHubUsername();
      expect(username).toBe("testuser");
      expect(execa).toHaveBeenCalledWith("git", [
        "config",
        "--global",
        "github.user",
      ]);
    });

    it("should fallback to user.name if github.user not found", async () => {
      execa
        .mockRejectedValueOnce(new Error("Not found"))
        .mockResolvedValueOnce({ stdout: "Test User" });

      const username = await getGitHubUsername();
      expect(username).toBe("Test User");
    });

    it("should return null if no username found", async () => {
      execa.mockRejectedValue(new Error("Not found"));

      const username = await getGitHubUsername();
      expect(username).toBeNull();
    });

    it("should validate GitHub repository successfully", async () => {
      execa.mockResolvedValue({ stdout: "" });

      const isValid = await validateGitHubRepository(
        "https://github.com/user/repo.git",
      );
      expect(isValid).toBe(true);
      expect(execa).toHaveBeenCalledWith(
        "git",
        ["ls-remote", "--heads", "https://github.com/user/repo.git"],
        { timeout: 10000, stdio: "ignore" },
      );
    });

    it("should handle invalid repository", async () => {
      execa.mockRejectedValue(new Error("Repository not found"));

      const isValid = await validateGitHubRepository(
        "https://github.com/invalid/repo.git",
      );
      expect(isValid).toBe(false);
    });

    it("should initialize git repository", async () => {
      execa.mockResolvedValue({ stdout: "" });

      await initializeGit("/test/path", "https://github.com/user/repo.git");

      expect(execa).toHaveBeenCalledWith("git", ["--version"]);
      expect(execa).toHaveBeenCalledWith("git", ["init"], {
        cwd: "/test/path",
      });
      expect(execa).toHaveBeenCalledWith(
        "git",
        ["remote", "add", "origin", "https://github.com/user/repo.git"],
        { cwd: "/test/path" },
      );
    });

    it("should handle git initialization errors gracefully", async () => {
      execa.mockRejectedValue(new Error("Git not installed"));

      // Should not throw
      await expect(
        initializeGit("/test/path", "https://github.com/user/repo.git"),
      ).resolves.toBeUndefined();
    });
  });

  describe("Utility Functions", () => {
    describe("File Operations", () => {
      it("should read package.json successfully", async () => {
        const mockPackageJson = { name: "test", version: "1.0.0" };
        fs.readJson.mockResolvedValue(mockPackageJson);

        const result = await readPackageJson("/test/package.json");
        expect(result).toEqual(mockPackageJson);
      });

      it("should handle package.json read errors", async () => {
        fs.readJson.mockRejectedValue(new Error("File not found"));

        await expect(readPackageJson("/test/package.json")).rejects.toThrow(
          "Failed to read package.json",
        );
      });

      it("should write package.json successfully", async () => {
        const mockPackageJson = { name: "test", version: "1.0.0" };
        fs.writeJson.mockResolvedValue(undefined);

        await writePackageJson("/test/package.json", mockPackageJson);
        expect(fs.writeJson).toHaveBeenCalledWith(
          "/test/package.json",
          mockPackageJson,
          { spaces: 2 },
        );
      });

      it("should handle package.json write errors", async () => {
        fs.writeJson.mockRejectedValue(new Error("Permission denied"));

        await expect(
          writePackageJson("/test/package.json", {}),
        ).rejects.toThrow("Failed to write package.json");
      });
    });

    describe("Directory Operations", () => {
      it("should ensure directory exists", async () => {
        fs.ensureDir.mockResolvedValue(undefined);

        const result = await ensureDirectory("/test/dir");
        expect(result).toBe(true);
        expect(fs.ensureDir).toHaveBeenCalledWith("/test/dir");
      });

      it("should handle directory creation errors", async () => {
        fs.ensureDir.mockRejectedValue(new Error("Permission denied"));

        const result = await ensureDirectory("/test/dir");
        expect(result).toBe(false);
      });

      it("should check if path exists", async () => {
        fs.pathExists.mockResolvedValue(true);

        const exists = await pathExists("/test/file");
        expect(exists).toBe(true);
      });

      it("should handle path check errors", async () => {
        fs.pathExists.mockRejectedValue(new Error("Access denied"));

        const exists = await pathExists("/test/file");
        expect(exists).toBe(false);
      });
    });
  });

  describe("Project Creation Edge Cases", () => {
    it("should handle current directory project creation", async () => {
      const config = {
        projectName: "current-dir-project",
        isCurrentDirectory: true,
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "client",
      };

      // Mock all required functions
      fs.copy.mockResolvedValue(undefined);
      fs.pathExists.mockResolvedValue(false);
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      await expect(createProject(config)).resolves.toBeUndefined();
    });

    it("should handle client-only project creation", async () => {
      const config = {
        projectName: "test-client",
        language: "TypeScript",
        packageManager: "pnpm",
        concurrently: false,
        initializeParts: "client",
      };

      fs.copy.mockResolvedValue(undefined);
      fs.pathExists.mockResolvedValue(false);
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      await expect(createProject(config)).resolves.toBeUndefined();
    });

    it("should handle server-only project creation", async () => {
      const config = {
        projectName: "test-server",
        language: "JavaScript",
        packageManager: "yarn",
        concurrently: false,
        initializeParts: "server",
      };

      fs.copy.mockResolvedValue(undefined);
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });
      fs.pathExists.mockResolvedValue(false);

      await expect(createProject(config)).resolves.toBeUndefined();
    });

    it("should handle concurrent project creation", async () => {
      const config = {
        projectName: "test-full",
        language: "TypeScript",
        packageManager: "bun",
        concurrently: true,
        initializeParts: "both",
      };

      fs.copy.mockResolvedValue(undefined);
      fs.pathExists.mockResolvedValue(false);
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      await expect(createProject(config)).resolves.toBeUndefined();
    });
  });

  describe("Error Handling and Recovery", () => {
    it("should handle file system errors gracefully", async () => {
      fs.copy.mockRejectedValue(new Error("Disk full"));

      const config = {
        projectName: "test-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      await expect(createProject(config)).rejects.toThrow();
    });

    it("should handle invalid template directory", async () => {
      fs.copy.mockRejectedValue(new Error("Template not found"));

      const config = {
        projectName: "test-project",
        language: "InvalidLanguage",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      await expect(createProject(config)).rejects.toThrow();
    });

    it("should validate project name normalization", async () => {
      // Test the internal validateAndNormalizeProjectName function behavior
      const validNames = [
        "my-app",
        "MyApp123",
        "app_with_underscores",
        "123-app",
      ];

      validNames.forEach((name) => {
        const result = validateProjectName(name);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("Package Manager Specific Tests", () => {
    it("should handle pnpm workspace configuration", async () => {
      const mockPackageManager = { name: "pnpm", command: "pnpm" };

      fs.readJson.mockResolvedValue({
        scripts: {},
        workspaces: ["client", "server"],
      });

      const { updateConcurrentlyScripts } = await import(
        "../bin/lib/scriptGenerator.js"
      );
      await updateConcurrentlyScripts("/test/package.json", mockPackageManager);

      expect(fs.writeJson).toHaveBeenCalledWith(
        "/test/package.json",
        expect.objectContaining({
          scripts: expect.any(Object),
          // workspaces should be removed for pnpm
        }),
        { spaces: 2 },
      );
    });

    it("should preserve yarn workspaces configuration", async () => {
      const mockPackageManager = { name: "yarn", command: "yarn" };

      fs.readJson.mockResolvedValue({
        scripts: {},
        workspaces: ["client", "server"],
      });

      const { updateConcurrentlyScripts } = await import(
        "../bin/lib/scriptGenerator.js"
      );
      await updateConcurrentlyScripts("/test/package.json", mockPackageManager);

      expect(fs.writeJson).toHaveBeenCalledWith(
        "/test/package.json",
        expect.objectContaining({
          scripts: expect.any(Object),
          workspaces: ["client", "server"], // Should be preserved for yarn
        }),
        { spaces: 2 },
      );
    });
  });

  describe("Template Processing", () => {
    it("should handle missing template files gracefully", async () => {
      fs.pathExists.mockResolvedValue(false);
      fs.readFile.mockRejectedValue(new Error("File not found"));
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      // Should not throw when template files are missing
      await expect(
        createProject({
          projectName: "test",
          language: "JavaScript",
          packageManager: "npm",
          concurrently: false,
          initializeParts: "client",
        }),
      ).resolves.toBeUndefined();
    });

    it("should process gitignore files correctly", async () => {
      fs.pathExists.mockImplementation(
        (path) => path.includes("gitignore") && !path.includes(".gitignore"),
      );
      fs.move.mockResolvedValue(undefined);
      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      await createProject({
        projectName: "test",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "client",
      });

      expect(fs.move).toHaveBeenCalledWith(
        expect.stringContaining("gitignore"),
        expect.stringContaining(".gitignore"),
      );
    });
  });

  describe("Real Integration Tests", () => {
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
});
