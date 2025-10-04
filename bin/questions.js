import { execa } from "execa";
import { getEffectivePreference } from "./preferenceManager.js";
import { PACKAGE_MANAGERS } from "./packageManager.js";
import {
    getGitHubUsername,
    validateGitHubRepository,
    constructGitHubUrl,
} from "./lib/gitHandler.js";
import { GITHUB_URL_PATTERN, REPO_NAME_PATTERN } from "./lib/constants.js";

// Detect available package managers using enhanced system
async function detectAvailablePackageManagers() {
    const available = [];

    for (const [managerName, config] of Object.entries(PACKAGE_MANAGERS)) {
        try {
            await execa(config.command, ["--version"], { stdio: "ignore" });
            available.push({
                name: `${config.name} ${config.speed}`,
                value: managerName,
            });
        } catch {
            // Manager not available
        }
    }

    return available;
}

export const questions = [
    {
        type: "input",
        name: "projectName",
        message: "What is your project name?",
        default: "my-mern-app",
    },
    {
        type: "list",
        name: "language",
        message: "Choose language:",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript",
    },
    {
        type: "list",
        name: "packageManager",
        message: "Select your preferred package manager from the installed options:",
        choices: async () => {
            const available = await detectAvailablePackageManagers();

            if (available.length === 0) {
                // This should never happen as npm is always available with Node.js
                return [{ name: "npm 📦 Standard", value: "npm" }];
            }

            return available;
        },
        default: async () => {
            // Check for existing preference first
            const effectivePreference = await getEffectivePreference();
            if (effectivePreference.preference) {
                const available = await detectAvailablePackageManagers();
                const availableNames = available.map((m) => m.value);

                // If preferred manager is available, use it
                if (availableNames.includes(effectivePreference.preference)) {
                    return effectivePreference.preference;
                }
            }

            // Fall back to fastest available manager
            const available = await detectAvailablePackageManagers();
            return available.length > 0 ? available[0].value : "npm";
        },
    },
    {
        type: "confirm",
        name: "concurrently",
        message:
            "Do you want to start frontend & backend together using concurrently?",
        default: true,
    },
    {
        type: "list",
        name: "initializeParts",
        message: "Which parts would you like to initialize?",
        choices: [
            { name: "Both client and server", value: "both" },
            { name: "Client only", value: "client" },
            { name: "Server only", value: "server" },
        ],
        default: "both",
        when: (answers) => !answers.concurrently,
    },
    {
        type: "confirm",
        name: "includeHelperRoutes",
        message: "Include helper routes (user authentication, JWT middleware)?",
        default: true,
        when: (answers) => {
            // Ask this question if:
            // 1. Concurrently is true (includes both client and server)
            // 2. OR initializeParts includes server (both or server only)
            return (
                answers.concurrently ||
                answers.initializeParts === "both" ||
                answers.initializeParts === "server"
            );
        },
    },
    {
        type: "confirm",
        name: "installDependencies",
        message: "Install dependencies now? (recommended)",
        default: true,
    },
    {
        type: "confirm",
        name: "gitRepo",
        message: "Initialize git repository?",
        default: false,
    },
    {
        type: "input",
        name: "gitRepoUrl",
        message: async () => {
            const githubUsername = await getGitHubUsername();
            if (githubUsername) {
                return `Enter repository name or full URL (GitHub username found: ${githubUsername}):`;
            }
            return "Enter Git repository URL:";
        },
        when: (answers) => answers.gitRepo, // only ask if gitRepo is true
        validate: async (input) => {
            if (!input || input.trim() === "") {
                return "Please provide a valid repository name or URL.";
            }

            const trimmedInput = input.trim();
            const githubUsername = await getGitHubUsername();

            let finalUrl;

            try {
                finalUrl = constructGitHubUrl(trimmedInput, githubUsername);
            } catch (error) {
                return error.message;
            }

            const isValid = await validateGitHubRepository(finalUrl);

            if (!isValid) {
                return `Repository not found or not accessible: ${finalUrl}\nPlease check the URL and ensure the repository exists and is public or you have access to it.`;
            }

            return true;
        },
    },
];
