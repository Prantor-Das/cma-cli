import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";

async function processPackageJson(projectPath, projectName, concurrently) {
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
        packageJson.name =
            type === "root" ? projectName : `${projectName}-${type}`;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    };

    if (concurrently) {
        await updatePackageJson(path.join(projectPath, "package.json"), "root");
    }

    await updatePackageJson(clientPackageJsonPath, "client");
    await updatePackageJson(serverPackageJsonPath, "server");
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

async function installDependencies(projectPath, install, concurrently) {
    if (install && concurrently) {
        await execa("npm", ["install"], { cwd: projectPath });
    }
}

async function initializeGit(projectPath, gitRepo) {
    if (gitRepo) {
        await execa("git", ["init"], { cwd: projectPath });
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

    console.log(`\n✨ Creating MERN app: ${config.projectName}\n`);

    try {
        console.log(`▸ Setting up project structure...`);
        await createProjectFolder(projectPath);
        await copyTemplateFiles(templateDir, projectPath, config.concurrently);
        await processPackageJson(
            projectPath,
            config.projectName,
            config.concurrently,
        );

        console.log(`▸ Configuring frontend...`);
        console.log(
            `   Using ${
                config.language === "TypeScript"
                    ? "React + TypeScript (Vite)"
                    : "React (Vite)"
            }`,
        );

        console.log(`▸ Configuring backend...`);
        console.log(`   Using Express.js + MongoDB`);

        if (config.concurrently) {
            console.log(`▸ Adding concurrently scripts...`);
        }

        if (config.installDependencies) {
            console.log(
                `▸ Installing dependencies (this may take a minute)...`,
            );
            await installDependencies(
                projectPath,
                config.installDependencies,
                config.concurrently,
            );
        }

        if (config.gitRepo) {
            console.log(`▸ Initializing Git repository...`);
            await initializeGit(projectPath, config.gitRepo);
        }

        console.log(`\n🎉 Project ${config.projectName} created successfully!`);
    } catch (err) {
        console.error(`\n❌ Error:`, err.message);
    }
}
