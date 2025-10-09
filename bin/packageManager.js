import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

// Enhanced progress indicator with detailed status and timing
function createProgressIndicator(message, options = {}) {
  const {
    showTimer = true,
    showSteps = false,
    totalSteps = 0,
    currentStep = 0,
  } = options;

  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  let step = currentStep;
  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    let display = `${chalk.blue(frames[i])} ${message}`;

    if (showTimer) {
      display += chalk.gray(` (${elapsed}s)`);
    }

    if (showSteps && totalSteps > 0) {
      display += chalk.gray(` [${step}/${totalSteps}]`);
    }

    process.stdout.write(`\r${display}`);
    i = (i + 1) % frames.length;
  }, 100);

  return {
    updateMessage: (newMessage) => {
      message = newMessage;
    },
    updateStep: (newStep) => {
      step = newStep;
    },
    getElapsedTime: () => {
      return ((Date.now() - startTime) / 1000).toFixed(1);
    },
    stop: (finalMessage) => {
      clearInterval(interval);
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

      if (finalMessage) {
        if (showTimer) {
          process.stdout.write(
            `\r${finalMessage} ${chalk.gray(`(${totalTime}s)`)}\n`,
          );
        } else {
          process.stdout.write(`\r${finalMessage}\n`);
        }
      } else {
        process.stdout.write(
          "\r" + " ".repeat(process.stdout.columns || 80) + "\r",
        );
      }
    },
  };
}

// Installation metrics tracking
class InstallationMetrics {
  constructor(managerName) {
    this.managerName = managerName;
    this.startTime = Date.now();
    this.endTime = null;
    this.phases = [];
    this.currentPhase = null;
    this.success = false;
    this.error = null;
    this.retryCount = 0;
    this.cacheHitRate = null;
    this.packagesInstalled = 0;
    this.networkTime = 0;
    this.diskTime = 0;
  }

  startPhase(phaseName) {
    if (this.currentPhase) {
      this.endPhase();
    }

    this.currentPhase = {
      name: phaseName,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
    };
  }

  endPhase() {
    if (this.currentPhase) {
      this.currentPhase.endTime = Date.now();
      this.currentPhase.duration =
        this.currentPhase.endTime - this.currentPhase.startTime;
      this.phases.push(this.currentPhase);
      this.currentPhase = null;
    }
  }

  complete(success = true, error = null) {
    if (this.currentPhase) {
      this.endPhase();
    }

    this.endTime = Date.now();
    this.success = success;
    this.error = error;
  }

  getTotalDuration() {
    return this.endTime ? (this.endTime - this.startTime) / 1000 : 0;
  }

  getReport() {
    return {
      managerName: this.managerName,
      success: this.success,
      totalDuration: this.getTotalDuration(),
      retryCount: this.retryCount,
      phases: this.phases.map((phase) => ({
        name: phase.name,
        duration: phase.duration / 1000,
      })),
      packagesInstalled: this.packagesInstalled,
      cacheHitRate: this.cacheHitRate,
      networkTime: this.networkTime,
      diskTime: this.diskTime,
      error: this.error,
      timestamp: new Date(this.startTime).toISOString(),
    };
  }
}

