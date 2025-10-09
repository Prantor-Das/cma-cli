import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function readPackageJson(packageJsonPath) {
  try {
    return await fs.readJson(packageJsonPath);
  } catch (error) {
    throw new Error(
      `Failed to read package.json at ${packageJsonPath}: ${error.message}`,
    );
  }
}

export async function writePackageJson(packageJsonPath, packageJson) {
  try {
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  } catch (error) {
    throw new Error(
      `Failed to write package.json at ${packageJsonPath}: ${error.message}`,
    );
  }
}

export async function ensureDirectory(dirPath) {
  try {
    await fs.ensureDir(dirPath);
    return true;
  } catch (error) {
    console.warn(
      chalk.yellow(
        `⚠️  Could not create directory ${dirPath}: ${error.message}`,
      ),
    );
    return false;
  }
}

export async function pathExists(filePath) {
  try {
    return await fs.pathExists(filePath);
  } catch {
    return false;
  }
}

export function validateProjectName(name) {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Project name is required" };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Project name cannot be empty" };
  }

  // Special case for current directory
  if (trimmed === "./") {
    const currentDirName = getCurrentDirectoryName();
    // Validate that the current directory name is valid for npm packages
    if (!/^[a-z0-9-_]+$/i.test(currentDirName)) {
      return {
        valid: false,
        error: `Current directory name "${currentDirName}" is not valid for npm packages. Use a different directory or rename this one.`,
      };
    }
    return { valid: true, name: trimmed, isCurrentDirectory: true };
  }

  if (trimmed.length > 214) {
    return {
      valid: false,
      error: "Project name is too long (max 214 characters)",
    };
  }

  if (!/^[a-z0-9-_]+$/i.test(trimmed)) {
    return {
      valid: false,
      error:
        "Project name can only contain letters, numbers, hyphens, and underscores (or use './' for current directory)",
    };
  }

  return { valid: true, name: trimmed };
}

export function createProgressMessage(message, options = {}) {
  const { emoji = "▸", color = "blue" } = options;
  return chalk[color](`${emoji} ${message}`);
}

export function createSuccessMessage(message) {
  return chalk.green(`✅ ${message}`);
}

export function createWarningMessage(message) {
  return chalk.yellow(`⚠️  ${message}`);
}

export function createErrorMessage(message) {
  return chalk.red(`❌ ${message}`);
}

export function getCurrentDirectoryName() {
  return path.basename(process.cwd());
}

export async function checkCurrentDirectoryConflicts() {
  const currentDir = process.cwd();
  const conflicts = [];

  // Check for common files that might conflict
  const filesToCheck = [
    "package.json",
    "src",
    "client",
    "server",
    "pnpm-workspace.yaml",
    ".gitignore",
  ];

  for (const file of filesToCheck) {
    const filePath = path.join(currentDir, file);
    if (await pathExists(filePath)) {
      conflicts.push(file);
    }
  }

  return conflicts;
}
