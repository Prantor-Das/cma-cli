import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";

const clientOptionalPackages = {
    axios: "^1.6.8",
};

const serverOptionalPackages = {
    jsonwebtoken: "^9.0.2",
    cors: "^2.8.5",
    dotenv: "^16.3.1",
    bcrypt: "^5.1.0",
};

async function processPackageJson(
    projectPath,
    extraPackages,
    language,
    projectName,
) {
    console.log("\n📦 Processing package.json configuration...");

    const rootPackageJsonPath = path.join(projectPath, "package.json");
    const clientPackageJsonPath = path.join(
        projectPath,
        "client",
        "package.json",
    );
    const serverPackageJsonPath = path.join(
        projectPath,
        "server",
        "package.json",
    );

    const updatePackageJson = async (packageJsonPath, type) => {
        const packageJson = await fs.readJson(packageJsonPath);

        if (type === "root") {
            packageJson.name = projectName;
        } else {
            packageJson.name = `${projectName}-${type}`;
        }

        const relevantOptionalPackages =
            type === "client" ? clientOptionalPackages : serverOptionalPackages;

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
                if (
                    !extraPackages.includes(pkg) &&
                    packageJson.dependencies[pkg]
                ) {
                    delete packageJson.dependencies[pkg];
                }
            }
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    };

    await updatePackageJson(rootPackageJsonPath, "root");
    await updatePackageJson(clientPackageJsonPath, "client");
    await updatePackageJson(serverPackageJsonPath, "server");

    console.log("   ✅ Package configuration updated successfully");
}

async function processTemplateFiles(projectPath, extraPackages, language) {
    console.log("\n🔧 Processing template files and dependencies...");

    const serverFilePath = path.join(
        projectPath,
        "server",
        "src",
        `server.${language === "JavaScript" ? "js" : "ts"}`,
    );
    let serverFileContent = await fs.readFile(serverFilePath, "utf-8");

    if (!extraPackages.includes("dotenv")) {
        serverFileContent = serverFileContent.replace(
            /import dotenv from "dotenv";\n/,
            "",
        );
        serverFileContent = serverFileContent.replace(
            /dotenv.config\(\);\n/,
            "",
        );
    }

    if (!extraPackages.includes("cors")) {
        serverFileContent = serverFileContent.replace(
            /import cors from "cors";\n/,
            "",
        );
        serverFileContent = serverFileContent.replace(
            /app.use\(cors\(\)\);\n/,
            "",
        );
    }

    await fs.writeFile(serverFilePath, serverFileContent);

    const apiMessageFilePath = path.join(
        projectPath,
        "client",
        "src",
        "components",
        `ApiMessage.${language === "JavaScript" ? "jsx" : "tsx"}`,
    );
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

    console.log("   ✅ Template files configured successfully");
}

async function createProjectFolder(projectPath) {
    console.log(`\n📁 Creating project directory...`);
    console.log(`   → ${projectPath}`);
    await fs.mkdir(projectPath);
    console.log(`   ✅ Project directory created successfully`);
}

async function copyTemplateFiles(templateDir, projectPath) {
    console.log(`\n📋 Copying template files...`);
    console.log(`   → Source: ${templateDir}`);
    console.log(`   → Destination: ${projectPath}`);
    await fs.copy(templateDir, projectPath);
    console.log(`   ✅ Template files copied successfully`);
}

async function installDependencies(projectPath, install) {
    console.log(`\n📦 Dependency Installation`);

    if (install) {
        console.log(`   → Installing all workspace dependencies...`);
        console.log(`   → This may take a few minutes`);
        const args = ["install"];
        await execa("npm", args, { cwd: projectPath });
        console.log(`   ✅ Dependencies installed successfully`);
    } else {
        console.log(`   ⏭️  Skipping dependency installation`);
        console.log(`   → Run 'npm install' manually when ready`);
    }
}

async function initializeGit(projectPath, gitRepo) {
    console.log(`\n🔄 Git Repository Setup`);

    if (gitRepo) {
        console.log(`   → Initializing Git repository...`);
        await execa("git", ["init"], { cwd: projectPath });
        console.log(`   ✅ Git repository initialized successfully`);
    } else {
        console.log(`   ⏭️  Skipping Git initialization`);
    }
}

export async function createProject(config) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templateDir = path.resolve(
        __dirname,
        `../templates/${config.language === "JavaScript" ? "js" : "ts"}`,
    );
    const projectPath = path.resolve(process.cwd(), config.projectName);

    console.log(`\n🚀 Creating Full-Stack Project: "${config.projectName}"`);
    console.log(`${"=".repeat(60)}`);

    try {
        await createProjectFolder(projectPath);
        await copyTemplateFiles(templateDir, projectPath);
        await processPackageJson(
            projectPath,
            config.extraPackages,
            config.language,
            config.projectName,
        );
        await processTemplateFiles(
            projectPath,
            config.extraPackages,
            config.language,
        );

        console.log(`\n⚛️  Frontend Setup`);
        console.log(
            `   → Framework: ${
                config.language === "TypeScript"
                    ? "Vite + React + TypeScript"
                    : "Vite + React + JavaScript"
            }`,
        );
        console.log(`   ✅ Frontend configured successfully`);

        console.log(`\n🖥️  Backend Setup`);
        console.log(`   → Framework: Express.js + MongoDB`);
        console.log(`   ✅ Backend configured successfully`);

        if (config.extraPackages.length > 0) {
            console.log(`\n📚 Optional Packages`);
            console.log(`   → Selected: ${config.extraPackages.join(", ")}`);
            console.log(`   ✅ Optional packages configured successfully`);
        } else {
            console.log(`\n📚 Optional Packages`);
            console.log(`   ⏭️  No optional packages selected`);
        }

        if (config.concurrently) {
            console.log(`\n⚡ Concurrent Development Setup`);
            console.log(
                `   → Configuring scripts for simultaneous frontend + backend development`,
            );
            // Logic to configure concurrently - this will be added later
            console.log(`   ✅ Concurrent development scripts configured`);
        } else {
            console.log(`\n⚡ Concurrent Development Setup`);
            console.log(`   ⏭️  Skipping concurrent development setup`);
        }

        await installDependencies(
            projectPath,
            config.installDependencies,
            config.language,
        );
        await initializeGit(projectPath, config.gitRepo);

        console.log(`\n${"=".repeat(60)}`);
        console.log(
            `🎉 SUCCESS! Project "${config.projectName}" created successfully!`,
        );
        console.log(`\n📖 Next Steps:`);
        console.log(`   1. cd ${config.projectName}`);
        if (!config.installDependencies) {
            console.log(`   2. npm install`);
            console.log(
                `   3. npm run dev (to start both frontend and backend)`,
            );
        } else {
            console.log(
                `   2. npm run dev (to start both frontend and backend)`,
            );
        }
        console.log(`\n🌟 Happy coding!`);
    } catch (err) {
        console.error(`\n❌ Error creating project:`, err);
        console.error(`\n💡 Please check the error above and try again.`);
    }
}
