import { execa } from "execa";

// Get Git global username (from user.name)
async function getGitUsername() {
  try {
    const { stdout } = await execa("git", ["config", "--global", "user.name"]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

// Try to get GitHub username from config or remote URLs
export async function getGitHubUsername() {
  try {
    // Try `github.user` if manually set
    const { stdout } = await execa("git", ["config", "--global", "github.user"]);
    if (stdout.trim()) return stdout.trim();
  } catch {
    // ignore if not set
  }

  try {
    // Look for remotes in global config
    const { stdout } = await execa("git", [
      "config",
      "--get-regexp",
      "remote\\..*\\.url",
    ]);

    const lines = stdout.split("\n");
    for (const line of lines) {
      // HTTPS pattern
      let match = line.match(/github\.com\/([^\/]+)\//);
      if (match) return match[1];

      // SSH pattern
      match = line.match(/git@github\.com:([^\/]+)\//);
      if (match) return match[1];
    }
  } catch {
    // ignore if no remotes
  }

  return null;
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
    type: "confirm",
    name: "concurrently",
    message:
      "Do you want to start frontend & backend together using concurrently?",
    default: true,
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
    message: async (answers) => {
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
      
      // Check if it's a full GitHub URL
      const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.git$/;
      
      if (githubUrlPattern.test(trimmedInput)) {
        return true; // Valid full URL
      }
      
      // If GitHub username is available, check if it's just a repo name
      if (githubUsername) {
        const repoNamePattern = /^[a-zA-Z0-9_-]+$/;
        if (repoNamePattern.test(trimmedInput)) {
          return true; // Valid repo name
        }
      }
      
      // If no GitHub username or invalid format
      if (githubUsername) {
        return "Please enter either a repository name or full URL in format: https://github.com/Username/Repo_Name.git";
      } else {
        return "Please enter URL in this format: https://github.com/Username/Repo_Name.git";
      }
    },

  },
];
