import path from "path";
import { LOCK_FILE_MANAGERS } from "./constants.js";
import { pathExists, readPackageJson } from "./utils.js";
import chalk from "chalk";

export async function detectProjectConfiguration(projectPath) {
  const lockFiles = [];
  const suggestions = [];

  for (const [lockFile, manager] of Object.entries(LOCK_FILE_MANAGERS)) {
    const lockFilePath = path.join(projectPath, lockFile);
    if (await pathExists(lockFilePath)) {
      lockFiles.push(lockFile);
      suggestions.push(manager);
    }
  }

  const packageJsonPath = path.join(projectPath, "package.json");
  let packageJsonConfig = null;

  if (await pathExists(packageJsonPath)) {
    try {
      packageJsonConfig = await readPackageJson(packageJsonPath);

      if (packageJsonConfig.packageManager) {
        const managerName = packageJsonConfig.packageManager.split("@")[0];
        if (!suggestions.includes(managerName)) {
          suggestions.push(managerName);
        }
      }

      if (
        packageJsonConfig.workspaces ||
        (await pathExists(path.join(projectPath, "pnpm-workspace.yaml")))
      ) {
        if (!suggestions.includes("pnpm")) {
          suggestions.push("pnpm");
        }
      }
    } catch (error) {
      console.warn(
        chalk.yellow(`⚠️  Could not read package.json: ${error.message}`),
      );
    }
  }

  return {
    lockFiles,
    suggestedManager: suggestions.length > 0 ? suggestions[0] : null,
    allSuggestions: suggestions,
    packageJsonConfig,
    hasMultipleLockFiles: lockFiles.length > 1,
  };
}

export async function getPackageName(projectPath, subdir) {
  try {
    const packageJsonPath = path.join(projectPath, subdir, "package.json");
    if (await pathExists(packageJsonPath)) {
      const packageJson = await readPackageJson(packageJsonPath);
      return packageJson.name || subdir;
    }
  } catch (error) {
    console.warn(
      chalk.yellow(
        `⚠️  Could not read package name for ${subdir}: ${error.message}`,
      ),
    );
  }
  return subdir;
}
