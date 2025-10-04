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
    packageJson.name =
        type === PROJECT_TYPES.ROOT ? projectName : `${projectName}-${type}`;
    await writePackageJson(packageJsonPath, packageJson);
}

async function processPackageJson(
    projectPath,
    projectName,
    concurrently,
    initializeParts = INIT_PARTS.BOTH,
) {
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
        await updatePackageJson(
            clientPackage,
            projectName,
            PROJECT_TYPES.CLIENT,
        );
    }

    if (
        concurrently ||
        initializeParts === INIT_PARTS.BOTH ||
        initializeParts === INIT_PARTS.SERVER
    ) {
        await updatePackageJson(
            serverPackage,
            projectName,
            PROJECT_TYPES.SERVER,
        );
    }
}

async function createProjectFolder(projectPath) {
    await fs.mkdir(projectPath);
}

async function copyTemplateFiles(
    templateDir,
    projectPath,
    concurrently,
    initializeParts = INIT_PARTS.BOTH,
) {
    if (concurrently || initializeParts === INIT_PARTS.BOTH) {
        await fs.copy(templateDir, projectPath);
        if (!concurrently) {
            await fs.remove(path.join(projectPath, "package.json"));
        }
    } else {
        if (initializeParts === INIT_PARTS.CLIENT) {
            await fs.copy(
                path.join(templateDir, "client"),
                path.join(projectPath, "client"),
            );
        } else if (initializeParts === INIT_PARTS.SERVER) {
            await fs.copy(
                path.join(templateDir, "server"),
                path.join(projectPath, "server"),
            );
        }
    }
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

export async function createProject(config) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templateDir = path.resolve(
        __dirname,
        `../templates/${config.language === "JavaScript" ? "js" : "ts"}`,
    );
    const projectPath = path.resolve(process.cwd(), config.projectName);

    console.log(
        createSuccessMessage(`Creating MERN app: ${config.projectName}`),
    );

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
                projectConfig.suggestedManager !==
                    effectivePreference.preference
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
                packageManager = await resolvePackageManager(
                    config.packageManager,
                );
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

        console.log(createProgressMessage("Setting up project structure..."));
        await createProjectFolder(projectPath);
        await copyTemplateFiles(
            templateDir,
            projectPath,
            config.concurrently,
            config.initializeParts,
        );
        await processPackageJson(
            projectPath,
            config.projectName,
            config.concurrently,
            config.initializeParts,
        );

        if (config.concurrently) {
            await updateConcurrentlyScripts(
                path.join(projectPath, "package.json"),
                packageManager,
            );
        }

        if (config.concurrently && packageManager.name === "pnpm") {
            console.log(
                createProgressMessage(
                    "Creating pnpm workspace configuration...",
                ),
            );
            await createPnpmWorkspaceFile(projectPath, config.initializeParts);
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
            console.log(
                createProgressMessage("Adding concurrently scripts..."),
            );
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
                console.log(chalk.blue("▸ Verifying installation..."));
                verificationResults = await performPostInstallationVerification(
                    projectPath,
                    packageManager,
                    config.initializeParts,
                );

                if (!verificationResults.success) {
                    console.log(
                        chalk.yellow(
                            "⚠️  Installation verification found issues, but continuing...",
                        ),
                    );
                }
            } catch (installError) {
                console.log(
                    chalk.red(
                        `❌ Dependency installation failed: ${installError.message}`,
                    ),
                );
                console.log(
                    chalk.blue("🔄 Attempting fallback installation..."),
                );

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
                        verificationResults =
                            await performPostInstallationVerification(
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
                chalk.blue(
                    `📋 Set project preference to ${packageManager.name}`,
                ),
            );
        }

        console.log(
            chalk.green.bold(
                `\n🎉 Project ${config.projectName} created successfully!`,
            ),
        );

        // Display fallback summary if any fallbacks were used
        displayFallbackSummary();

        // Generate and display installation report if dependencies were installed
        if (config.installDependencies && verificationResults) {
            console.log(chalk.cyan("\n📊 Installation Summary:"));

            if (config.fallbackUsed) {
                console.log(
                    chalk.yellow(
                        `   ⚠️  Fallback used: ${config.originalManager} → ${packageManager.name}`,
                    ),
                );
            }

            if (verificationResults.success) {
                console.log(
                    chalk.green(
                        "   ✅ All dependencies installed and verified",
                    ),
                );
            } else {
                console.log(
                    chalk.yellow("   ⚠️  Installation completed with warnings"),
                );
            }

            // Show performance metrics if available
            if (verificationResults.summary) {
                const totalPackages = Object.values(
                    verificationResults.summary,
                ).reduce((sum, info) => sum + (info.packages || 0), 0);
                if (totalPackages > 0) {
                    console.log(
                        chalk.gray(
                            `   📦 Total packages installed: ${totalPackages}`,
                        ),
                    );
                }
            }
        }

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
                    `   💡 Install manually with: cd ${config.projectName} && ${packageManager.command} ${packageManager.installCmd}`,
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

        if (
            err.message.includes("network") ||
            err.message.includes("timeout")
        ) {
            console.log(
                chalk.yellow("💡 Check your internet connection and try again"),
            );
        }

        throw err;
    }
}
