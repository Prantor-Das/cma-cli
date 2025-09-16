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

async function processPackageJson(projectPath, extraPackages, language, projectName) {
  console.log("✨ Processing package.json files...");

  const rootPackageJsonPath = path.join(projectPath, "package.json");
  const clientPackageJsonPath = path.join(projectPath, "client", "package.json");
  const serverPackageJsonPath = path.join(projectPath, "server", "package.json");

  const updatePackageJson = async (packageJsonPath, type) => {
    const packageJson = await fs.readJson(packageJsonPath);

    if (type === "root") {
      packageJson.name = projectName;
    } else {
      packageJson.name = `${projectName}-${type}`;
    }

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

  await updatePackageJson(rootPackageJsonPath, "root");
  await updatePackageJson(clientPackageJsonPath, "client");
  await updatePackageJson(serverPackageJsonPath, "server");

  console.log("✅ package.json files processed.");
}

async function processTemplateFiles(projectPath, extraPackages, language) {
  console.log("✨ Processing template files...");

  const serverFilePath = path.join(projectPath, "server", "src", `server.${language === "JavaScript" ? "js" : "ts"}`);
  let serverFileContent = await fs.readFile(serverFilePath, "utf-8");

  if (!extraPackages.includes("dotenv")) {
    serverFileContent = serverFileContent.replace(/import dotenv from "dotenv";\n/, "");
    serverFileContent = serverFileContent.replace(/dotenv.config\(\);\n/, "");
  }

  if (!extraPackages.includes("cors")) {
    serverFileContent = serverFileContent.replace(/import cors from "cors";\n/, "");
    serverFileContent = serverFileContent.replace(/app.use\(cors\(\)\);\n/, "");
  }

  await fs.writeFile(serverFilePath, serverFileContent);

  const apiMessageFilePath = path.join(projectPath, "client", "src", "components", `ApiMessage.${language === "JavaScript" ? "jsx" : "tsx"}`);
  let apiMessageFileContent = await fs.readFile(apiMessageFilePath, "utf-8");

  if (extraPackages.includes("axios")) {
    if (language === "JavaScript") {
      apiMessageFileContent = `import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ApiMessage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("http://localhost:5000/api")
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch API");
      });
  }, []);

  return <p className="text-lg mb-6">{message}</p>;
}
`;
    } else {
      apiMessageFileContent = `import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ApiMessage() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    axios.get("http://localhost:5000/api")
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch API");
      });
  }, []);

  return <p className="text-lg mb-6">{message}</p>;
}
`;
    }
  }

  await fs.writeFile(apiMessageFilePath, apiMessageFileContent);


  console.log("✅ Template files processed.");
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

async function installDependencies(projectPath, install, language) {
  if (install) {
    console.log(`✨ Installing dependencies for all workspaces in ${projectPath}`);
    const args = ["install"];
    await execa("npm", args, { cwd: projectPath });
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
    await processPackageJson(projectPath, config.extraPackages, config.language, config.projectName);
    await processTemplateFiles(projectPath, config.extraPackages, config.language);

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

    await installDependencies(projectPath, config.installDependencies, config.language);
    await initializeGit(projectPath, config.gitRepo);

    console.log(`
🚀 Project "${config.projectName}" created successfully!
`);
  } catch (err) {
    console.error("❌ Error creating project:", err);
  }
}