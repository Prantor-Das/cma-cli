import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import {
  resolvePackageManager,
  installDependencies as installDeps,
  performPostInstallationVerification,
  detectFastestPackageManager,
} from "./packageManager.js";
import {
  getProjectPreference,
  setProjectPreference,
  getEffectivePreference,
  resolvePreferenceConflict,
} from "./preferenceManager.js";
import {
  attemptFallback,
  displayFallbackSummary,
  selectIntelligentFallback,
} from "./fallbackHandler.js";
import { detectProjectConfiguration } from "./lib/projectDetector.js";
import { updateConcurrentlyScripts } from "./lib/scriptGenerator.js";
import { initializeGit } from "./lib/gitHandler.js";
import {
  readPackageJson,
  writePackageJson,
  createProgressMessage,
  createSuccessMessage,
  createWarningMessage,
  createErrorMessage,
} from "./lib/utils.js";
import { PROJECT_TYPES, INIT_PARTS, LANGUAGES } from "./lib/constants.js";

async function updatePackageJson(packageJsonPath, projectName, type) {
  const packageJson = await readPackageJson(packageJsonPath);

  // Validate and convert project name to lowercase
  const validatedProjectName = validateAndNormalizeProjectName(projectName);

  packageJson.name =
    type === PROJECT_TYPES.ROOT
      ? validatedProjectName
      : `${validatedProjectName}-${type}`;
  await writePackageJson(packageJsonPath, packageJson);
}

function validateAndNormalizeProjectName(projectName) {
  if (!projectName || typeof projectName !== "string") {
    throw new Error("Project name must be a non-empty string");
  }

  // Convert to lowercase and replace invalid characters with hyphens
  let normalized = projectName.toLowerCase().replace(/[^a-z0-9-_]/g, "-");

  // Remove leading numbers or special characters
  normalized = normalized.replace(/^[^a-z]+/, "");

  // Remove trailing hyphens and underscores
  normalized = normalized.replace(/[-_]+$/, "");

  // Replace multiple consecutive hyphens/underscores with single hyphen
  normalized = normalized.replace(/[-_]+/g, "-");

  if (!normalized || normalized.length === 0) {
    throw new Error(
      "Project name must contain at least one letter after normalization",
    );
  }

  // Ensure it's not too long (npm package name limit is 214 characters)
  if (normalized.length > 200) {
    normalized = normalized.substring(0, 200).replace(/-+$/, "");
  }

  return normalized;
}

async function removeServerContentFromDemo(projectPath) {
  // For client-only setup, remove server-related content from Demo files
  const demoJsxPath = path.join(projectPath, "src", "pages", "Demo.jsx");
  const demoTsxPath = path.join(projectPath, "src", "pages", "Demo.tsx");

  if (await fs.pathExists(demoJsxPath)) {
    await updateDemoFileForClientOnly(demoJsxPath, false);
  }

  if (await fs.pathExists(demoTsxPath)) {
    await updateDemoFileForClientOnly(demoTsxPath, true);
  }

  // Also update constants file to remove API_ENDPOINTS
  const constantsJsPath = path.join(
    projectPath,
    "src",
    "config",
    "constants.js",
  );
  const constantsTsPath = path.join(
    projectPath,
    "src",
    "config",
    "constants.ts",
  );

  if (await fs.pathExists(constantsJsPath)) {
    await updateConstantsFileForClientOnly(constantsJsPath, false);
  }

  if (await fs.pathExists(constantsTsPath)) {
    await updateConstantsFileForClientOnly(constantsTsPath, true);
  }

  // Remove axios dependency from package.json
  const packageJsonPath = path.join(projectPath, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    await removeAxiosFromPackageJson(packageJsonPath);
  }
}

