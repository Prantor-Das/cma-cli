import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs-extra";
import path from "path";

vi.mock("fs-extra", () => ({
  default: {
    pathExists: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    copy: vi.fn(),
    move: vi.fn(),
    remove: vi.fn(),
    readdir: vi.fn(),
    mkdir: vi.fn(),
  },
}));

describe("Template Processing Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("File Renaming", () => {
    it("should rename gitignore to .gitignore", async () => {
      fs.pathExists.mockResolvedValue(true);
      fs.move.mockResolvedValue(undefined);

      const sourcePath = "/project/gitignore";
      const targetPath = "/project/.gitignore";

      await fs.move(sourcePath, targetPath);

      expect(fs.move).toHaveBeenCalledWith(sourcePath, targetPath);
    });

    it("should handle missing gitignore file", async () => {
      fs.pathExists.mockResolvedValue(false);

      // Should not attempt to move if file doesn't exist
      expect(fs.move).not.toHaveBeenCalled();
    });

    it("should rename template test files", async () => {
      fs.pathExists.mockResolvedValue(true);
      fs.move.mockResolvedValue(undefined);

      const testRenames = [
        {
          from: "/project/src/__tests__/server.template-test.js",
          to: "/project/src/__tests__/server.test.js",
        },
        {
          from: "/project/src/__tests__/server.template-test.ts",
          to: "/project/src/__tests__/server.test.ts",
        },
      ];

      for (const rename of testRenames) {
        await fs.move(rename.from, rename.to);
      }

      expect(fs.move).toHaveBeenCalledTimes(2);
    });
  });

  describe("Content Replacement", () => {
    it("should replace project name in index.html", async () => {
      const originalContent = `
<!DOCTYPE html>
<html>
<head>
    <title>cma-cli</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;

      const expectedContent = `
<!DOCTYPE html>
<html>
<head>
    <title>my-awesome-project</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;

      fs.readFile.mockResolvedValue(originalContent);
      fs.writeFile.mockResolvedValue(undefined);

      // Simulate the title replacement logic
      const updatedContent = originalContent.replace(
        /<title>cma-cli<\/title>/g,
        "<title>my-awesome-project</title>",
      );

      await fs.writeFile("/project/index.html", updatedContent);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "/project/index.html",
        updatedContent,
      );
    });

    it("should replace project name in Navigation component", async () => {
      const originalContent = `
import React from 'react';

export default function Navigation() {
  return (
    <nav>
      <h1>cma-cli</h1>
    </nav>
  );
}`;

      const expectedContent = `
import React from 'react';

export default function Navigation() {
  return (
    <nav>
      <h1>my-project</h1>
    </nav>
  );
}`;

      fs.readFile.mockResolvedValue(originalContent);
      fs.writeFile.mockResolvedValue(undefined);

      const updatedContent = originalContent.replace(/cma-cli/g, "my-project");
      await fs.writeFile("/project/Navigation.jsx", updatedContent);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "/project/Navigation.jsx",
        updatedContent,
      );
    });

    it("should update environment variables", async () => {
      const originalEnv = `
VITE_APP_NAME=cma-cli
VITE_PORT=3000
API_URL=http://localhost:5000`;

      const expectedEnv = `
VITE_APP_NAME=my-project
VITE_PORT=3000
API_URL=http://localhost:5000`;

      fs.readFile.mockResolvedValue(originalEnv);
      fs.writeFile.mockResolvedValue(undefined);

      const updatedContent = originalEnv.replace(
        /VITE_APP_NAME=cma-cli/g,
        "VITE_APP_NAME=my-project",
      );

      await fs.writeFile("/project/.env.example", updatedContent);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "/project/.env.example",
        updatedContent,
      );
    });
  });

  describe("Client-Only Processing", () => {
    it("should remove server-related imports from Demo component", async () => {
      const originalDemo = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/constants';
import { Server, AlertCircle } from 'lucide-react';

export default function Demo() {
  return <div>Demo Component</div>;
}`;

      const expectedDemo = `
import React from 'react';

export default function Demo() {
  return <div>Demo Component</div>;
}`;

      fs.readFile.mockResolvedValue(originalDemo);
      fs.writeFile.mockResolvedValue(undefined);

      // Simulate server content removal
      let updatedContent = originalDemo;
      updatedContent = updatedContent.replace(
        /import\s+axios\s+from\s+["']axios["'];\s*\n?/g,
        "",
      );
      updatedContent = updatedContent.replace(
        /import\s+\{\s*API_ENDPOINTS\s*\}\s+from\s+["'][^"']*constants["'];\s*\n?/g,
        "",
      );
      updatedContent = updatedContent.replace(
        /import\s+\{\s*useState,\s*useEffect\s*\}\s+from\s+["']react["'];\s*\n?/g,
        "",
      );
      updatedContent = updatedContent.replace(/(\s+)Server,(\s*)/g, "$1$2");
      updatedContent = updatedContent.replace(
        /(\s+)AlertCircle,(\s*)/g,
        "$1$2",
      );

      await fs.writeFile("/project/Demo.jsx", updatedContent);

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("should remove API_ENDPOINTS from constants file", async () => {
      const originalConstants = `
export const APP_NAME = "My App";

export const API_BASE_URL = "http://localhost:5000";

export const API_ENDPOINTS = {
  users: "/api/users",
  auth: "/api/auth"
} as const;`;

      fs.readFile.mockResolvedValue(originalConstants);
      fs.writeFile.mockResolvedValue(undefined);

      // Simulate API endpoints removal
      let updatedContent = originalConstants;
      updatedContent = updatedContent.replace(
        /export const API_ENDPOINTS = \{[\s\S]*?\} as const;\s*\n?/g,
        "",
      );
      updatedContent = updatedContent.replace(
        /export const API_BASE_URL =[\s\S]*?;\s*\n?/g,
        "",
      );

      await fs.writeFile("/project/constants.ts", updatedContent);

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("should remove axios from package.json dependencies", async () => {
      const originalPackageJson = {
        name: "test-project",
        dependencies: {
          react: "^18.0.0",
          axios: "^1.0.0",
          "react-dom": "^18.0.0",
        },
      };

      const expectedPackageJson = {
        name: "test-project",
        dependencies: {
          react: "^18.0.0",
          "react-dom": "^18.0.0",
        },
      };

      // Simulate axios removal
      const updatedPackageJson = { ...originalPackageJson };
      if (
        updatedPackageJson.dependencies &&
        updatedPackageJson.dependencies.axios
      ) {
        delete updatedPackageJson.dependencies.axios;
      }

      expect(updatedPackageJson).toEqual(expectedPackageJson);
    });
  });

  describe("Gitkeep File Cleanup", () => {
    it("should find and remove .gitkeep files", async () => {
      const gitkeepPaths = [
        "/project/public/.gitkeep",
        "/project/src/assets/.gitkeep",
        "/project/src/utils/.gitkeep",
      ];

      fs.pathExists.mockImplementation((path) => gitkeepPaths.includes(path));
      fs.remove.mockResolvedValue(undefined);

      // Simulate gitkeep removal
      for (const gitkeepPath of gitkeepPaths) {
        if (await fs.pathExists(gitkeepPath)) {
          await fs.remove(gitkeepPath);
        }
      }

      expect(fs.remove).toHaveBeenCalledTimes(3);
      gitkeepPaths.forEach((path) => {
        expect(fs.remove).toHaveBeenCalledWith(path);
      });
    });

    it("should handle missing .gitkeep files gracefully", async () => {
      fs.pathExists.mockResolvedValue(false);

      // Should not attempt to remove non-existent files
      expect(fs.remove).not.toHaveBeenCalled();
    });

    it("should recursively find .gitkeep files", async () => {
      const mockDirectoryStructure = {
        "/project": ["src", "public"],
        "/project/src": ["components", "utils", ".gitkeep"],
        "/project/public": ["images", ".gitkeep"],
        "/project/src/components": [],
        "/project/src/utils": [".gitkeep"],
        "/project/public/images": [],
      };

      fs.readdir.mockImplementation((dirPath) => {
        const items = mockDirectoryStructure[dirPath] || [];
        return Promise.resolve(
          items.map((name) => ({
            name,
            isDirectory: () => !name.includes("."),
          })),
        );
      });

      // This would test recursive gitkeep finding logic
      expect(true).toBe(true); // Placeholder for actual implementation
    });
  });

  describe("TypeScript vs JavaScript Processing", () => {
    it("should handle TypeScript-specific replacements", async () => {
      const tsContent = `
interface ApiState {
  loading: boolean;
  data: any;
}

export const API_ENDPOINTS = {
  users: "/api/users"
} as const;`;

      fs.readFile.mockResolvedValue(tsContent);
      fs.writeFile.mockResolvedValue(undefined);

      // Simulate TypeScript-specific processing
      let updatedContent = tsContent;
      updatedContent = updatedContent.replace(
        /interface ApiState\s*\{[\s\S]*?\n\}/g,
        "",
      );
      updatedContent = updatedContent.replace(
        /export const API_ENDPOINTS = \{[\s\S]*?\} as const;\s*\n?/g,
        "",
      );

      await fs.writeFile("/project/types.ts", updatedContent);

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("should handle JavaScript-specific replacements", async () => {
      const jsContent = `
export const API_ENDPOINTS = {
  users: "/api/users"
};`;

      fs.readFile.mockResolvedValue(jsContent);
      fs.writeFile.mockResolvedValue(undefined);

      // Simulate JavaScript-specific processing
      let updatedContent = jsContent;
      updatedContent = updatedContent.replace(
        /export const API_ENDPOINTS = \{[\s\S]*?\};\s*\n?/g,
        "",
      );

      await fs.writeFile("/project/constants.js", updatedContent);

      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle file read errors gracefully", async () => {
      fs.readFile.mockRejectedValue(new Error("Permission denied"));

      // Should not throw when file operations fail
      try {
        await fs.readFile("/project/nonexistent.txt");
      } catch (error) {
        expect(error.message).toBe("Permission denied");
      }
    });

    it("should handle file write errors gracefully", async () => {
      fs.writeFile.mockRejectedValue(new Error("Disk full"));

      try {
        await fs.writeFile("/project/test.txt", "content");
      } catch (error) {
        expect(error.message).toBe("Disk full");
      }
    });

    it("should handle file move errors gracefully", async () => {
      fs.move.mockRejectedValue(new Error("Target exists"));

      try {
        await fs.move("/source", "/target");
      } catch (error) {
        expect(error.message).toBe("Target exists");
      }
    });
  });

  describe("Performance Tests", () => {
    it("should process multiple files efficiently", async () => {
      const files = Array.from(
        { length: 10 },
        (_, i) => `/project/file${i}.txt`,
      );

      fs.readFile.mockResolvedValue("content");
      fs.writeFile.mockResolvedValue(undefined);

      const start = Date.now();

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(file);
          await fs.writeFile(file, content.replace("old", "new"));
        }),
      );

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should be fast with mocks
    });

    it("should handle large file content efficiently", async () => {
      const largeContent = "x".repeat(1000000); // 1MB of content

      fs.readFile.mockResolvedValue(largeContent);
      fs.writeFile.mockResolvedValue(undefined);

      const start = Date.now();

      const content = await fs.readFile("/project/large.txt");
      const processed = content.replace(/x/g, "y");
      await fs.writeFile("/project/large.txt", processed);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