// Package manager configurations with optimization configurations
export const PACKAGE_MANAGERS = {
  bun: {
    name: "bun",
    command: "bun",
    installCmd: "install",
    ciCmd: "install --frozen-lockfile",
    lockFile: "bun.lockb",
    installFlags: ["--silent"],
    globalInstall: ["add", "--global"],
    speed: "⚡ Fastest",
    priority: 1, // Highest priority for fallback ordering

    optimizations: {
      parallel: true,
      cache: true,
      offline: false, // Bun doesn't have robust offline mode yet
      silent: true,
      concurrent: true,
      networkOptimized: true,
      contextFlags: {
        ci: ["--frozen-lockfile", "--no-save"],
        development: ["--development"],
        production: ["--production", "--frozen-lockfile"],
        fast: ["--no-save", "--silent"],
        offline: [], // Bun doesn't support offline mode reliably
      },
    },
    verification: {
      command: ["--version"],
      timeout: 5000,
      expectedPattern: /^\d+\.\d+\.\d+/,
      healthCheck: ["--help"],
    },
  },
  pnpm: {
    name: "pnpm",
    command: "pnpm",
    installCmd: "install",
    ciCmd: "install --frozen-lockfile",
    lockFile: "pnpm-lock.yaml",
    installFlags: ["--silent", "--prefer-frozen-lockfile"],
    globalInstall: ["add", "--global"],
    speed: "🚀 Very Fast",
    priority: 2,

    optimizations: {
      parallel: true,
      cache: true,
      offline: true,
      silent: true,
      concurrent: true,
      networkOptimized: true,
      contextFlags: {
        ci: ["--frozen-lockfile", "--reporter=silent"],
        development: ["--reporter=silent"],
        production: ["--prod", "--frozen-lockfile"],
        fast: ["--prefer-frozen-lockfile", "--reporter=silent"],
        offline: ["--offline", "--prefer-offline"],
      },
    },
    verification: {
      command: ["--version"],
      timeout: 5000,
      expectedPattern: /^\d+\.\d+\.\d+/,
      healthCheck: ["store", "status"],
    },
  },
  yarn: {
    name: "yarn",
    command: "yarn",
    installCmd: "install",
    ciCmd: "install --frozen-lockfile",
    lockFile: "yarn.lock",
    installFlags: ["--silent", "--prefer-offline"],
    globalInstall: ["global", "add"],
    speed: "⚡ Fast",
    priority: 3,

    optimizations: {
      parallel: true,
      cache: true,
      offline: true,
      silent: true,
      concurrent: true,
      networkOptimized: true,
      contextFlags: {
        ci: ["--frozen-lockfile", "--non-interactive"],
        development: [],
        production: ["--production", "--frozen-lockfile"],
        fast: ["--prefer-offline", "--non-interactive"],
        offline: ["--offline", "--prefer-offline"],
      },
    },
    verification: {
      command: ["--version"],
      timeout: 5000,
      expectedPattern: /^\d+\.\d+\.\d+/,
      healthCheck: ["cache", "dir"],
    },
  },
  npm: {
    name: "npm",
    command: "npm",
    installCmd: "install",
    ciCmd: "ci",
    lockFile: "package-lock.json",
    installFlags: ["--silent", "--prefer-offline", "--no-audit", "--no-fund"],
    globalInstall: ["install", "--global"],
    speed: "📦 Standard",
    priority: 4, // Lowest priority but always available

    optimizations: {
      parallel: false, // npm doesn't have built-in parallel installs
      cache: true,
      offline: true,
      silent: true,
      concurrent: false,
      networkOptimized: false,
      contextFlags: {
        ci: ["--no-audit", "--no-fund"],
        development: [],
        production: ["--only=production"],
        fast: ["--no-audit", "--no-fund", "--prefer-offline"],
        offline: ["--offline", "--prefer-offline"],
      },
    },
    verification: {
      command: ["--version"],
      timeout: 5000,
      expectedPattern: /^\d+\.\d+\.\d+/,
      healthCheck: ["config", "get", "registry"],
    },
  },
};

// Detect operating system
function getOS() {
  const platform = process.platform;
  if (platform === "darwin") return "macos";
  if (platform === "win32") return "windows";
  return "linux";
}

