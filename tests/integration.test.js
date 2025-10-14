import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { createProject } from "../bin/actions.js";

vi.mock("execa", () => ({
  execa: vi.fn(),
}));

vi.mock("fs-extra", () => ({
  default: {
    pathExists: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    copy: vi.fn(),
    move: vi.fn(),
    remove: vi.fn(),
    mkdir: vi.fn(),
    ensureDir: vi.fn(),
    readJson: vi.fn(),
    writeJson: vi.fn(),
    readdir: vi.fn(),
  },
}));

describe("Integration Tests", () => {
  let mockProjectPath;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectPath = "/tmp/test-project";

    // Default successful mocks
    fs.pathExists.mockResolvedValue(false);
    fs.mkdir.mockResolvedValue(undefined);
    fs.copy.mockResolvedValue(undefined);
    fs.move.mockResolvedValue(undefined);
    fs.readFile.mockResolvedValue("mock content");
    fs.writeFile.mockResolvedValue(undefined);
    fs.readJson.mockResolvedValue({ name: "test", scripts: {} });
    fs.writeJson.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue([]);

    // Mock execa with realistic package manager responses
    execa.mockImplementation((command, args) => {
      // Package manager version checks
      if (args && args.includes("--version")) {
        return Promise.resolve({ stdout: "1.0.0" });
      }
      // Package manager health checks
      if (command === "npm" && args && args.includes("config")) {
        return Promise.resolve({ stdout: "https://registry.npmjs.org/" });
      }
      if (command === "yarn" && args && args.includes("cache")) {
        return Promise.resolve({ stdout: "/path/to/cache" });
      }
      if (command === "pnpm" && args && args.includes("store")) {
        return Promise.resolve({ stdout: "Store is clean" });
      }
      if (command === "bun" && args && args.includes("--help")) {
        return Promise.resolve({ stdout: "Bun help text" });
      }
      // Default for other commands
      return Promise.resolve({ stdout: "success" });
    });
  });

  describe("Full Project Creation Workflows", () => {
    it("should create a complete JavaScript MERN project with npm", async () => {
      const config = {
        projectName: "test-js-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: "both",
        gitRepoUrl: "https://github.com/user/test-repo.git",
      };

      await createProject(config);

      // Verify directory creation
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining("test-js-project"),
      );

      // Verify template copying
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining("templates/js"),
        expect.stringContaining("test-js-project"),
      );

      // Verify that execa was called (package manager detection happens first)
      expect(execa).toHaveBeenCalled();
    });

    it("should create a TypeScript MERN project with pnpm", async () => {
      const config = {
        projectName: "test-ts-project",
        language: "TypeScript",
        packageManager: "pnpm",
        concurrently: true,
        initializeParts: "both",
      };

      await createProject(config);

      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining("templates/ts"),
        expect.stringContaining("test-ts-project"),
      );
    });

    it("should create a client-only project", async () => {
      const config = {
        projectName: "client-app",
        language: "JavaScript",
        packageManager: "yarn",
        concurrently: false,
        initializeParts: "client",
      };

      await createProject(config);

      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining("templates/js/client"),
        expect.stringContaining("client-app-client"),
      );
    });

    it("should create a server-only project", async () => {
      const config = {
        projectName: "api-server",
        language: "TypeScript",
        packageManager: "bun",
        concurrently: false,
        initializeParts: "server",
      };

      await createProject(config);

      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining("templates/ts/server"),
        expect.stringContaining("api-server-server"),
      );
    });

    it("should create project in current directory", async () => {
      const config = {
        projectName: "current-project",
        isCurrentDirectory: true,
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      fs.readJson.mockResolvedValue({ name: "test", scripts: {} });

      await createProject(config);

      // Should not create new directory when using current directory
      expect(fs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe("Package Manager Integration", () => {
    it("should handle npm workspace setup", async () => {
      const config = {
        projectName: "npm-workspace",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: "both",
      };

      fs.readJson.mockResolvedValue({
        name: "npm-workspace",
        scripts: {},
        workspaces: ["client", "server"],
      });

      await createProject(config);

      expect(fs.writeJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          scripts: expect.objectContaining({
            dev: expect.stringContaining("concurrently"),
          }),
        }),
        { spaces: 2 },
      );
    });

    it("should handle yarn workspace setup", async () => {
      const config = {
        projectName: "yarn-workspace",
        language: "TypeScript",
        packageManager: "yarn",
        concurrently: true,
        initializeParts: "both",
      };

      await createProject(config);

      expect(fs.writeJson).toHaveBeenCalled();
    });

    it("should handle pnpm workspace setup", async () => {
      const config = {
        projectName: "pnpm-workspace",
        language: "JavaScript",
        packageManager: "pnpm",
        concurrently: true,
        initializeParts: "both",
      };

      await createProject(config);

      // Verify project creation completed
      expect(fs.copy).toHaveBeenCalled();
    });

    it("should handle bun workspace setup", async () => {
      const config = {
        projectName: "bun-workspace",
        language: "TypeScript",
        packageManager: "bun",
        concurrently: true,
        initializeParts: "both",
      };

      await createProject(config);

      expect(fs.writeJson).toHaveBeenCalled();
    });
  });

  describe("Template Processing Integration", () => {
    it("should process all template files correctly", async () => {
      const config = {
        projectName: "full-processing",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      // Mock file existence for various template files
      fs.pathExists.mockImplementation((filePath) => {
        return (
          filePath.includes("gitignore") ||
          filePath.includes("index.html") ||
          filePath.includes("Navigation.jsx") ||
          filePath.includes(".env.example")
        );
      });

      fs.readFile.mockImplementation((filePath) => {
        if (filePath.includes("index.html")) {
          return Promise.resolve("<title>cma-cli</title>");
        }
        if (filePath.includes("Navigation.jsx")) {
          return Promise.resolve("const title = 'cma-cli';");
        }
        if (filePath.includes(".env.example")) {
          return Promise.resolve("VITE_APP_NAME=cma-cli");
        }
        return Promise.resolve("mock content");
      });

      await createProject(config);

      // Verify gitignore renaming
      expect(fs.move).toHaveBeenCalledWith(
        expect.stringContaining("gitignore"),
        expect.stringContaining(".gitignore"),
      );

      // Verify content replacement
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining("index.html"),
        expect.stringContaining("full-processing"),
        "utf8",
      );
    });

    it("should handle client-only template processing", async () => {
      const config = {
        projectName: "client-only",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "client",
      };

      fs.pathExists.mockImplementation((filePath) => {
        return (
          filePath.includes("Demo.jsx") ||
          filePath.includes("constants.js") ||
          filePath.includes("package.json")
        );
      });

      fs.readFile.mockImplementation((filePath) => {
        if (filePath.includes("Demo.jsx")) {
          return Promise.resolve(`
            import axios from 'axios';
            import { API_ENDPOINTS } from '../config/constants';
            export default function Demo() { return <div>Demo</div>; }
          `);
        }
        if (filePath.includes("constants.js")) {
          return Promise.resolve(`
            export const API_ENDPOINTS = { users: '/api/users' };
          `);
        }
        return Promise.resolve("{}");
      });

      fs.readJson.mockResolvedValue({
        dependencies: { axios: "^1.0.0", react: "^18.0.0" },
      });

      await createProject(config);

      // Verify server content removal
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining("Demo.jsx"),
        expect.not.stringContaining("axios"),
        "utf8",
      );

      expect(fs.writeJson).toHaveBeenCalledWith(
        expect.stringContaining("package.json"),
        expect.objectContaining({
          dependencies: expect.not.objectContaining({
            axios: expect.any(String),
          }),
        }),
        { spaces: 2 },
      );
    });
  });

  describe("Git Integration Workflows", () => {
    it("should initialize git with repository URL", async () => {
      const config = {
        projectName: "git-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
        gitRepoUrl: "https://github.com/user/git-project.git",
      };

      await createProject(config);

      // Verify that execa was called (package manager detection happens first)
      expect(execa).toHaveBeenCalled();
    });

    it("should construct GitHub URL from repository name", async () => {
      const config = {
        projectName: "auto-url-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
        gitRepoUrl: "my-repo",
      };

      // Mock GitHub username detection
      execa.mockImplementation((command, args) => {
        if (args && args.includes("github.user")) {
          return Promise.resolve({ stdout: "testuser" });
        }
        // Package manager version checks
        if (args && args.includes("--version")) {
          return Promise.resolve({ stdout: "1.0.0" });
        }
        // Package manager health checks
        if (command === "npm" && args && args.includes("config")) {
          return Promise.resolve({ stdout: "https://registry.npmjs.org/" });
        }
        if (command === "yarn" && args && args.includes("cache")) {
          return Promise.resolve({ stdout: "/path/to/cache" });
        }
        if (command === "pnpm" && args && args.includes("store")) {
          return Promise.resolve({ stdout: "Store is clean" });
        }
        if (command === "bun" && args && args.includes("--help")) {
          return Promise.resolve({ stdout: "Bun help text" });
        }
        return Promise.resolve({ stdout: "success" });
      });

      await createProject(config);

      // Verify that execa was called
      expect(execa).toHaveBeenCalled();
    });

    it("should handle git initialization failures gracefully", async () => {
      const config = {
        projectName: "git-fail-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
        gitRepoUrl: "https://github.com/user/repo.git",
      };

      execa.mockImplementation((command, args) => {
        if (command === "git") {
          return Promise.reject(new Error("Git not found"));
        }
        // Package manager version checks
        if (args && args.includes("--version")) {
          return Promise.resolve({ stdout: "1.0.0" });
        }
        // Package manager health checks
        if (command === "npm" && args && args.includes("config")) {
          return Promise.resolve({ stdout: "https://registry.npmjs.org/" });
        }
        if (command === "yarn" && args && args.includes("cache")) {
          return Promise.resolve({ stdout: "/path/to/cache" });
        }
        if (command === "pnpm" && args && args.includes("store")) {
          return Promise.resolve({ stdout: "Store is clean" });
        }
        if (command === "bun" && args && args.includes("--help")) {
          return Promise.resolve({ stdout: "Bun help text" });
        }
        return Promise.resolve({ stdout: "success" });
      });

      // Should not throw even if git fails
      await expect(createProject(config)).resolves.toBeUndefined();
    });
  });

  describe("Error Recovery Integration", () => {
    it("should handle partial creation failures", async () => {
      const config = {
        projectName: "partial-fail",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      // Simulate failure during template copying
      fs.copy.mockRejectedValueOnce(new Error("Copy failed"));

      await expect(createProject(config)).rejects.toThrow("Copy failed");
    });

    it("should handle package.json processing failures", async () => {
      const config = {
        projectName: "package-fail",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: "both",
      };

      fs.readJson.mockRejectedValue(new Error("Invalid JSON"));

      await expect(createProject(config)).rejects.toThrow();
    });

    it("should handle template file processing failures", async () => {
      const config = {
        projectName: "template-fail",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "client",
      };

      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockRejectedValue(new Error("Cannot read template"));

      // Should handle template processing errors gracefully
      await expect(createProject(config)).resolves.toBeUndefined();
    });
  });

  describe("Performance Integration", () => {
    it("should complete project creation within reasonable time", async () => {
      const config = {
        projectName: "perf-test",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: true,
        initializeParts: "both",
      };

      const start = Date.now();
      await createProject(config);
      const duration = Date.now() - start;

      // With mocks, should be very fast
      expect(duration).toBeLessThan(1000);
    });

    it("should handle multiple concurrent project creations", async () => {
      const configs = Array.from({ length: 5 }, (_, i) => ({
        projectName: `concurrent-${i}`,
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "client",
      }));

      const start = Date.now();
      await Promise.all(configs.map((config) => createProject(config)));
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(2000);
    });
  });

  describe("Cross-Platform Integration", () => {
    it("should handle Windows-style paths", async () => {
      const config = {
        projectName: "windows-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      // Mock Windows-style path operations
      const originalPlatform = process.platform;
      Object.defineProperty(process, "platform", { value: "win32" });

      await createProject(config);

      // Restore original platform
      Object.defineProperty(process, "platform", { value: originalPlatform });

      expect(fs.copy).toHaveBeenCalled();
    });

    it("should handle Unix-style paths", async () => {
      const config = {
        projectName: "unix-project",
        language: "JavaScript",
        packageManager: "npm",
        concurrently: false,
        initializeParts: "both",
      };

      const originalPlatform = process.platform;
      Object.defineProperty(process, "platform", { value: "linux" });

      await createProject(config);

      Object.defineProperty(process, "platform", { value: originalPlatform });

      expect(fs.copy).toHaveBeenCalled();
    });
  });

  describe("Workspace Configuration Integration", () => {
    it("should create proper pnpm workspace structure", async () => {
      const config = {
        projectName: "pnpm-full",
        language: "TypeScript",
        packageManager: "pnpm",
        concurrently: true,
        initializeParts: "both",
      };

      await createProject(config);

      // Verify project creation completed
      expect(fs.copy).toHaveBeenCalled();

      // Verify project creation completed
      expect(fs.copy).toHaveBeenCalled();
    });

    it("should handle yarn workspace configuration", async () => {
      const config = {
        projectName: "yarn-full",
        language: "JavaScript",
        packageManager: "yarn",
        concurrently: true,
        initializeParts: "both",
      };

      fs.readJson.mockResolvedValue({
        name: "yarn-full",
        scripts: {},
        workspaces: ["client", "server"],
      });

      await createProject(config);

      // Verify workspace configuration is preserved
      expect(fs.writeJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          workspaces: ["client", "server"],
        }),
        { spaces: 2 },
      );
    });
  });
});
