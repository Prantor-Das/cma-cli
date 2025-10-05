#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const allDirectories = [
  { path: '.', name: 'Root' },
  { path: 'templates/js', name: 'JavaScript Template' },
  { path: 'templates/ts', name: 'TypeScript Template' }
];

const rootDirectory = [
  { path: '.', name: 'Root' }
];

// Simple color functions without chalk
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

/**
 * Check if a directory has a package.json file
 */
function hasPackageJson(dirPath) {
  return fs.existsSync(path.join(dirPath, 'package.json'));
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    packageManager: null,
    scope: 'all', // 'all' or 'root'
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--pm' || arg === '--package-manager') {
      options.packageManager = args[i + 1];
      i++; // Skip next argument
    } else if (arg === '--root-only' || arg === '--root') {
      options.scope = 'root';
    } else if (arg === '--all') {
      options.scope = 'all';
    } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(arg)) {
      options.packageManager = arg;
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(colors.blue('📦 Package Installation Script\n'));
  console.log('Usage: <package-manager> run i-all [options]\n');
  console.log('The script automatically detects which package manager you used to run it!\n');
  console.log('Options:');
  console.log('  --root-only, --root           Install only in root directory');
  console.log('  --all                         Install in all directories (default)');
  console.log('  --pm, --package-manager <pm>  Force specific package manager (npm, yarn, pnpm, bun)');
  console.log('  -h, --help                    Show this help message\n');
  console.log('Examples:');
  console.log('  npm run i-all           # Uses npm for all directories');
  console.log('  yarn run i-all          # Uses yarn for all directories');
  console.log('  pnpm run i-all          # Uses pnpm for all directories');
  console.log('  bun run i-all           # Uses bun for all directories');
  console.log('  npm run i-root          # Uses npm for root only');
  console.log('  bun run i-root          # Uses bun for root only');
}

/**
 * Detect package manager from environment (how the script was called)
 */
function detectPackageManagerFromEnv() {
  // Check npm_config_user_agent first (most reliable)
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.includes('yarn')) return 'yarn';
    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('bun')) return 'bun';
    if (userAgent.includes('npm')) return 'npm';
  }

  // Check npm_execpath as fallback
  const execPath = process.env.npm_execpath;
  if (execPath) {
    if (execPath.includes('yarn')) return 'yarn';
    if (execPath.includes('pnpm')) return 'pnpm';
    if (execPath.includes('bun')) return 'bun';
    if (execPath.includes('npm')) return 'npm';
  }

  // Check process title
  if (process.title) {
    if (process.title.includes('yarn')) return 'yarn';
    if (process.title.includes('pnpm')) return 'pnpm';
    if (process.title.includes('bun')) return 'bun';
  }

  return null;
}

/**
 * Detect the package manager to use
 */
function detectPackageManager(dirPath, forcedPM = null) {
  if (forcedPM) {
    return forcedPM;
  }
  
  // First try to detect from environment (how script was called)
  const envPM = detectPackageManagerFromEnv();
  if (envPM) {
    return envPM;
  }
  
  // Fallback to lock file detection
  if (fs.existsSync(path.join(dirPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(dirPath, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(dirPath, 'bun.lockb'))) {
    return 'bun';
  }
  // Default to npm
  return 'npm';
}

/**
 * Run a command using child_process.spawn
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${stderr || stdout}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Install packages in a directory
 */
async function installInDirectory(dirPath, dirName, forcedPM = null) {
  if (!hasPackageJson(dirPath)) {
    console.log(colors.yellow(`⚠️  Skipping ${dirName}: No package.json found`));
    return { success: false, skipped: true };
  }

  const packageManager = detectPackageManager(dirPath, forcedPM);
  console.log(colors.cyan(`📦 Installing packages in ${dirName} using ${packageManager}...`));

  try {
    const startTime = Date.now();
    
    // Run the install command
    await runCommand(packageManager, ['install'], {
      cwd: dirPath
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(colors.green(`✓ ${dirName} installation completed in ${duration}s`));
    return { success: true, skipped: false, duration };
  } catch (error) {
    console.error(colors.red(`✗ Failed to install packages in ${dirName}`));
    console.error(colors.red(`  Error: ${error.message}`));
    return { success: false, skipped: false, error: error.message };
  }
}

/**
 * Main installation function
 */
async function installPackages(options) {
  const directories = options.scope === 'root' ? rootDirectory : allDirectories;
  const scopeText = options.scope === 'root' ? 'root directory' : 'all directories';
  const pmText = options.packageManager ? ` using ${options.packageManager}` : '';
  
  console.log(colors.blue(`📦 Starting package installation for ${scopeText}${pmText}...\n`));

  const results = [];
  let totalDuration = 0;

  for (const dir of directories) {
    const result = await installInDirectory(dir.path, dir.name, options.packageManager);
    results.push({ ...result, name: dir.name });
    
    if (result.success && result.duration) {
      totalDuration += parseFloat(result.duration);
    }
    
    console.log(''); // Add spacing between installations
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success && !r.skipped).length;

  console.log(colors.blue('📊 Installation Summary:'));
  console.log(colors.green(`  ✓ Successful: ${successful}`));
  
  if (skipped > 0) {
    console.log(colors.yellow(`  ⚠️  Skipped: ${skipped}`));
  }
  
  if (failed > 0) {
    console.log(colors.red(`  ✗ Failed: ${failed}`));
  }

  if (totalDuration > 0) {
    console.log(colors.cyan(`  ⏱️  Total time: ${totalDuration.toFixed(1)}s`));
  }

  // List failed installations
  const failedResults = results.filter(r => !r.success && !r.skipped);
  if (failedResults.length > 0) {
    console.log(colors.red('\n❌ Failed installations:'));
    failedResults.forEach(result => {
      console.log(colors.red(`  • ${result.name}: ${result.error}`));
    });
  }

  console.log('');
  
  if (failed === 0) {
    console.log(colors.green('🎉 All package installations completed successfully!'));
  } else {
    console.log(colors.yellow('⚠️  Some installations failed. Check the errors above.'));
    process.exit(1);
  }
}

// Parse arguments and run installation
const options = parseArgs();

if (options.help) {
  showHelp();
  process.exit(0);
}

// Validate package manager if specified
if (options.packageManager && !['npm', 'yarn', 'pnpm', 'bun'].includes(options.packageManager)) {
  console.error(colors.red(`❌ Invalid package manager: ${options.packageManager}`));
  console.error(colors.yellow('Valid options: npm, yarn, pnpm, bun'));
  process.exit(1);
}

// Run the installation
installPackages(options).catch(error => {
  console.error(colors.red('💥 Installation process failed:'));
  console.error(colors.red(error.message));
  process.exit(1);
});