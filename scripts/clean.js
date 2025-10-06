#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Simple color functions without chalk
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

const lockFiles = [
  // NPM lock files
  "package-lock.json",
  "npm-shrinkwrap.json",

  // Yarn lock files
  "yarn.lock",
  ".yarnrc",
  ".yarnrc.yml",

  // PNPM lock files
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  ".pnpmfile.cjs",

  // Bun lock files
  "bun.lock",

  // Other package manager files
  "shrinkwrap.yaml",
  "package-lock.yaml",

  // Rush lock files
  "rush.json",
  "common-versions.json",

  // Lerna lock files
  "lerna-debug.log",
];

const cacheDirectories = [
  ".npm",
  ".yarn",
  ".pnpm-store",
  ".pnpm",
  "node_modules/.cache",
  ".cache",
  ".next",
  ".nuxt",
  "dist",
  "build",
  ".turbo",
  ".rush",
];

const logFiles = [
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
  "pnpm-debug.log*",
  "lerna-debug.log*",
  ".pnpm-debug.log*",
];

const nodeModulesDirs = [];
const foundLockFiles = [];
const foundCacheDirectories = [];
const foundLogFiles = [];

/**
 * Check if a file matches any of the log file patterns
 */
function matchesLogPattern(filename) {
  return logFiles.some((pattern) => {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    return regex.test(filename);
  });
}

/**
 * Recursively find all node_modules directories, lock files, cache directories, and log files
 */
function findTargets(dir) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (item === "node_modules") {
          nodeModulesDirs.push(fullPath);
          // Don't recurse into node_modules
          continue;
        }

        // Check for cache directories
        if (cacheDirectories.includes(item)) {
          foundCacheDirectories.push(fullPath);
          // Don't recurse into cache directories
          continue;
        }

        // Skip .git and other system directories for performance
        if (!item.startsWith(".git") && !item.startsWith(".vscode")) {
          findTargets(fullPath);
        }
      } else {
        // Check for lock files
        if (lockFiles.includes(item)) {
          foundLockFiles.push(fullPath);
        }

        // Check for log files
        if (matchesLogPattern(item)) {
          foundLogFiles.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
    console.warn(colors.yellow(`Warning: Could not read directory ${dir}`));
  }
}

/**
 * Remove a file or directory
 */
async function removeTarget(targetPath, type) {
  try {
    await fs.promises.rm(targetPath, { recursive: true, force: true });
    console.log(
      colors.green(
        `✓ Removed ${type}: ${path.relative(process.cwd(), targetPath)}`,
      ),
    );
    return true;
  } catch (error) {
    console.error(
      colors.red(
        `✗ Failed to remove ${type}: ${path.relative(process.cwd(), targetPath)}`,
      ),
    );
    console.error(colors.red(`  Error: ${error.message}`));
    return false;
  }
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log(colors.blue("🧹 Starting comprehensive cleanup process...\n"));

  // Find all targets
  console.log(
    colors.cyan(
      "Scanning for dependencies, lock files, cache directories, and logs...",
    ),
  );
  findTargets(process.cwd());

  const totalTargets =
    nodeModulesDirs.length +
    foundLockFiles.length +
    foundCacheDirectories.length +
    foundLogFiles.length;

  if (totalTargets === 0) {
    console.log(colors.green("✨ No cleanup targets found. Already clean!"));
    return;
  }

  console.log(colors.cyan(`\nFound:`));
  console.log(
    colors.cyan(`  • ${nodeModulesDirs.length} node_modules directories`),
  );
  console.log(colors.cyan(`  • ${foundLockFiles.length} lock files`));
  console.log(
    colors.cyan(`  • ${foundCacheDirectories.length} cache directories`),
  );
  console.log(colors.cyan(`  • ${foundLogFiles.length} log files`));
  console.log("");

  let removedCount = 0;

  // Remove node_modules directories
  if (nodeModulesDirs.length > 0) {
    console.log(colors.yellow("Removing node_modules directories..."));
    for (const dir of nodeModulesDirs) {
      const success = await removeTarget(dir, "node_modules");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Remove lock files
  if (foundLockFiles.length > 0) {
    console.log(colors.yellow("Removing lock files..."));
    for (const file of foundLockFiles) {
      const success = await removeTarget(file, "lock file");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Remove cache directories
  if (foundCacheDirectories.length > 0) {
    console.log(colors.yellow("Removing cache directories..."));
    for (const dir of foundCacheDirectories) {
      const success = await removeTarget(dir, "cache directory");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Remove log files
  if (foundLogFiles.length > 0) {
    console.log(colors.yellow("Removing log files..."));
    for (const file of foundLogFiles) {
      const success = await removeTarget(file, "log file");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Summary
  if (removedCount === totalTargets) {
    console.log(
      colors.green(
        `✨ Cleanup complete! Removed ${removedCount}/${totalTargets} items.`,
      ),
    );
  } else {
    console.log(
      colors.yellow(
        `⚠️  Cleanup finished with warnings. Removed ${removedCount}/${totalTargets} items.`,
      ),
    );
  }
}

// Run the cleanup
cleanup().catch((error) => {
  console.error(colors.red("💥 Cleanup failed:"));
  console.error(colors.red(error.message));
  process.exit(1);
});
