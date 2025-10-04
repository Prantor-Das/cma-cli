import { getPackageName } from "./projectDetector.js";
import { CONCURRENTLY_DEPENDENCIES } from "./constants.js";
import { readPackageJson, writePackageJson } from "./utils.js";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

class ScriptGenerator {
  constructor(packageManager) {
    this.packageManager = packageManager;
    this.managerCmd = packageManager.command;
  }

  async generatePnpmScripts(projectPath) {
    const clientPackageName = await getPackageName(projectPath, "client");
    const serverPackageName = await getPackageName(projectPath, "server");

    return {
      client: `${this.managerCmd} --filter ${clientPackageName} dev`,
      server: `${this.managerCmd} --filter ${serverPackageName} dev`,
      dev: `concurrently -n server,client -c green,blue "${this.managerCmd} run server" "${this.managerCmd} run client"`,
      build: `${this.managerCmd} --filter ${clientPackageName} build && ${this.managerCmd} --filter ${serverPackageName} build`,
      start: `${this.managerCmd} --filter ${serverPackageName} start`,
      test: `${this.managerCmd} --filter ${clientPackageName} test && ${this.managerCmd} --filter ${serverPackageName} test`,
      lint: `${this.managerCmd} --filter ${clientPackageName} lint && ${this.managerCmd} --filter ${serverPackageName} lint`,
      format: `${this.managerCmd} --filter ${clientPackageName} format && ${this.managerCmd} --filter ${serverPackageName} format`,
      "format:check": `${this.managerCmd} --filter ${clientPackageName} format:check && ${this.managerCmd} --filter ${serverPackageName} format:check`,
      "format:client": `${this.managerCmd} --filter ${clientPackageName} format`,
      "format:server": `${this.managerCmd} --filter ${serverPackageName} format`,
      "format:frontend": `${this.managerCmd} --filter ${clientPackageName} format`,
      "format:backend": `${this.managerCmd} --filter ${serverPackageName} format`,
      clean: `${this.managerCmd} --filter ${clientPackageName} clean && ${this.managerCmd} --filter ${serverPackageName} clean`,
    };
  }

  async generateYarnScripts(projectPath) {
    const clientPackageName = await getPackageName(projectPath, "client");
    const serverPackageName = await getPackageName(projectPath, "server");

    return {
      client: `${this.managerCmd} workspace ${clientPackageName} dev`,
      server: `${this.managerCmd} workspace ${serverPackageName} dev`,
      dev: `concurrently -n server,client -c green,blue "${this.managerCmd} run server" "${this.managerCmd} run client"`,
      build: `${this.managerCmd} workspace ${clientPackageName} build && ${this.managerCmd} workspace ${serverPackageName} build`,
      start: `${this.managerCmd} workspace ${serverPackageName} start`,
      test: `${this.managerCmd} workspace ${clientPackageName} test && ${this.managerCmd} workspace ${serverPackageName} test`,
      lint: `${this.managerCmd} workspace ${clientPackageName} lint && ${this.managerCmd} workspace ${serverPackageName} lint`,
      format: `${this.managerCmd} workspace ${clientPackageName} format && ${this.managerCmd} workspace ${serverPackageName} format`,
      "format:check": `${this.managerCmd} workspace ${clientPackageName} format:check && ${this.managerCmd} workspace ${serverPackageName} format:check`,
      "format:client": `${this.managerCmd} workspace ${clientPackageName} format`,
      "format:server": `${this.managerCmd} workspace ${serverPackageName} format`,
      "format:frontend": `${this.managerCmd} workspace ${clientPackageName} format`,
      "format:backend": `${this.managerCmd} workspace ${serverPackageName} format`,
      clean: `${this.managerCmd} workspace ${clientPackageName} clean && ${this.managerCmd} workspace ${serverPackageName} clean`,
    };
  }

  async generateBunScripts(projectPath) {
    const clientPackageName = await getPackageName(projectPath, "client");
    const serverPackageName = await getPackageName(projectPath, "server");

    return {
      client: `${this.managerCmd} --filter ${clientPackageName} dev`,
      server: `${this.managerCmd} --filter ${serverPackageName} dev`,
      dev: `concurrently -n server,client -c green,blue "${this.managerCmd} run server" "${this.managerCmd} run client"`,
      build: `${this.managerCmd} --filter ${clientPackageName} build && ${this.managerCmd} --filter ${serverPackageName} build`,
      start: `${this.managerCmd} --filter ${serverPackageName} start`,
      test: `${this.managerCmd} --filter ${clientPackageName} test && ${this.managerCmd} --filter ${serverPackageName} test`,
      lint: `${this.managerCmd} --filter ${clientPackageName} lint && ${this.managerCmd} --filter ${serverPackageName} lint`,
      format: `${this.managerCmd} --filter ${clientPackageName} format && ${this.managerCmd} --filter ${serverPackageName} format`,
      "format:check": `${this.managerCmd} --filter ${clientPackageName} format:check && ${this.managerCmd} --filter ${serverPackageName} format:check`,
      "format:client": `${this.managerCmd} --filter ${clientPackageName} format`,
      "format:server": `${this.managerCmd} --filter ${serverPackageName} format`,
      "format:frontend": `${this.managerCmd} --filter ${clientPackageName} format`,
      "format:backend": `${this.managerCmd} --filter ${serverPackageName} format`,
      clean: `${this.managerCmd} --filter ${clientPackageName} clean && ${this.managerCmd} --filter ${serverPackageName} clean`,
    };
  }

