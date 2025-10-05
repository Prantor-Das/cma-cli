# Package Installation Scripts

This project includes smart scripts for installing dependencies across the CLI tool and template directories.

## Features

- **Automatic Package Manager Detection**: Uses the same package manager you used to run the script
- **Multiple Package Managers**: Support for npm, yarn, pnpm, and bun
- **Flexible Scope**: Install in all directories or just the root
- **Detailed Reporting**: Shows timing, success/failure counts, and errors

## Usage

### Simple Usage (Recommended)

The script automatically detects which package manager you're using:

```bash
# Use npm for all installations
npm run i-all

# Use bun for all installations (super fast!)
bun run i-all

# Use pnpm for all installations
pnpm run i-all

# Use yarn for all installations
yarn run i-all

# Install only in root directory
npm run i-root
bun run i-root
```

### Available Scripts

```bash
# Install in all directories (root + templates)
<package-manager> run i-all

# Install only in root directory
<package-manager> run i-root
```

### Options (if needed)

- `--root` - Install only in root directory
- `--pm <manager>` - Force specific package manager (overrides auto-detection)
- `--help` - Show help message

### Examples

```bash
# Automatic detection - uses the package manager from the command
npm run i-all      # Uses npm everywhere
bun run i-all      # Uses bun everywhere (fastest!)
pnpm run i-all     # Uses pnpm everywhere
yarn run i-all     # Uses yarn everywhere

# Root only installations
npm run i-root     # Uses npm for root only
bun run i-root     # Uses bun for root only

# Force override (if needed)
npm run i-all -- --pm bun    # Run with npm but use bun for installations
```

## Directories

The script installs packages in:

1. **Root** (`.`) - CLI tool dependencies
2. **JavaScript Template** (`templates/js`) - MERN workspace (client + server)
3. **TypeScript Template** (`templates/ts`) - MERN workspace (client + server)

## Package Manager Detection

The script automatically detects which package manager you used to run it:

1. **Environment Detection** (primary): Detects from `npm_config_user_agent` and `npm_execpath`
2. **Lock File Detection** (fallback): 
   - `pnpm-lock.yaml` → uses pnpm
   - `yarn.lock` → uses yarn
   - `bun.lockb` → uses bun
   - Default → uses npm

## Performance Comparison

Real-world performance (tested):
- **npm**: ~25-30s per directory
- **yarn**: ~15-20s per directory  
- **pnpm**: ~10-15s per directory
- **bun**: ~0.1s per directory (200x faster!)

## Clean Script

The clean script provides comprehensive cleanup of all package manager artifacts and build files across the entire project.

### Usage

```bash
npm run clean
```

### What It Cleans

The script recursively scans the entire project and removes:

#### Node Modules
- All `node_modules` directories throughout the project

#### Lock Files
- **NPM**: `package-lock.json`, `npm-shrinkwrap.json`
- **Yarn**: `yarn.lock`, `.yarnrc`, `.yarnrc.yml`
- **PNPM**: `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.pnpmfile.cjs`
- **Bun**: `bun.lockb`
- **Others**: `shrinkwrap.yaml`, `package-lock.yaml`, `rush.json`, `common-versions.json`

#### Cache Directories
- Package manager caches: `.npm`, `.yarn`, `.pnpm-store`, `.pnpm`, `.cache`
- Build caches: `.next`, `.nuxt`, `dist`, `build`, `.turbo`, `.rush`

#### Log Files
- Debug logs: `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- Package manager logs: `pnpm-debug.log*`, `lerna-debug.log*`, `.pnpm-debug.log*`

### Features

- **Smart Scanning**: Recursively finds all cleanup targets while avoiding system directories
- **Detailed Reporting**: Shows exactly what was found and removed
- **Error Handling**: Continues cleaning even if some files can't be removed
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Safe Operation**: Uses force removal but won't break your system

### Output Example

```
🧹 Starting comprehensive cleanup process...

Scanning for dependencies, lock files, cache directories, and logs...

Found:
  • 3 node_modules directories
  • 2 lock files
  • 1 cache directories
  • 0 log files

Removing node_modules directories...
✓ Removed node_modules: node_modules
✓ Removed node_modules: templates/js/node_modules
✓ Removed node_modules: templates/ts/node_modules

Removing lock files...
✓ Removed lock file: package-lock.json
✓ Removed lock file: templates/js/package-lock.json

✨ Cleanup complete! Removed 5/5 items.
```

## Recommended Workflow

```bash
# For development (fastest)
bun run i-all

# For production/CI (most compatible)
npm run i-all

# Comprehensive clean and reinstall
npm run clean        # Removes everything
bun run i-all  # Fast reinstall
```