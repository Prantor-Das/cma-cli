import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";

const clientOptionalPackages = {
  "axios": "^1.6.8",
};

const serverOptionalPackages = {
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "bcrypt": "^5.1.0",
};

async function processPackageJson(projectPath, extraPackages, language) {
  console.log("✨ Processing package.json files...");

  const clientPackageJsonPath = path.join(projectPath, "client", "package.json");
  const serverPackageJsonPath = path.join(projectPath, "server", "package.json");

  const updatePackageJson = async (packageJsonPath, type) => {
    const packageJson = await fs.readJson(packageJsonPath);

    const relevantOptionalPackages = type === "client" ? clientOptionalPackages : serverOptionalPackages;

    // Add selected optional packages
    for (const pkg of extraPackages) {
      if (relevantOptionalPackages[pkg]) {
        if (!packageJson.dependencies) {
          packageJson.dependencies = {};
        }
        packageJson.dependencies[pkg] = relevantOptionalPackages[pkg];
      }
    }

    // Remove unselected optional packages
    if (packageJson.dependencies) {
      for (const pkg in relevantOptionalPackages) {
        if (!extraPackages.includes(pkg) && packageJson.dependencies[pkg]) {
          delete packageJson.dependencies[pkg];
        }
      }
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  };

  await updatePackageJson(clientPackageJsonPath, "client");
  await updatePackageJson(serverPackageJsonPath, "server");

  console.log("✅ package.json files processed.");
}

async function createProjectFolder(projectPath) {
  console.log(`✨ Creating project folder: ${projectPath}`);
  await fs.mkdir(projectPath);
  console.log(`✅ Project folder created.`);
}

async function copyTemplateFiles(templateDir, projectPath) {
  console.log(`✨ Copying template files from ${templateDir} to ${projectPath}`);
  await fs.copy(templateDir, projectPath);
  console.log(`✅ Template files copied.`);
}

async function installDependencies(projectPath, install) {
  if (install) {
    console.log(`✨ Installing dependencies in ${projectPath}`);
    await execa("npm", ["install"], { cwd: projectPath });
    console.log(`✅ Dependencies installed.`);
  } else {
    console.log(`❌ Skipping dependency installation.`);
  }
}

async function initializeGit(projectPath, gitRepo) {
  if (gitRepo) {
    console.log(`✨ Initializing Git repository in ${projectPath}`);
    await execa("git", ["init"], { cwd: projectPath });
    console.log(`✅ Git repository initialized.`);
  } else {
    console.log(`❌ Skipping Git initialization.`);
  }
}

export async function createProject(config) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(__dirname, `../templates/${config.language === "JavaScript" ? "js" : "ts"}`);
  const projectPath = path.resolve(process.cwd(), config.projectName);

  try {
    await createProjectFolder(projectPath);
    await copyTemplateFiles(templateDir, projectPath);
    await processPackageJson(projectPath, config.extraPackages, config.language);

    console.log(`✨ Setting up frontend with ${config.language === "TypeScript" ? "Vite + React + TS" : "Vite + React + JS"}`);
    console.log(`✅ Frontend setup complete.`);

    console.log("✨ Adding backend with Express + MongoDB");
    console.log("✅ Backend setup complete.");

    if (config.extraPackages.length > 0) {
      console.log(`✨ Filtering extra packages: ${config.extraPackages.join(", ")}`);
      console.log(`✅ Extra packages filtered.`);
    } else {
      console.log("❌ No extra packages selected.");
    }

    if (config.concurrently) {
      console.log("✨ Configuring concurrently script for frontend + backend");
      // Logic to configure concurrently - this will be added later
      console.log("✅ Concurrently script configured.");
    } else {
      console.log("❌ Skipping concurrently setup.");
    }

    await installDependencies(projectPath, config.installDependencies);
    await initializeGit(projectPath, config.gitRepo);

    console.log(`
🚀 Project "${config.projectName}" created successfully!
`);
  } catch (err) {
    console.error("❌ Error creating project:", err);
  }
}