  generateNpmScripts() {
    return {
      client: `${this.managerCmd} run dev --workspace client`,
      server: `${this.managerCmd} run dev --workspace server`,
      dev: `concurrently -n server,client -c green,blue "${this.managerCmd} run server" "${this.managerCmd} run client"`,
      build: `${this.managerCmd} run build --workspace client && ${this.managerCmd} run build --workspace server`,
      start: `${this.managerCmd} run start --workspace server`,
      test: `${this.managerCmd} run test --workspace client && ${this.managerCmd} run test --workspace server`,
      lint: `${this.managerCmd} run lint --workspace client && ${this.managerCmd} run lint --workspace server`,
      format: `${this.managerCmd} run format --workspace client && ${this.managerCmd} run format --workspace server`,
      "format:check": `${this.managerCmd} run format:check --workspace client && ${this.managerCmd} run format:check --workspace server`,
      "format:client": `${this.managerCmd} run format --workspace client`,
      "format:server": `${this.managerCmd} run format --workspace server`,
      "format:frontend": `${this.managerCmd} run format --workspace client`,
      "format:backend": `${this.managerCmd} run format --workspace server`,
      clean: `${this.managerCmd} run clean --workspace client && ${this.managerCmd} run clean --workspace server`,
    };
  }

  async generateScripts(projectPath) {
    switch (this.packageManager.name) {
      case "pnpm":
        return await this.generatePnpmScripts(projectPath);
      case "yarn":
        return await this.generateYarnScripts(projectPath);
      case "bun":
        return await this.generateBunScripts(projectPath);
      default:
        return this.generateNpmScripts();
    }
  }
}

export async function updateConcurrentlyScripts(packageJsonPath, packageManager) {
  const packageJson = await readPackageJson(packageJsonPath);

  if (!packageJson.scripts) {
    return;
  }

  const generator = new ScriptGenerator(packageManager);
  const projectPath = path.dirname(packageJsonPath);
  const scripts = await generator.generateScripts(projectPath);

  Object.assign(packageJson.scripts, scripts);

  if (packageManager.name === "pnpm") {
    delete packageJson.workspaces;
    await createPnpmConfig(projectPath);
  }

  await addConcurrentlyDependencies(packageJson, packageManager);
  await writePackageJson(packageJsonPath, packageJson);
}

async function createPnpmConfig(projectPath) {
  const npmrcPath = path.join(projectPath, ".npmrc");
  
  const pnpmConfig = `# PNPM Configuration for MERN workspace
# Maximum hoisting to resolve all dependency issues
hoist-pattern[]=*
public-hoist-pattern[]=*
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true

# Resolve dependency conflicts aggressively
prefer-workspace-packages=false
link-workspace-packages=false
legacy-peer-deps=true

# Additional compatibility settings
node-linker=hoisted
symlink=false
package-import-method=hardlink
`;

  try {
    await fs.writeFile(npmrcPath, pnpmConfig, 'utf8');
    console.log(chalk.blue("▸ Created .npmrc configuration for pnpm compatibility"));
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Could not create .npmrc: ${error.message}`));
  }
}

async function addConcurrentlyDependencies(packageJson, packageManager) {
  if (!packageJson.devDependencies?.concurrently && !packageJson.dependencies?.concurrently) {
    return;
  }

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  const addedDeps = [];

  for (const [depName, depVersion] of Object.entries(CONCURRENTLY_DEPENDENCIES)) {
    const missingInDev = !packageJson.devDependencies[depName];
    const missingInProd = !packageJson.dependencies?.[depName];

    if (missingInDev && missingInProd) {
      packageJson.devDependencies[depName] = depVersion;
      addedDeps.push(depName);
    }
  }

  if (addedDeps.length > 0) {
    console.log(
      chalk.blue(
        `▸ Adding concurrently dependencies for ${packageManager.name} compatibility: ${addedDeps.join(', ')}`
      )
    );
  }
}