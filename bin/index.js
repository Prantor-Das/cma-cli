#!/usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import { questions } from "./questions.js";
import { createProject } from "./actions.js";
import {
  getInstallCommand,
  getDevCommand,
  getStartCommand,
  isPackageManagerAvailableInShell,
  getPackageManagerPath,
} from "./packageManager.js";
import { validateProjectName } from "./lib/utils.js";
import { INIT_PARTS } from "./lib/constants.js";

function displayBanner() {
  console.log(
    chalk.white.bold(
      figlet.textSync("> C M A", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    ),
  );
}

async function initializePreferences() {
  const { migratePreferences } = await import("./preferenceManager.js");
  await migratePreferences();
}

async function storeUserPreference(packageManager) {
  if (packageManager && !packageManager.startsWith("install-")) {
    const { setUserPreference } = await import("./preferenceManager.js");
    await setUserPreference(packageManager);
  }
}

function createProjectConfig(answers) {
  const validation = validateProjectName(answers.projectName);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    ...answers,
    projectName: validation.name,
    frontendPath: `${validation.name}/client`,
    backendPath: `${validation.name}/server`,
  };
}

function determineShellSetupNeeds(
  packageManager,
  wasNewlyInstalled,
  availableInShell,
) {
  // Since we no longer install package managers, only check if it's available in shell
  return !availableInShell;
}

async function displayShellSetupInstructions(packageManager) {
  console.log(
    chalk.yellow.bold(
      `\n⚠️  ${packageManager.name} is not available in your current shell.`,
    ),
  );

  const fullPath = await getPackageManagerPath(packageManager.name);
  if (fullPath) {
    console.log(
      chalk.blue(`\n💡 Quick fix: Use the full path in your commands`),
    );
    console.log(chalk.gray(`   Example: ${fullPath} --version`));
  }

  console.log(chalk.cyan("\n📋 Commands to use right now:"));
}

async function displayNextSteps(config, packageManager, needsShellSetup) {
  console.log(chalk.cyan.bold("\n📌 Next steps:"));

  if (needsShellSetup) {
    await displayShellSetupInstructions(packageManager);
  }

  // Determine the correct directory based on what was initialized
  const initializeParts = config.initializeParts || INIT_PARTS.BOTH;
  let targetDirectory = config.projectName;

  if (initializeParts === INIT_PARTS.SERVER) {
    targetDirectory = `${config.projectName}-server`;
  } else if (initializeParts === INIT_PARTS.CLIENT) {
    targetDirectory = `${config.projectName}-client`;
  }

  console.log(chalk.white(`  cd ${targetDirectory}`));

  const fullPath = await getPackageManagerPath(packageManager.name);
  const useFullPath = needsShellSetup && fullPath;

  const installCmd = useFullPath
    ? `${fullPath} ${packageManager.installCmd}`
    : getInstallCommand(packageManager);
  const devCmd = useFullPath
    ? `${fullPath} run ${
        config.language === "TypeScript"
          ? "build && " + fullPath + " run dev"
          : "dev"
      }`
    : getDevCommand(packageManager, config.language === "TypeScript");
  const startCmd = useFullPath
    ? `${fullPath} run start`
    : getStartCommand(packageManager);

  if (config.concurrently) {
    if (!config.installDependencies) {
      console.log(chalk.white(`  ${installCmd}`));
    }
    console.log(chalk.white(`  ${devCmd}`));
  } else {
    displaySeparateCommands(config, installCmd, devCmd, startCmd);
  }

  if (needsShellSetup) {
    console.log(
      chalk.yellow(
        `\n💡 Tip: Make sure '${packageManager.name}' is properly installed and available in your PATH.`,
      ),
    );
  }

  console.log(chalk.green.bold("\n🚀 Happy coding!\n"));
}

function displaySeparateCommands(config, installCmd, devCmd, startCmd) {
  const initializeParts = config.initializeParts || INIT_PARTS.BOTH;

  if (initializeParts === INIT_PARTS.BOTH) {
    // Both client and server - show subdirectory navigation
    console.log(chalk.cyan("\n  To run the frontend:"));
    console.log(chalk.white("  cd client"));
    if (!config.installDependencies) {
      console.log(chalk.white(`  ${installCmd}`));
    }
    console.log(chalk.white(`  ${devCmd}`));

    console.log(chalk.cyan("\n  To run the backend (in a new terminal):"));
    console.log(chalk.white("  cd server"));
    if (!config.installDependencies) {
      console.log(chalk.white(`  ${installCmd}`));
    }
    console.log(chalk.white(`  ${devCmd}`));
  } else if (initializeParts === INIT_PARTS.CLIENT) {
    // Client only - no subdirectory needed
    if (!config.installDependencies) {
      console.log(chalk.white(`  ${installCmd}`));
    }
    console.log(chalk.white(`  ${devCmd}`));
  } else if (initializeParts === INIT_PARTS.SERVER) {
    // Server only - no subdirectory needed
    if (!config.installDependencies) {
      console.log(chalk.white(`  ${installCmd}`));
    }
    console.log(chalk.white(`  ${devCmd}`));
  }
}

async function run() {
  try {
    displayBanner();
    await initializePreferences();

    const answers = await inquirer.prompt(questions);
    const config = createProjectConfig(answers);

    await storeUserPreference(answers.packageManager);
    await createProject(config);

    const packageManager = config.resolvedPackageManager;
    const wasNewlyInstalled = config.packageManagerWasInstalled;
    const availableInShell = await isPackageManagerAvailableInShell(
      packageManager.name,
    );
    const needsShellSetup = determineShellSetupNeeds(
      packageManager,
      wasNewlyInstalled,
      availableInShell,
    );

    await displayNextSteps(config, packageManager, needsShellSetup);
  } catch (err) {
    console.error(chalk.red(`\n❌ Error: ${err.message}\n`));
    process.exit(1);
  }
}

run();
