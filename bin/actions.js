import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import { getGitHubUsername } from "./questions.js";

async function updatePackageJson(packageJsonPath, projectName, type) {
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = type === "root" ? projectName : `${projectName}-${type}`;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function processPackageJson(projectPath, projectName, concurrently) {
  const clientPackage = path.join(projectPath, "client", "package.json");
  const serverPackage = path.join(projectPath, "server", "package.json");

  if (concurrently) {
    await updatePackageJson(
      path.join(projectPath, "package.json"),
      projectName,
      "root"
    );
  }

  await updatePackageJson(clientPackage, projectName, "client");
  await updatePackageJson(serverPackage, projectName, "server");
}

async function createProjectFolder(projectPath) {
  await fs.mkdir(projectPath);
}

async function copyTemplateFiles(templateDir, projectPath, concurrently) {
  await fs.copy(templateDir, projectPath);
  if (!concurrently) {
    await fs.remove(path.join(projectPath, "package.json"));
  }
}

async function installDependencies(projectPath, concurrently) {
  if (concurrently) {
    await execa("npm", ["install"], { cwd: projectPath, stdio: "inherit" });
  } else {
    console.log("▸ Installing client dependencies...");
    await execa("npm", ["install"], {
      cwd: path.join(projectPath, "client"),
      stdio: "inherit",
    });
    console.log("▸ Installing server dependencies...");
    await execa("npm", ["install"], {
      cwd: path.join(projectPath, "server"),
      stdio: "inherit",
    });
  }
}

async function initializeGit(projectPath, gitRepoInput) {
  if (gitRepoInput) {
    const trimmedInput = gitRepoInput.trim();
    let gitRepoUrl = trimmedInput;
    
    // Check if it's already a full GitHub URL
    const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.git$/;
    
    if (!githubUrlPattern.test(trimmedInput)) {
      // If it's not a full URL, try to construct it using GitHub username
      const githubUsername = await getGitHubUsername();
      if (githubUsername && /^[a-zA-Z0-9_-]+$/.test(trimmedInput)) {
        gitRepoUrl = `https://github.com/${githubUsername}/${trimmedInput}.git`;
      }
    }
    
    await execa("git", ["init"], { cwd: projectPath });
    await execa("git", ["remote", "add", "origin", gitRepoUrl], {
      cwd: projectPath,
    });
  }
}

export async function createProject(config) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(
    __dirname,
    `../templates/${config.language === "JavaScript" ? "js" : "ts"}`
  );
  const projectPath = path.resolve(process.cwd(), config.projectName);

  console.log(`\n✨ Creating MERN app: ${config.projectName}\n`);

  try {
    console.log("▸ Setting up project structure...");
    await createProjectFolder(projectPath);
    await copyTemplateFiles(templateDir, projectPath, config.concurrently);
    await processPackageJson(
      projectPath,
      config.projectName,
      config.concurrently
    );

    console.log("▸ Configuring frontend...");
    console.log(
      `   Using ${
        config.language === "TypeScript"
          ? "React + TypeScript (Vite)"
          : "React (Vite)"
      }`
    );

    console.log("▸ Configuring backend...");
    console.log("   Using Express.js + MongoDB");

    if (config.concurrently) {
      console.log("▸ Adding concurrently scripts...");
    }

    if (config.installDependencies) {
      console.log("▸ Installing dependencies (this may take a minute)...");
      await installDependencies(
        projectPath,
        config.concurrently
      );
    }

    if (config.gitRepo && config.gitRepoUrl) {
      console.log("▸ Initializing Git repository...");
      await initializeGit(projectPath, config.gitRepoUrl);
    }

    console.log(`\n🎉 Project ${config.projectName} created successfully!`);
  } catch (err) {
    console.error(`\n❌ Setup failed: ${err.message}`);
    throw err;
  }
}