// Validate package manager configuration structure
function validatePackageManagerConfig(managerName, config) {
  const errors = [];

  // Required fields
  const requiredFields = [
    "name",
    "command",
    "installCmd",
    "ciCmd",
    "lockFile",
    "installFlags",
    "globalInstall",
    "speed",
    "priority",
    "optimizations",
    "verification",
  ];

  for (const field of requiredFields) {
    if (!(field in config)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate priority is a positive integer
  if (
    typeof config.priority !== "number" ||
    config.priority < 1 ||
    !Number.isInteger(config.priority)
  ) {
    errors.push("Priority must be a positive integer");
  }

  // Validate optimizations structure
  if (config.optimizations) {
    const requiredOptFields = [
      "parallel",
      "cache",
      "offline",
      "silent",
      "concurrent",
      "networkOptimized",
      "contextFlags",
    ];
    for (const field of requiredOptFields) {
      if (!(field in config.optimizations)) {
        errors.push(`Missing optimization field: ${field}`);
      }
    }

    // Validate contextFlags has required contexts
    if (config.optimizations.contextFlags) {
      const requiredContexts = [
        "ci",
        "development",
        "production",
        "fast",
        "offline",
      ];
      for (const context of requiredContexts) {
        if (!(context in config.optimizations.contextFlags)) {
          errors.push(`Missing context flags for: ${context}`);
        }
        if (!Array.isArray(config.optimizations.contextFlags[context])) {
          errors.push(`Context flags for ${context} must be an array`);
        }
      }
    }
  }

  // Validate verification structure
  if (config.verification) {
    if (!Array.isArray(config.verification.command)) {
      errors.push("Verification command must be an array");
    }
    if (
      typeof config.verification.timeout !== "number" ||
      config.verification.timeout <= 0
    ) {
      errors.push("Verification timeout must be a positive number");
    }
    if (!(config.verification.expectedPattern instanceof RegExp)) {
      errors.push("Verification expectedPattern must be a RegExp");
    }
    if (!Array.isArray(config.verification.healthCheck)) {
      errors.push("Verification healthCheck must be an array");
    }
  }

  return errors;
}

// Validate all package manager configurations
function validateAllPackageManagerConfigs() {
  const allErrors = {};
  let hasErrors = false;

  for (const [managerName, config] of Object.entries(PACKAGE_MANAGERS)) {
    const errors = validatePackageManagerConfig(managerName, config);
    if (errors.length > 0) {
      allErrors[managerName] = errors;
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error(
      chalk.red("❌ Package manager configuration validation failed:"),
    );
    for (const [manager, errors] of Object.entries(allErrors)) {
      console.error(chalk.red(`  ${manager}:`));
      for (const error of errors) {
        console.error(chalk.red(`    - ${error}`));
      }
    }
    throw new Error("Invalid package manager configurations detected");
  }

  return true;
}

// Get optimization flags for a specific context
export function getOptimizationFlags(managerName, context = "fast") {
  const manager = PACKAGE_MANAGERS[managerName];
  if (
    !manager ||
    !manager.optimizations ||
    !manager.optimizations.contextFlags
  ) {
    return [];
  }

  const contextFlags = manager.optimizations.contextFlags[context];
  return contextFlags ? [...contextFlags] : [];
}

// Get package managers sorted by priority (lowest number = highest priority)
export function getPackageManagersByPriority() {
  return Object.entries(PACKAGE_MANAGERS)
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([name, config]) => ({ name, ...config }));
}

// Check if a package manager supports a specific optimization
export function supportsOptimization(managerName, optimization) {
  const manager = PACKAGE_MANAGERS[managerName];
  return (
    manager &&
    manager.optimizations &&
    manager.optimizations[optimization] === true
  );
}

// Validate package manager configuration on module load
try {
  validateAllPackageManagerConfigs();
} catch (error) {
  // Log validation error but don't crash the module
  console.warn(
    chalk.yellow(
      "⚠️  Package manager configuration validation failed, some features may not work correctly",
    ),
  );
}

// Check if a package manager is installed using enhanced verification
export async function isPackageManagerInstalled(managerName) {
  const manager = PACKAGE_MANAGERS[managerName];
  if (!manager) return false;

  try {
    // Use verification configuration from manager config
    const verificationCmd = manager.verification?.command || ["--version"];
    const timeout = manager.verification?.timeout || 5000;
    const expectedPattern = manager.verification?.expectedPattern;

    const result = await execa(manager.command, verificationCmd, {
      stdio: "pipe",
      timeout: timeout,
    });

    // If we have an expected pattern, validate the output
    if (expectedPattern && !expectedPattern.test(result.stdout)) {
      return false;
    }

    return true;
  } catch {
    // For bun, also check common installation paths
    if (managerName === "bun") {
      return await checkBunInCommonPaths();
    }
    return false;
  }
}

// Check for bun in common installation paths
async function checkBunInCommonPaths() {
  const os = getOS();
  const commonPaths = [];

  if (os === "windows") {
    commonPaths.push(
      path.join(process.env.USERPROFILE, ".bun", "bin", "bun.exe"),
      path.join(process.env.USERPROFILE, ".bun", "bin", "bun"),
    );
  } else {
    // Check npm global bin directory first
    try {
      const npmBinResult = await execa("npm", ["bin", "-g"], {
        stdio: "pipe",
        timeout: 5000,
      });
      const npmGlobalBin = npmBinResult.stdout.trim();
      commonPaths.push(path.join(npmGlobalBin, "bun"));
    } catch {
      // Ignore if npm bin -g fails
    }

    commonPaths.push(
      path.join(process.env.HOME, ".bun", "bin", "bun"),
      "/usr/local/bin/bun",
      "/opt/homebrew/bin/bun",
      "/usr/bin/bun",
    );
  }

  for (const bunPath of commonPaths) {
    try {
      if (await fs.pathExists(bunPath)) {
        // Try to execute it
        await execa(bunPath, ["--version"], {
          stdio: "ignore",
          timeout: 3000,
        });
        // Update PATH if not already included
        const binDir = path.dirname(bunPath);
        if (!process.env.PATH.includes(binDir)) {
          process.env.PATH = `${binDir}${path.delimiter}${process.env.PATH}`;
        }
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

// Check if package manager is available in user's shell
export async function isPackageManagerAvailableInShell(managerName) {
  try {
    // Try to run the command in a new shell to simulate user experience
    await execa("which", [managerName], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Get the fastest available package manager using priority system
export async function detectFastestPackageManager() {
  const managersByPriority = getPackageManagersByPriority();

  for (const manager of managersByPriority) {
    if (await isPackageManagerInstalled(manager.name)) {
      return PACKAGE_MANAGERS[manager.name];
    }
  }

  // Fallback to npm (should always be available)
  return PACKAGE_MANAGERS.npm;
}

// Resolve package manager choice with enhanced installation handling
export async function resolvePackageManager(choice) {
  // Handle install requests by falling back to available managers
  if (choice.startsWith("install-")) {
    const managerName = choice.replace("install-", "");
    console.log(
      chalk.yellow(`⚠️  ${managerName} is not installed on your system.`),
    );
    console.log(
      chalk.yellow("⚠️  Falling back to fastest available package manager..."),
    );
    const fallback = await detectFastestPackageManager();
    console.log(
      chalk.blue(`📦 Using ${fallback.name} ${fallback.speed} instead`),
    );
    return fallback;
  }

  // Handle direct choice
  const manager = PACKAGE_MANAGERS[choice];
  if (!manager) {
    console.log(
      chalk.yellow(
        `⚠️  Unknown package manager: ${choice}. Using fastest available...`,
      ),
    );
    return await detectFastestPackageManager();
  }

  // Verify the manager is still installed
  const isInstalled = await isPackageManagerInstalled(choice);
  if (!isInstalled) {
    console.log(
      chalk.yellow(
        `⚠️  ${choice} is no longer available. Using fastest available...`,
      ),
    );
    return await detectFastestPackageManager();
  }

  // Perform health check to ensure manager is working properly
  const healthCheck = await performPackageManagerHealthCheck(choice);
  if (!healthCheck.healthy) {
    console.log(
      chalk.yellow(`⚠️  ${choice} failed health check: ${healthCheck.error}`),
    );
    console.log(chalk.yellow("⚠️  Using fastest available package manager..."));
    return await detectFastestPackageManager();
  }

  return manager;
}

// Install dependencies with enhanced progress tracking and reporting
export async function installDependencies(
  projectPath,
  packageManager,
  concurrently,
  initializeParts = "both",
) {
  // console.log(
  //     chalk.blue(
  //         `📦 Using ${packageManager.name} ${packageManager.speed} for installation...`,
  //     ),
  // );

  const metrics = new InstallationMetrics(packageManager.name);
  metrics.startPhase("preparation");

  try {
    let installPromises = [];
    let installPaths = [];

    // Determine installation paths
    if (concurrently) {
      // For concurrent projects, install in each workspace separately to avoid hoisting issues
      installPaths = [
        { path: projectPath, name: "root" },
        { path: path.join(projectPath, "client"), name: "client" },
        { path: path.join(projectPath, "server"), name: "server" },
      ];
    } else {
      if (initializeParts === "both") {
        installPaths.push({
          path: path.join(projectPath, "client"),
          name: "client",
        });
        installPaths.push({
          path: path.join(projectPath, "server"),
          name: "server",
        });
      } else if (initializeParts === "client") {
        installPaths.push({
          path: projectPath,
          name: "client",
        });
      } else if (initializeParts === "server") {
        installPaths.push({
          path: projectPath,
          name: "server",
        });
      }
    }

    metrics.endPhase();
    metrics.startPhase("dependency-installation");

    // Create progress indicator with step tracking
    const totalSteps = installPaths.length;
    const progressIndicator = createProgressIndicator(
      `Installing dependencies`,
      { showTimer: true, showSteps: true, totalSteps },
    );

    // Install dependencies with detailed progress
    for (let i = 0; i < installPaths.length; i++) {
      const { path: installPath, name } = installPaths[i];

      progressIndicator.updateStep(i + 1);
      progressIndicator.updateMessage(`Installing ${name} dependencies`);

      if (concurrently || installPaths.length === 1) {
        // Sequential installation with progress updates
        await installInPath(installPath, packageManager, "fast", metrics);
      } else {
        // Parallel installation
        installPromises.push(
          installInPath(installPath, packageManager, "fast", metrics),
        );
      }
    }

    // Wait for parallel installations to complete
    if (installPromises.length > 0) {
      await Promise.all(installPromises);
    }

    progressIndicator.stop(
      chalk.green(`✅ Dependencies installed successfully`),
    );

    metrics.complete(true);

    // Show installation summary
    const report = metrics.getReport();
    // console.log(
    //     chalk.green(
    //         `📊 Installation completed in ${report.totalDuration.toFixed(
    //             1,
    //         )}s using ${packageManager.name}`,
    //     ),
    // );

    // Show detailed breakdown if multiple phases
    // if (report.phases.length > 1) {
    //     console.log(chalk.gray(`   Breakdown:`));
    //     report.phases.forEach((phase) => {
    //         console.log(
    //             chalk.gray(
    //                 `   • ${phase.name}: ${phase.duration.toFixed(1)}s`,
    //             ),
    //         );
    //     });
    // }

    // Show performance metrics if available
    if (report.packagesInstalled > 0) {
      console.log(chalk.gray(`   Packages: ${report.packagesInstalled}`));
    }

    if (report.cacheHitRate !== null) {
      console.log(
        chalk.gray(
          `   Cache hit rate: ${(report.cacheHitRate * 100).toFixed(1)}%`,
        ),
      );
    }
  } catch (error) {
    metrics.complete(false, error.message);

    const report = metrics.getReport();
    console.error(
      chalk.red(
        `❌ Dependency installation failed after ${report.totalDuration.toFixed(
          1,
        )}s: ${error.message}`,
      ),
    );
    console.log(
      chalk.yellow(
        `💡 You can install manually later with: ${getInstallCommand(
          packageManager,
        )}`,
      ),
    );

    // Show what was attempted
    if (report.phases.length > 0) {
      console.log(chalk.gray(`   Phases completed:`));
      report.phases.forEach((phase) => {
        console.log(
          chalk.gray(`   • ${phase.name}: ${phase.duration.toFixed(1)}s`),
        );
      });
    }

    throw error;
  }
}

// Install dependencies in a specific path with context-aware optimizations and metrics
async function installInPath(
  installPath,
  packageManager,
  context = "fast",
  metrics = null,
) {
  const hasLockFile = await fs.pathExists(
    path.join(installPath, packageManager.lockFile),
  );

  let commandArgs;
  let optimizationFlags = [];

  // Determine context based on environment and lock file presence
  if (process.env.CI) {
    context = "ci";
  } else if (hasLockFile) {
    context = "fast"; // Use fast context for existing projects
  } else {
    context = "development"; // Use development context for new projects
  }

  // Get context-specific optimization flags
  optimizationFlags = getOptimizationFlags(packageManager.name, context);

  if (hasLockFile && context !== "ci") {
    // Use CI command for faster, reproducible installs when lock file exists
    commandArgs = packageManager.ciCmd.split(" ");
    // Add context-specific flags
    commandArgs.push(...optimizationFlags);
  } else if (context === "ci") {
    // Use CI-specific flags
    commandArgs = packageManager.ciCmd.split(" ");
    commandArgs.push(...optimizationFlags);
  } else {
    // Use install command with optimization flags
    commandArgs = [
      packageManager.installCmd,
      ...packageManager.installFlags,
      ...optimizationFlags,
    ];
  }

  // Remove duplicates while preserving order
  commandArgs = [...new Set(commandArgs)];

  const installStartTime = Date.now();

  try {
    const result = await execa(packageManager.command, commandArgs, {
      cwd: installPath,
      stdio: "pipe", // Use pipe to avoid interactive prompts
      timeout: 300000, // 5 minute timeout
    });

    // Update metrics if provided
    if (metrics) {
      const installTime = (Date.now() - installStartTime) / 1000;
      metrics.networkTime += installTime * 0.7; // Estimate network time
      metrics.diskTime += installTime * 0.3; // Estimate disk time

      // Try to extract package count from output
      if (result.stdout) {
        const packageMatches = result.stdout.match(/(\d+)\s+packages?/i);
        if (packageMatches) {
          metrics.packagesInstalled += parseInt(packageMatches[1]);
        }
      }
    }
  } catch (error) {
    // If the optimized command fails, try basic install without optimization flags
    console.log(
      chalk.yellow(`⚠️  Optimized install failed, trying basic install...`),
    );
    const basicArgs = hasLockFile
      ? packageManager.ciCmd.split(" ")
      : [packageManager.installCmd];

    if (metrics) {
      metrics.retryCount++;
    }

    try {
      const basicResult = await execa(packageManager.command, basicArgs, {
        cwd: installPath,
        stdio: "pipe",
        timeout: 300000,
      });

      // Update metrics for basic install
      if (metrics) {
        const installTime = (Date.now() - installStartTime) / 1000;
        metrics.networkTime += installTime * 0.7;
        metrics.diskTime += installTime * 0.3;

        if (basicResult.stdout) {
          const packageMatches = basicResult.stdout.match(/(\d+)\s+packages?/i);
          if (packageMatches) {
            metrics.packagesInstalled += parseInt(packageMatches[1]);
          }
        }
      }
    } catch (basicError) {
      // If basic install also fails, try with minimal flags
      console.log(
        chalk.yellow(`⚠️  Basic install failed, trying minimal install...`),
      );

      if (metrics) {
        metrics.retryCount++;
      }

      const minimalResult = await execa(
        packageManager.command,
        [packageManager.installCmd],
        {
          cwd: installPath,
          stdio: "pipe",
          timeout: 300000,
        },
      );

      // Update metrics for minimal install
      if (metrics) {
        const installTime = (Date.now() - installStartTime) / 1000;
        metrics.networkTime += installTime * 0.7;
        metrics.diskTime += installTime * 0.3;

        if (minimalResult.stdout) {
          const packageMatches =
            minimalResult.stdout.match(/(\d+)\s+packages?/i);
          if (packageMatches) {
            metrics.packagesInstalled += parseInt(packageMatches[1]);
          }
        }
      }
    }
  }
}

// Perform comprehensive post-installation verification
export async function performPostInstallationVerification(
  projectPath,
  packageManager,
  initializeParts = "both",
) {
  // console.log(chalk.blue(`🔍 Verifying installation...`));

  const verificationResults = {
    success: true,
    errors: [],
    warnings: [],
    paths: [],
    lockFiles: [],
    nodeModules: [],
    summary: {},
  };

  const pathsToCheck = [];

  // Determine paths to verify
  if (initializeParts === "both") {
    pathsToCheck.push({
      path: path.join(projectPath, "client"),
      name: "client",
    });
    pathsToCheck.push({
      path: path.join(projectPath, "server"),
      name: "server",
    });
  } else if (initializeParts === "client") {
    // For client-only setup, client files are in project root
    pathsToCheck.push({
      path: projectPath,
      name: "client",
    });
  } else if (initializeParts === "server") {
    // For server-only setup, server files are in project root
    pathsToCheck.push({
      path: projectPath,
      name: "server",
    });
  }
  if (pathsToCheck.length === 0) {
    pathsToCheck.push({ path: projectPath, name: "project" });
  }

  const spinner = createProgressIndicator("Verifying installations", {
    showTimer: true,
  });

  try {
    for (const { path: checkPath, name } of pathsToCheck) {
      verificationResults.paths.push(name);

      // Check if package.json exists
      const packageJsonPath = path.join(checkPath, "package.json");
      if (!(await fs.pathExists(packageJsonPath))) {
        verificationResults.errors.push(`Missing package.json in ${name}`);
        verificationResults.success = false;
        continue;
      }

      // Check if lock file exists
      const lockFilePath = path.join(checkPath, packageManager.lockFile);
      if (await fs.pathExists(lockFilePath)) {
        verificationResults.lockFiles.push(
          `${name}/${packageManager.lockFile}`,
        );
      } else {
        verificationResults.warnings.push(
          `No lock file found in ${name} (${packageManager.lockFile})`,
        );
      }

      // Check if node_modules exists and has content
      const nodeModulesPath = path.join(checkPath, "node_modules");
      if (await fs.pathExists(nodeModulesPath)) {
        try {
          const nodeModulesContents = await fs.readdir(nodeModulesPath);
          const packageCount = nodeModulesContents.filter(
            (item) => !item.startsWith("."),
          ).length;
          verificationResults.nodeModules.push(
            `${name}: ${packageCount} packages`,
          );
          verificationResults.summary[name] = {
            packages: packageCount,
          };
        } catch (error) {
          verificationResults.warnings.push(
            `Could not read node_modules in ${name}: ${error.message}`,
          );
        }
      } else {
        verificationResults.errors.push(
          `Missing node_modules directory in ${name}`,
        );
        verificationResults.success = false;
      }

      // Try to run a basic command to verify the installation works
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        if (
          packageJson.scripts &&
          Object.keys(packageJson.scripts).length > 0
        ) {
          // Just verify that the package manager can read the package.json
          await execa(packageManager.command, ["list", "--depth=0"], {
            cwd: checkPath,
            stdio: "pipe",
            timeout: 10000,
          });
        }
      } catch (error) {
        verificationResults.warnings.push(
          `Package manager verification failed in ${name}: ${error.message}`,
        );
      }
    }

    spinner.stop();

    // Display verification results
    if (verificationResults.success) {
      console.log(chalk.green(`✅ Installation verification passed`));

      //     // Show summary
      //     if (verificationResults.nodeModules.length > 0) {
      //         console.log(chalk.gray(`📦 Installed packages:`));
      //         verificationResults.nodeModules.forEach((info) => {
      //             console.log(chalk.gray(`   • ${info}`));
      //         });
      //     }

      //     if (verificationResults.lockFiles.length > 0) {
      //         console.log(chalk.gray(`🔒 Lock files created:`));
      //         verificationResults.lockFiles.forEach((lockFile) => {
      //             console.log(chalk.gray(`   • ${lockFile}`));
      //         });
      //     }
      // } else {
      //     console.log(chalk.red(`❌ Installation verification failed`));
      //     verificationResults.errors.forEach((error) => {
      //         console.log(chalk.red(`   • ${error}`));
      //     });
    }

    // Show warnings if any
    // if (verificationResults.warnings.length > 0) {
    //     console.log(chalk.yellow(`⚠️  Warnings:`));
    //     verificationResults.warnings.forEach((warning) => {
    //         console.log(chalk.yellow(`   • ${warning}`));
    //     });
    // }

    return verificationResults;
  } catch (error) {
    spinner.stop(chalk.red(`❌ Verification failed: ${error.message}`));
    verificationResults.success = false;
    verificationResults.errors.push(
      `Verification process failed: ${error.message}`,
    );
    return verificationResults;
  }
}

// Generate installation report with recommendations
export function generateInstallationReport(
  metrics,
  verificationResults,
  packageManager,
) {
  const report = {
    timestamp: new Date().toISOString(),
    packageManager: packageManager.name,
    performance: metrics.getReport(),
    verification: verificationResults,
    recommendations: [],
  };

  // Add performance recommendations
  if (report.performance.totalDuration > 60) {
    report.recommendations.push(
      "Consider using a faster package manager like bun or pnpm for better performance",
    );
  }

  if (
    report.performance.cacheHitRate !== null &&
    report.performance.cacheHitRate < 0.5
  ) {
    report.recommendations.push(
      "Low cache hit rate detected. Consider clearing and rebuilding package manager cache",
    );
  }

  if (report.performance.retryCount > 0) {
    report.recommendations.push(
      "Installation required retries. Check network connection and registry availability",
    );
  }

  // Add verification recommendations
  if (!report.verification.success) {
    report.recommendations.push(
      "Installation verification failed. Manual verification recommended",
    );
  }

  if (report.verification.warnings.length > 0) {
    report.recommendations.push(
      "Installation completed with warnings. Review warning messages above",
    );
  }

  if (report.verification.lockFiles.length === 0) {
    report.recommendations.push(
      "No lock files were created. Consider running the install command again",
    );
  }

  return report;
}

// Get installation command for user instructions
export function getInstallCommand(packageManager) {
  return `${packageManager.command} ${packageManager.installCmd}`;
}

// Get dev command for user instructions
export function getDevCommand(packageManager, isTypeScript = false) {
  const baseCmd = `${packageManager.command} run`;

  if (isTypeScript) {
    return `${baseCmd} build && ${baseCmd} dev`;
  }

  return `${baseCmd} dev`;
}

// Get start command for user instructions
export function getStartCommand(packageManager) {
  return `${packageManager.command} run start`;
}

// Perform health check on package manager installation
export async function performPackageManagerHealthCheck(managerName) {
  const manager = PACKAGE_MANAGERS[managerName];
  if (!manager || !manager.verification)
    return { healthy: false, error: "No verification config" };

  try {
    const healthCheckCmd = manager.verification.healthCheck;
    const timeout = manager.verification.timeout || 5000;

    await execa(manager.command, healthCheckCmd, {
      stdio: "pipe",
      timeout: timeout,
    });

    return { healthy: true };
  } catch (error) {
    return {
      healthy: false,
      error: `Health check failed: ${error.message}`,
      command: `${
        manager.command
      } ${manager.verification.healthCheck.join(" ")}`,
    };
  }
}

// Get package manager performance metrics
export function getPackageManagerMetrics(managerName) {
  const manager = PACKAGE_MANAGERS[managerName];
  if (!manager) return null;

  return {
    name: manager.name,
    priority: manager.priority,
    speed: manager.speed,
    optimizations: {
      supportsParallel: manager.optimizations.parallel,
      supportsCache: manager.optimizations.cache,
      supportsOffline: manager.optimizations.offline,
      networkOptimized: manager.optimizations.networkOptimized,
      supportsConcurrent: manager.optimizations.concurrent,
    },
    contexts: Object.keys(manager.optimizations.contextFlags || {}),
  };
}

// Get full path to package manager executable
export async function getPackageManagerPath(managerName) {
  const manager = PACKAGE_MANAGERS[managerName];
  if (!manager) return null;

  // First try to find it in PATH
  try {
    const result = await execa("which", [managerName], { stdio: "pipe" });
    return result.stdout.trim();
  } catch {
    // If not in PATH, check common locations
    if (managerName === "bun") {
      const os = getOS();
      const commonPaths = [];

      if (os === "windows") {
        commonPaths.push(
          path.join(process.env.USERPROFILE, ".bun", "bin", "bun.exe"),
          path.join(process.env.USERPROFILE, ".bun", "bin", "bun"),
        );
      } else {
        commonPaths.push(
          path.join(process.env.HOME, ".bun", "bin", "bun"),
          "/usr/local/bin/bun",
          "/opt/homebrew/bin/bun",
        );
      }

      for (const bunPath of commonPaths) {
        if (await fs.pathExists(bunPath)) {
          return bunPath;
        }
      }
    }
  }

  return null;
}