async function updateDemoFileForClientOnly(demoFilePath, isTypeScript) {
  try {
    const content = await fs.readFile(demoFilePath, "utf8");
    let updatedContent = content;

    // Remove server-related imports
    updatedContent = updatedContent.replace(
      /import\s+axios\s+from\s+["']axios["'];\s*\n?/g,
      "",
    );
    updatedContent = updatedContent.replace(
      /import\s+\{\s*API_ENDPOINTS\s*\}\s+from\s+["'][^"']*constants["'];\s*\n?/g,
      "",
    );

    // Remove unused React imports (useState, useEffect) since ApiMessage component is removed
    updatedContent = updatedContent.replace(
      /import\s+\{\s*useState,\s*useEffect\s*\}\s+from\s+["']react["'];\s*\n?/g,
      "",
    );

    // Remove Server icon from imports
    updatedContent = updatedContent.replace(/(\s+)Server,(\s*)/g, "$1$2");
    updatedContent = updatedContent.replace(/,(\s*)Server(\s*),/g, ",$1$2");
    updatedContent = updatedContent.replace(/Server,(\s*)/g, "$1");

    // Remove API-related icons from imports
    updatedContent = updatedContent.replace(/(\s+)AlertCircle,(\s*)/g, "$1$2");
    updatedContent = updatedContent.replace(/(\s+)CheckCircle,(\s*)/g, "$1$2");
    updatedContent = updatedContent.replace(/(\s+)Loader2,(\s*)/g, "$1$2");

    // Clean up any trailing commas in imports
    updatedContent = updatedContent.replace(
      /,(\s*)\}\s+from\s+["']lucide-react["']/g,
      '$1} from "lucide-react"',
    );

    // Remove the entire API Endpoint and Status section
    const apiSectionRegex =
      /\s*{\/\* API Endpoint and Status \*\/}[\s\S]*?<\/div>\s*<\/div>/;
    updatedContent = updatedContent.replace(apiSectionRegex, "");

    // Remove the Server Setup DocumentationCard
    const serverCardRegex =
      /\s*<DocumentationCard\s+icon=\{Server\}[\s\S]*?\/>\s*/;
    updatedContent = updatedContent.replace(serverCardRegex, "");

    // Update client setup items to remove server references
    updatedContent = updatedContent.replace(
      /client\/\.env\.example/g,
      ".env.example",
    );
    updatedContent = updatedContent.replace(
      /client\/src\/pages\/Demo\.jsx/g,
      "src/pages/Demo.jsx",
    );

    // Remove the ApiMessage component definition
    const apiMessageRegex = /function ApiMessage\(\)\s*\{[\s\S]*?\n\}/;
    updatedContent = updatedContent.replace(apiMessageRegex, "");

    // For TypeScript, also remove the ApiState interface
    if (isTypeScript) {
      const apiStateRegex = /interface ApiState\s*\{[\s\S]*?\n\}/;
      updatedContent = updatedContent.replace(apiStateRegex, "");
    }

    // Clean up any extra empty lines
    updatedContent = updatedContent.replace(/\n\s*\n\s*\n/g, "\n\n");

    await fs.writeFile(demoFilePath, updatedContent, "utf8");
  } catch (error) {}
}

async function updateConstantsFileForClientOnly(
  constantsFilePath,
  isTypeScript,
) {
  try {
    const content = await fs.readFile(constantsFilePath, "utf8");
    let updatedContent = content;

    // Remove API_ENDPOINTS export
    if (isTypeScript) {
      updatedContent = updatedContent.replace(
        /export const API_ENDPOINTS = \{[\s\S]*?\} as const;\s*\n?/g,
        "",
      );
    } else {
      updatedContent = updatedContent.replace(
        /export const API_ENDPOINTS = \{[\s\S]*?\};\s*\n?/g,
        "",
      );
    }

    // Remove API_BASE_URL since it's only used for API_ENDPOINTS
    updatedContent = updatedContent.replace(
      /export const API_BASE_URL =[\s\S]*?;\s*\n?/g,
      "",
    );

    // Clean up any extra empty lines
    updatedContent = updatedContent.replace(/\n\s*\n\s*\n/g, "\n\n");

    await fs.writeFile(constantsFilePath, updatedContent, "utf8");
  } catch (error) {}
}

async function removeAxiosFromPackageJson(packageJsonPath) {
  try {
    const packageJson = await readPackageJson(packageJsonPath);

    // Remove axios from dependencies
    if (packageJson.dependencies && packageJson.dependencies.axios) {
      delete packageJson.dependencies.axios;
    }

    await writePackageJson(packageJsonPath, packageJson);
  } catch (error) {}
}

async function addBunTypesToPackageJson(packageJsonPath) {
  try {
    const packageJson = await readPackageJson(packageJsonPath);

    // Initialize devDependencies if it doesn't exist
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }

    // Add @types/bun if not already present
    if (!packageJson.devDependencies["@types/bun"]) {
      packageJson.devDependencies["@types/bun"] = "latest";
    }

    await writePackageJson(packageJsonPath, packageJson);
  } catch (error) {}
}

async function addBunTypesToProject(
  projectPath,
  packageManager,
  concurrently,
  initializeParts = INIT_PARTS.BOTH,
) {
  // Only add @types/bun if using bun as package manager
  if (packageManager.name !== "bun") {
    return;
  }

  const packageJsonPaths = [];

  // Determine which package.json files to update
  if (concurrently || initializeParts === INIT_PARTS.BOTH) {
    // For concurrent or both parts, update client and server package.json files
    if (
      concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.CLIENT
    ) {
      packageJsonPaths.push(path.join(projectPath, "client", "package.json"));
    }

    if (
      concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.SERVER
    ) {
      packageJsonPaths.push(path.join(projectPath, "server", "package.json"));
    }
  } else {
    // For client-only or server-only, package.json is in project root
    packageJsonPaths.push(path.join(projectPath, "package.json"));
  }

  // Add @types/bun to each package.json file
  for (const packageJsonPath of packageJsonPaths) {
    if (await fs.pathExists(packageJsonPath)) {
      await addBunTypesToPackageJson(packageJsonPath);
    }
  }
}

async function renameTemplateTestFiles(projectPath, initializeParts) {
  const testFileRenames = [
    {
      from: "server.template-test.js",
      to: "server.test.js",
    },
    {
      from: "server.template-test.ts",
      to: "server.test.ts",
    },
  ];

  const searchPaths = [];

  if (initializeParts === INIT_PARTS.BOTH) {
    searchPaths.push(
      path.join(projectPath, "server", "src", "__tests__"),
      path.join(projectPath, "client", "src", "__tests__"),
    );
  } else if (initializeParts === INIT_PARTS.SERVER) {
    searchPaths.push(path.join(projectPath, "src", "__tests__"));
  } else if (initializeParts === INIT_PARTS.CLIENT) {
    searchPaths.push(path.join(projectPath, "src", "__tests__"));
  }

  for (const searchPath of searchPaths) {
    if (await fs.pathExists(searchPath)) {
      for (const rename of testFileRenames) {
        const fromPath = path.join(searchPath, rename.from);
        const toPath = path.join(searchPath, rename.to);

        if (await fs.pathExists(fromPath)) {
          await fs.move(fromPath, toPath);
        }
      }
    }
  }
}

async function processTemplateFiles(
  projectPath,
  projectName,
  concurrently,
  initializeParts,
) {
  console.log(chalk.blue("\n▸ Customizing template files..."));
  console.log(chalk.grey(`   Project: ${projectName}`));
  console.log(chalk.grey(`   Concurrent: ${concurrently}`));
  console.log(chalk.grey(`   InitializeParts: ${initializeParts}`));

  // Rename template test files to proper test files
  await renameTemplateTestFiles(projectPath, initializeParts);

  // Process files based on setup type
  if (concurrently) {
    // For concurrent setup, process both client and server from root
    await processClientFiles(projectPath, projectName, "client");
    await processServerFiles(projectPath, projectName, "server");
    await processRootFiles(projectPath, projectName);
  } else if (initializeParts === INIT_PARTS.BOTH) {
    // For both parts (non-concurrent), use traditional structure
    await processClientFiles(projectPath, projectName, "client");
    await processServerFiles(projectPath, projectName, "server");
    await processRootFiles(projectPath, projectName);
  } else {
    // For client-only or server-only, files are in project root
    if (initializeParts === INIT_PARTS.CLIENT) {
      await processClientFiles(projectPath, projectName, ".");
    } else if (initializeParts === INIT_PARTS.SERVER) {
      await processServerFiles(projectPath, projectName, ".");
    }
    // Process root files for single-part setups too
    await processRootFiles(projectPath, projectName);
  }
}

async function processClientFiles(projectPath, projectName, clientDir) {
  const clientPath = path.join(projectPath, clientDir);

  // Rename gitignore to .gitignore
  const gitignorePath = path.join(clientPath, "gitignore");
  const dotGitignorePath = path.join(clientPath, ".gitignore");

  if (await fs.pathExists(gitignorePath)) {
    await fs.move(gitignorePath, dotGitignorePath);
    // console.log(
    //     chalk.gray(`   ✓ Renamed gitignore to .gitignore in ${clientDir}`),
    // );
  }

  // Update index.html title
  const indexHtmlPath = path.join(clientPath, "index.html");
  if (await fs.pathExists(indexHtmlPath)) {
    await updateIndexHtmlTitle(indexHtmlPath, projectName);
    // console.log(
    //     chalk.gray(`   ✓ Updated title in ${clientDir}/index.html`),
    // );
  }

  // Update Navigation component (both JSX and TSX)
  const jsNavPath = path.join(
    clientPath,
    "src",
    "components",
    "Navigation.jsx",
  );
  const tsNavPath = path.join(
    clientPath,
    "src",
    "components",
    "Navigation.tsx",
  );

  if (await fs.pathExists(jsNavPath)) {
    await updateNavigationComponent(jsNavPath, projectName);
    // console.log(
    //     chalk.gray(
    //         `   ✓ Updated navigation in ${clientDir}/src/components/Navigation.jsx`,
    //     ),
    // );
  }
  if (await fs.pathExists(tsNavPath)) {
    await updateNavigationComponent(tsNavPath, projectName);
    // console.log(
    //     chalk.gray(
    //         `   ✓ Updated navigation in ${clientDir}/src/components/Navigation.tsx`,
    //     ),
    // );
  }

  // Update .env.example
  const envExamplePath = path.join(clientPath, ".env.example");
  if (await fs.pathExists(envExamplePath)) {
    await updateEnvExample(envExamplePath, projectName);
    // console.log(
    //     chalk.gray(`   ✓ Updated app name in ${clientDir}/.env.example`),
    // );
  }

  // Delete .gitkeep files
  const deletedCount = await deleteGitkeepFiles(clientPath);
  // if (deletedCount > 0) {
  //     console.log(
  //         chalk.gray(
  //             `   ✓ Removed ${deletedCount} .gitkeep file(s) from ${clientDir}`,
  //         ),
  //     );
  // }
}

async function processServerFiles(projectPath, projectName, serverDir) {
  const serverPath = path.join(projectPath, serverDir);

  // Rename gitignore to .gitignore
  const gitignorePath = path.join(serverPath, "gitignore");
  const dotGitignorePath = path.join(serverPath, ".gitignore");

  if (await fs.pathExists(gitignorePath)) {
    await fs.move(gitignorePath, dotGitignorePath);
    // console.log(
    //     chalk.gray(`   ✓ Renamed gitignore to .gitignore in ${serverDir}`),
    // );
  }

  // Update .env.example if it exists in server
  const envExamplePath = path.join(serverPath, ".env.example");
  if (await fs.pathExists(envExamplePath)) {
    await updateEnvExample(envExamplePath, projectName);
    // console.log(
    //     chalk.gray(`   ✓ Updated app name in ${serverDir}/.env.example`),
    // );
  }

  // Delete .gitkeep files
  const deletedCount = await deleteGitkeepFiles(serverPath);
  // if (deletedCount > 0) {
  //     console.log(
  //         chalk.gray(
  //             `   ✓ Removed ${deletedCount} .gitkeep file(s) from ${serverDir}`,
  //         ),
  //     );
  // }
}

async function processRootFiles(projectPath, projectName) {
  // Rename gitignore to .gitignore at root level
  const gitignorePath = path.join(projectPath, "gitignore");
  const dotGitignorePath = path.join(projectPath, ".gitignore");

  if (await fs.pathExists(gitignorePath)) {
    await fs.move(gitignorePath, dotGitignorePath);
    // console.log(chalk.gray(`   ✓ Renamed gitignore to .gitignore in root`));
  }

  // Delete .gitkeep files at root
  const deletedCount = await deleteGitkeepFiles(projectPath);
  // if (deletedCount > 0) {
  //     console.log(
  //         chalk.gray(
  //             `   ✓ Removed ${deletedCount} .gitkeep file(s) from root`,
  //         ),
  //     );
  // }
}

async function updateIndexHtmlTitle(indexHtmlPath, projectName) {
  try {
    const content = await fs.readFile(indexHtmlPath, "utf8");
    let updatedContent = content;

    // Replace title tag content
    updatedContent = updatedContent.replace(
      /<title>cma-cli<\/title>/g,
      `<title>${projectName}</title>`,
    );

    // Also handle cases where there might be spaces or different formatting
    updatedContent = updatedContent.replace(
      /<title>\s*cma-cli\s*<\/title>/g,
      `<title>${projectName}</title>`,
    );

    if (content !== updatedContent) {
      await fs.writeFile(indexHtmlPath, updatedContent, "utf8");
      // console.log(
      //     chalk.gray(
      //         `     → Replaced title "cma-cli" with "${projectName}"`,
      //     ),
      // );
    } else {
      // console.log(
      //     chalk.gray(
      //         `     → No title replacement needed in ${indexHtmlPath}`,
      //     ),
      // );
    }
  } catch (error) {
    console.log(
      chalk.yellow(`⚠️  Could not update ${indexHtmlPath}: ${error.message}`),
    );
  }
}

async function updateNavigationComponent(navPath, projectName) {
  try {
    const content = await fs.readFile(navPath, "utf8");
    let updatedContent = content;

    // Replace all instances of cma-cli with the project name
    // This handles both JSX and TSX files
    updatedContent = updatedContent.replace(/cma-cli/g, projectName);

    if (content !== updatedContent) {
      await fs.writeFile(navPath, updatedContent, "utf8");
      // console.log(
      //     chalk.gray(
      //         `     → Replaced "cma-cli" with "${projectName}" in navigation`,
      //     ),
      // );
    } else {
      // console.log(
      //     chalk.gray(
      //         `     → No navigation replacement needed in ${navPath}`,
      //     ),
      // );
    }
  } catch (error) {
    console.log(
      chalk.yellow(`⚠️  Could not update ${navPath}: ${error.message}`),
    );
  }
}

async function updateEnvExample(envPath, projectName) {
  try {
    const content = await fs.readFile(envPath, "utf8");
    let updatedContent = content;

    // Replace VITE_APP_NAME=cma-cli with the project name
    updatedContent = updatedContent.replace(
      /VITE_APP_NAME=cma-cli/g,
      `VITE_APP_NAME=${projectName}`,
    );

    // Also replace any other app name patterns that might exist
    updatedContent = updatedContent.replace(
      /APP_NAME=cma-cli/g,
      `APP_NAME=${projectName}`,
    );

    if (content !== updatedContent) {
      await fs.writeFile(envPath, updatedContent, "utf8");
      // console.log(
      //     chalk.gray(`     → Updated app name to "${projectName}"`),
      // );
    } else {
      // console.log(
      //     chalk.gray(`     → No env update needed in ${envPath}`),
      // );
    }
  } catch (error) {
    console.log(
      chalk.yellow(`⚠️  Could not update ${envPath}: ${error.message}`),
    );
  }
}

async function deleteGitkeepFiles(basePath) {
  try {
    // Common directories that might contain .gitkeep files
    const possiblePaths = [
      path.join(basePath, "public", ".gitkeep"),
      path.join(basePath, "src", "assets", ".gitkeep"),
      path.join(basePath, "src", "context", ".gitkeep"),
      path.join(basePath, "src", "utils", ".gitkeep"),
      path.join(basePath, "src", "controllers", ".gitkeep"),
    ];

    let deletedCount = 0;

    for (const gitkeepPath of possiblePaths) {
      if (await fs.pathExists(gitkeepPath)) {
        await fs.remove(gitkeepPath);
        deletedCount++;
      }
    }

    // Also recursively search for any other .gitkeep files
    const additionalGitkeepFiles = await findGitkeepFiles(basePath);
    for (const gitkeepFile of additionalGitkeepFiles) {
      if (!possiblePaths.includes(gitkeepFile)) {
        await fs.remove(gitkeepFile);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.log(
      chalk.yellow(
        `⚠️  Could not delete .gitkeep files in ${basePath}: ${error.message}`,
      ),
    );
    return 0;
  }
}

async function findGitkeepFiles(basePath) {
  const gitkeepFiles = [];

  try {
    const items = await fs.readdir(basePath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(basePath, item.name);

      if (item.isDirectory()) {
        // Recursively search subdirectories
        const subGitkeepFiles = await findGitkeepFiles(fullPath);
        gitkeepFiles.push(...subGitkeepFiles);
      } else if (item.name === ".gitkeep") {
        gitkeepFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors for directories that don't exist or can't be read
  }

  return gitkeepFiles;
}

async function processPackageJson(
  projectPath,
  projectName,
  concurrently,
  initializeParts = INIT_PARTS.BOTH,
) {
  if (concurrently || initializeParts === INIT_PARTS.BOTH) {
    // For concurrent or both parts, use the traditional structure
    const clientPackage = path.join(projectPath, "client", "package.json");
    const serverPackage = path.join(projectPath, "server", "package.json");

    if (concurrently) {
      await updatePackageJson(
        path.join(projectPath, "package.json"),
        projectName,
        PROJECT_TYPES.ROOT,
      );
    }

    if (
      concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.CLIENT
    ) {
      await updatePackageJson(clientPackage, projectName, PROJECT_TYPES.CLIENT);
    }

    if (
      concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.SERVER
    ) {
      await updatePackageJson(serverPackage, projectName, PROJECT_TYPES.SERVER);
    }
  } else {
    // For client-only or server-only, package.json is in project root
    if (initializeParts === INIT_PARTS.CLIENT) {
      await updatePackageJson(
        path.join(projectPath, "package.json"),
        projectName,
        PROJECT_TYPES.CLIENT,
      );
    } else if (initializeParts === INIT_PARTS.SERVER) {
      await updatePackageJson(
        path.join(projectPath, "package.json"),
        projectName,
        PROJECT_TYPES.SERVER,
      );
    }
  }
}

async function createProjectFolder(projectPath, isCurrentDirectory = false) {
  if (!isCurrentDirectory) {
    await fs.mkdir(projectPath);
  }
  // If using current directory, folder already exists - no need to create
}

async function copyTemplateFiles(
  templateDir,
  projectPath,
  concurrently,
  initializeParts = INIT_PARTS.BOTH,
  projectName,
) {
  if (concurrently || initializeParts === INIT_PARTS.BOTH) {
    await fs.copy(templateDir, projectPath);
    if (!concurrently) {
      await fs.remove(path.join(projectPath, "package.json"));
    }
  } else {
    if (initializeParts === INIT_PARTS.CLIENT) {
      // Copy client files directly to project root (not in a client subfolder)
      await fs.copy(path.join(templateDir, "client"), projectPath);
      // Copy root gitignore to project root for client-only setup
      const rootGitignorePath = path.join(templateDir, "gitignore");
      if (await fs.pathExists(rootGitignorePath)) {
        await fs.copy(rootGitignorePath, path.join(projectPath, "gitignore"));
      }
    } else if (initializeParts === INIT_PARTS.SERVER) {
      // Copy server files directly to project root (not in a server subfolder)
      await fs.copy(path.join(templateDir, "server"), projectPath);
      // Copy root gitignore to project root for server-only setup
      const rootGitignorePath = path.join(templateDir, "gitignore");
      if (await fs.pathExists(rootGitignorePath)) {
        await fs.copy(rootGitignorePath, path.join(projectPath, "gitignore"));
      }
    }
  }

  // Remove server-related content from Demo files for client-only projects
  if (initializeParts === INIT_PARTS.CLIENT) {
    await removeServerContentFromDemo(projectPath);
  }

  // Rename gitignore to .gitignore and update project name in files
  await processTemplateFiles(
    projectPath,
    projectName,
    concurrently,
    initializeParts,
  );
}

async function createPnpmWorkspaceFile(projectPath, initializeParts = "both") {
  const workspaceConfig = {
    packages: [],
  };

  if (initializeParts === "both") {
    workspaceConfig.packages = ["client", "server"];
  } else if (initializeParts === "client") {
    workspaceConfig.packages = ["client"];
  } else if (initializeParts === "server") {
    workspaceConfig.packages = ["server"];
  }

  const yamlContent = `packages:\n${workspaceConfig.packages
    .map((pkg) => `  - "${pkg}"`)
    .join("\n")}\n`;

  await fs.writeFile(
    path.join(projectPath, "pnpm-workspace.yaml"),
    yamlContent,
    "utf8",
  );
}

async function createClientPnpmWorkspaceFile(
  projectPath,
  concurrently,
  initializeParts,
) {
  const clientPnpmWorkspaceContent = `ignoredBuiltDependencies:
  - "@tailwindcss/oxide"
`;

  let clientPath;

  // Determine the client path based on setup type
  if (concurrently || initializeParts === INIT_PARTS.BOTH) {
    clientPath = path.join(projectPath, "client");
  } else if (initializeParts === INIT_PARTS.CLIENT) {
    // For client-only setup, client files are in project root
    clientPath = projectPath;
  }

  // Only create if we have a client path (client is being initialized)
  if (clientPath && (await fs.pathExists(clientPath))) {
    await fs.writeFile(
      path.join(clientPath, "pnpm-workspace.yaml"),
      clientPnpmWorkspaceContent,
      "utf8",
    );
  }
}

async function createServerPnpmWorkspaceFile(
  projectPath,
  concurrently,
  initializeParts,
) {
  const serverPnpmWorkspaceContent = `ignoredBuiltDependencies:
  - esbuild
`;

  let serverPath;

  // Determine the server path based on setup type
  if (concurrently || initializeParts === INIT_PARTS.BOTH) {
    serverPath = path.join(projectPath, "server");
  } else if (initializeParts === INIT_PARTS.SERVER) {
    // For server-only setup, server files are in project root
    serverPath = projectPath;
  }

  // Only create if we have a server path (server is being initialized)
  if (serverPath && (await fs.pathExists(serverPath))) {
    await fs.writeFile(
      path.join(serverPath, "pnpm-workspace.yaml"),
      serverPnpmWorkspaceContent,
      "utf8",
    );
  }
}

export async function createProject(config) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(
    __dirname,
    `../templates/${config.language === "JavaScript" ? "js" : "ts"}`,
  );

  // Determine project path based on initialization parts
  let projectPath;

  if (config.isCurrentDirectory) {
    // Use current directory for all cases when projectName is "./"
    projectPath = process.cwd();
  } else if (
    config.concurrently ||
    config.initializeParts === INIT_PARTS.BOTH
  ) {
    projectPath = path.resolve(process.cwd(), config.projectName);
  } else if (config.initializeParts === INIT_PARTS.CLIENT) {
    projectPath = path.resolve(process.cwd(), `${config.projectName}-client`);
  } else if (config.initializeParts === INIT_PARTS.SERVER) {
    projectPath = path.resolve(process.cwd(), `${config.projectName}-server`);
  } else {
    projectPath = path.resolve(process.cwd(), config.projectName);
  }

  // console.log(
  //     createSuccessMessage(`Creating MERN app: ${config.projectName}`),
  // );

  let verificationResults = null;

  try {
    // Package managers are no longer installed automatically
    const wasNewlyInstalled = false;

    // Detect existing project configuration
    const projectConfig = await detectProjectConfiguration(projectPath);

    // Get effective preference (user/project)
    const effectivePreference = await getEffectivePreference(projectPath);

    // Resolve package manager with enhanced logic
    let packageManager;
    try {
      // Handle preference conflicts if multiple preferences exist
      if (
        projectConfig.suggestedManager &&
        effectivePreference.preference &&
        projectConfig.suggestedManager !== effectivePreference.preference
      ) {
        const resolvedPreference = await resolvePreferenceConflict(
          effectivePreference.preference,
          null, // No project preference yet
          projectConfig.suggestedManager,
        );
        packageManager = await resolvePackageManager(
          resolvedPreference || config.packageManager,
        );
      } else {
        packageManager = await resolvePackageManager(config.packageManager);
      }
    } catch (resolveError) {
      console.log(
        chalk.yellow(
          `⚠️  Package manager resolution failed: ${resolveError.message}`,
        ),
      );
      console.log(chalk.blue("🔄 Attempting intelligent fallback..."));

      // Use intelligent fallback selection
      const fallbackManager = await selectIntelligentFallback(
        config.packageManager,
        {
          hasLockFile: projectConfig.lockFiles.length > 0,
          isCI: !!process.env.CI,
          projectSize: "medium", // Could be determined by template complexity
          networkCondition: "fast", // Could be detected
          preferredFeatures: ["speed", "reliability"],
        },
      );

      if (fallbackManager) {
        packageManager = await resolvePackageManager(fallbackManager);
      } else {
        // Final fallback to fastest available
        packageManager = await detectFastestPackageManager();
      }
    }

    // console.log(createProgressMessage("Setting up project structure..."));
    await createProjectFolder(projectPath, config.isCurrentDirectory);
    await copyTemplateFiles(
      templateDir,
      projectPath,
      config.concurrently,
      config.initializeParts,
      config.actualProjectName || config.projectName,
    );
    await processPackageJson(
      projectPath,
      config.actualProjectName || config.projectName,
      config.concurrently,
      config.initializeParts,
    );

    // Add @types/bun to devDependencies when using bun as package manager
    await addBunTypesToProject(
      projectPath,
      packageManager,
      config.concurrently,
      config.initializeParts,
    );

    if (config.concurrently) {
      await updateConcurrentlyScripts(
        path.join(projectPath, "package.json"),
        packageManager,
      );
    }

    // Only create pnpm workspace file when using pnpm and concurrent setup
    if (config.concurrently && packageManager.name === "pnpm") {
      // console.log(
      //   createProgressMessage("Creating pnpm workspace configuration..."),
      // );
      await createPnpmWorkspaceFile(projectPath, config.initializeParts);
    }

    // Create client-specific pnpm-workspace.yaml when using pnpm (regardless of concurrent setup)
    if (
      packageManager.name === "pnpm" &&
      (config.initializeParts === INIT_PARTS.BOTH ||
        config.initializeParts === INIT_PARTS.CLIENT ||
        config.concurrently)
    ) {
      await createClientPnpmWorkspaceFile(
        projectPath,
        config.concurrently,
        config.initializeParts,
      );
    }

    // Create server-specific pnpm-workspace.yaml when using pnpm (regardless of concurrent setup)
    if (
      packageManager.name === "pnpm" &&
      (config.initializeParts === INIT_PARTS.BOTH ||
        config.initializeParts === INIT_PARTS.SERVER ||
        config.concurrently)
    ) {
      await createServerPnpmWorkspaceFile(
        projectPath,
        config.concurrently,
        config.initializeParts,
      );
    }

    const initializeParts = config.initializeParts || INIT_PARTS.BOTH;

    if (
      config.concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.CLIENT
    ) {
      console.log(createProgressMessage("Configuring frontend..."));
      const techStack =
        config.language === LANGUAGES.TYPESCRIPT
          ? "React + TypeScript (Vite)"
          : "React (Vite)";
      console.log(chalk.gray(`   Using ${techStack}`));
    }

    if (
      config.concurrently ||
      initializeParts === INIT_PARTS.BOTH ||
      initializeParts === INIT_PARTS.SERVER
    ) {
      console.log(createProgressMessage("Configuring backend..."));
      console.log(chalk.gray("   Using Express.js + MongoDB"));
    }

    if (config.concurrently) {
      console.log(createProgressMessage("Adding concurrently scripts..."));
    }

    if (config.installDependencies) {
      console.log(
        chalk.blue(
          "▸ Installing dependencies with performance optimizations...",
        ),
      );

      try {
        // Install dependencies with enhanced error handling
        await installDeps(
          projectPath,
          packageManager,
          config.concurrently,
          config.initializeParts,
        );

        // Perform post-installation verification
        // console.log(chalk.blue("▸ Verifying installation..."));
        verificationResults = await performPostInstallationVerification(
          projectPath,
          packageManager,
          config.initializeParts,
        );

        // if (!verificationResults.success) {
        //     console.log(
        //         chalk.yellow(
        //             "⚠️  Installation verification found issues, but continuing...",
        //         ),
        //     );
        // }
      } catch (installError) {
        console.log(
          chalk.red(
            `❌ Dependency installation failed: ${installError.message}`,
          ),
        );
        console.log(chalk.blue("🔄 Attempting fallback installation..."));

        try {
          // Attempt fallback with different package manager
          const fallbackResult = await attemptFallback(
            packageManager.name,
            installError,
          );

          if (fallbackResult.fallbackUsed) {
            console.log(
              chalk.blue(
                `📦 Retrying installation with ${fallbackResult.manager.name}...`,
              ),
            );

            await installDeps(
              projectPath,
              fallbackResult.manager,
              config.concurrently,
              config.initializeParts,
            );

            // Update package manager reference for next steps
            packageManager = fallbackResult.manager;
            config.fallbackUsed = true;
            config.originalManager = fallbackResult.originalManager;

            // Verify fallback installation
            verificationResults = await performPostInstallationVerification(
              projectPath,
              packageManager,
              config.initializeParts,
            );
          }
        } catch (fallbackError) {
          console.log(
            chalk.red(
              `❌ Fallback installation also failed: ${fallbackError.message}`,
            ),
          );
          console.log(
            chalk.yellow(
              `💡 You can install dependencies manually later with: ${packageManager.command} ${packageManager.installCmd}`,
            ),
          );

          // Don't throw error - project creation should continue
          config.installationFailed = true;
          config.installationError = fallbackError.message;
        }
      }
    }

    if (config.gitRepo && config.gitRepoUrl) {
      console.log(chalk.blue("\n▸ Initializing git repository..."));
      await initializeGit(projectPath, config.gitRepoUrl);
    }

    // Set project preference if different from user preference
    const currentProjectPref = await getProjectPreference(projectPath);
    if (
      !currentProjectPref &&
      packageManager.name !== effectivePreference.preference
    ) {
      await setProjectPreference(projectPath, packageManager.name);
      console.log(
        chalk.blue(`📋 Set project preference to ${packageManager.name}`),
      );
    }

    // Determine the actual project folder name that was created
    let actualProjectName;
    if (config.isCurrentDirectory) {
      actualProjectName = config.actualProjectName;
    } else if (
      config.concurrently ||
      config.initializeParts === INIT_PARTS.BOTH
    ) {
      actualProjectName = config.projectName;
    } else if (config.initializeParts === INIT_PARTS.CLIENT) {
      actualProjectName = `${config.projectName}-client`;
    } else if (config.initializeParts === INIT_PARTS.SERVER) {
      actualProjectName = `${config.projectName}-server`;
    } else {
      actualProjectName = config.projectName;
    }

    const successMessage = `\n🎉 Project ${actualProjectName} created successfully!`;

    console.log(chalk.green.bold(successMessage));

    // Display fallback summary if any fallbacks were used
    displayFallbackSummary();

    // Generate and display installation report if dependencies were installed
    // if (config.installDependencies && verificationResults) {
    //     console.log(chalk.cyan("\n📊 Installation Summary:"));

    //     if (config.fallbackUsed) {
    //         console.log(
    //             chalk.yellow(
    //                 `   ⚠️  Fallback used: ${config.originalManager} → ${packageManager.name}`,
    //             ),
    //         );
    //     }

    //     if (verificationResults.success) {
    //         console.log(
    //             chalk.green(
    //                 "   ✅ All dependencies installed and verified",
    //             ),
    //         );
    //     } else {
    //         console.log(
    //             chalk.yellow("   ⚠️  Installation completed with warnings"),
    //         );
    //     }

    //     // Show performance metrics if available
    //     if (verificationResults.summary) {
    //         const totalPackages = Object.values(
    //             verificationResults.summary,
    //         ).reduce((sum, info) => sum + (info.packages || 0), 0);
    //         if (totalPackages > 0) {
    //             console.log(
    //                 chalk.gray(
    //                     `   📦 Total packages installed: ${totalPackages}`,
    //                 ),
    //             );
    //         }
    //     }
    // }

    // Show installation failure message if needed
    if (config.installationFailed) {
      console.log(
        chalk.yellow(
          "\n⚠️  Project created successfully, but dependency installation failed",
        ),
      );
      console.log(chalk.yellow(`   Error: ${config.installationError}`));
      console.log(
        chalk.blue(
          `   💡 Install manually with: cd ${actualProjectName} && ${packageManager.command} ${packageManager.installCmd}`,
        ),
      );
    }

    // Store package manager and installation status for next steps
    config.resolvedPackageManager = packageManager;
    config.packageManagerWasInstalled = wasNewlyInstalled;
  } catch (err) {
    console.error(chalk.red(`\n❌ Setup failed: ${err.message}`));

    // Display fallback summary even on failure
    displayFallbackSummary();

    // Provide helpful error context
    if (err.message.includes("package manager")) {
      console.log(
        chalk.yellow(
          "💡 Try using a different package manager or install it manually",
        ),
      );
    }

    if (err.message.includes("permission")) {
      console.log(
        chalk.yellow(
          "💡 Check file permissions or try running with appropriate privileges",
        ),
      );
    }

    if (err.message.includes("network") || err.message.includes("timeout")) {
      console.log(
        chalk.yellow("💡 Check your internet connection and try again"),
      );
    }

    throw err;
  }
}
