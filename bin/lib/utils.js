import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function readPackageJson(packageJsonPath) {
  try {
    return await fs.readJson(packageJsonPath);
  } catch (error) {
    throw new Error(
      `Failed to read package.json at ${packageJsonPath}: ${error.message}`
    );
  }
}

export async function writePackageJson(packageJsonPath, packageJson) {
  try {
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  } catch (error) {
    throw new Error(
      `Failed to write package.json at ${packageJsonPath}: ${error.message}`
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
        `⚠️  Could not create directory ${dirPath}: ${error.message}`
      )
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
        "Project name can only contain letters, numbers, hyphens, and underscores",
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
