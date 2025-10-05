#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const lockFiles = [
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
];

const nodeModulesDirs = [];
const foundLockFiles = [];

/**
 * Recursively find all node_modules directories and lock files
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

        // Skip .git and other hidden directories for performance
        if (!item.startsWith(".")) {
          findTargets(fullPath);
        }
      } else if (lockFiles.includes(item)) {
        foundLockFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
    console.warn(chalk.yellow(`Warning: Could not read directory ${dir}`));
  }
}

/**
 * Remove a file or directory
 */
async function removeTarget(targetPath, type) {
  try {
    await fs.remove(targetPath);
    console.log(
      chalk.green(
        `✓ Removed ${type}: ${path.relative(process.cwd(), targetPath)}`,
      ),
    );
    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `✗ Failed to remove ${type}: ${path.relative(process.cwd(), targetPath)}`,
      ),
    );
    console.error(chalk.red(`  Error: ${error.message}`));
    return false;
  }
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log(chalk.blue("🧹 Starting cleanup process...\n"));

  // Find all targets
  console.log(
    chalk.cyan("Scanning for node_modules directories and lock files..."),
  );
  findTargets(process.cwd());

  const totalTargets = nodeModulesDirs.length + foundLockFiles.length;

  if (totalTargets === 0) {
    console.log(
      chalk.green(
        "✨ No node_modules directories or lock files found. Already clean!",
      ),
    );
    return;
  }

  console.log(chalk.cyan(`\nFound:`));
  console.log(
    chalk.cyan(`  • ${nodeModulesDirs.length} node_modules directories`),
  );
  console.log(chalk.cyan(`  • ${foundLockFiles.length} lock files`));
  console.log("");

  let removedCount = 0;

  // Remove node_modules directories
  if (nodeModulesDirs.length > 0) {
    console.log(chalk.yellow("Removing node_modules directories..."));
    for (const dir of nodeModulesDirs) {
      const success = await removeTarget(dir, "node_modules");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Remove lock files
  if (foundLockFiles.length > 0) {
    console.log(chalk.yellow("Removing lock files..."));
    for (const file of foundLockFiles) {
      const success = await removeTarget(file, "lock file");
      if (success) removedCount++;
    }
    console.log("");
  }

  // Summary
  if (removedCount === totalTargets) {
    console.log(
      chalk.green(
        `✨ Cleanup complete! Removed ${removedCount}/${totalTargets} items.`,
      ),
    );
  } else {
    console.log(
      chalk.yellow(
        `⚠️  Cleanup finished with warnings. Removed ${removedCount}/${totalTargets} items.`,
      ),
    );
  }
}

// Run the cleanup
cleanup().catch((error) => {
  console.error(chalk.red("💥 Cleanup failed:"));
  console.error(chalk.red(error.message));
  process.exit(1);
});
