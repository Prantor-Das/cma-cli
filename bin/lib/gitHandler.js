import { execa } from "execa";
import { GITHUB_URL_PATTERN, REPO_NAME_PATTERN } from "./constants.js";
import chalk from "chalk";

export async function getGitHubUsername() {
  const strategies = [
    () => execa("git", ["config", "--global", "github.user"]),
    () => execa("git", ["config", "--global", "user.name"]),
    () => getGitHubUsernameFromRemotes(),
  ];

  for (const strategy of strategies) {
    try {
      const result = await strategy();
      const username = result.stdout?.trim();
      if (username) return username;
    } catch {
      continue;
    }
  }

  return null;
}

async function getGitHubUsernameFromRemotes() {
  const { stdout } = await execa("git", [
    "config",
    "--get-regexp",
    "remote\\..*\\.url",
  ]);
  const lines = stdout.split("\n");

  for (const line of lines) {
    const httpsMatch = line.match(/github\.com\/([^\/]+)\//);
    if (httpsMatch) return { stdout: httpsMatch[1] };

    const sshMatch = line.match(/git@github\.com:([^\/]+)\//);
    if (sshMatch) return { stdout: sshMatch[1] };
  }

  throw new Error("No GitHub username found in remotes");
}

export async function validateGitHubRepository(url) {
  try {
    await execa("git", ["ls-remote", "--heads", url], {
      timeout: 10000,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

export function constructGitHubUrl(input, username) {
  const trimmedInput = input.trim();

  if (GITHUB_URL_PATTERN.test(trimmedInput)) {
    return trimmedInput;
  }

  if (username && REPO_NAME_PATTERN.test(trimmedInput)) {
    return `https://github.com/${username}/${trimmedInput}.git`;
  }

  throw new Error(
    "Invalid repository format. Expected: repository-name or https://github.com/username/repo.git",
  );
}

export async function initializeGit(projectPath, gitRepoInput) {
  if (!gitRepoInput) {
    console.log(
      "   ⚠️  Git repository initialization skipped - no URL provided",
    );
    return;
  }

  try {
    const githubUsername = await getGitHubUsername();
    const gitRepoUrl = constructGitHubUrl(gitRepoInput, githubUsername);

    if (githubUsername && !GITHUB_URL_PATTERN.test(gitRepoInput.trim())) {
      console.log(`   ▸ Constructed URL: ${gitRepoUrl}`);
    }

    console.log(`   ▸ Validating repository access...`);

    await ensureGitAvailable();
    await execa("git", ["init"], { cwd: projectPath });
    await execa("git", ["remote", "add", "origin", gitRepoUrl], {
      cwd: projectPath,
    });
    await execa("git", ["remote", "-v"], { cwd: projectPath });

    console.log("   ▸ Git repository initialized successfully!");
    console.log("   ▸ Next steps:");
    console.log(
      "      - Make your initial commit: git add . && git commit -m 'Initial commit'",
    );
    console.log("      - Push to remote: git push -u origin main");
  } catch (error) {
    handleGitError(error, gitRepoInput);
  }
}

async function ensureGitAvailable() {
  try {
    await execa("git", ["--version"]);
  } catch {
    throw new Error(
      "Git is not installed or not available in PATH. Please install Git first.",
    );
  }
}

function handleGitError(error, gitRepoInput) {
  console.error("   ❌ Git initialization failed!");

  const errorHandlers = {
    "not installed": () => {
      console.error("   🔍 Reason: Git is not installed on your system");
      console.error(
        "   💡 Solution: Install Git from https://git-scm.com/downloads",
      );
    },
    "Invalid repository format": () => {
      console.error(`   🔍 Reason: ${error.message}`);
      console.error(
        "   💡 Solution: Use format 'repo-name' or 'https://github.com/username/repo.git'",
      );
    },
    "remote add": () => {
      console.error("   🔍 Reason: Failed to add remote origin");
      console.error(
        "   💡 Solution: Check if the repository URL is correct and accessible",
      );
    },
    "already exists": () => {
      console.error(
        "   🔍 Reason: Git repository already exists in this directory",
      );
      console.error(
        "   💡 Solution: Remove existing .git folder or use a different directory",
      );
    },
  };

  const handler = Object.entries(errorHandlers).find(([key]) =>
    error.message.includes(key),
  )?.[1];

  if (handler) {
    handler();
  } else {
    console.error(`   🔍 Reason: ${error.message}`);
    console.error(
      "   💡 Solution: Check your git configuration and repository URL",
    );
  }

  console.error("   ⚠️  Project created successfully, but git setup failed");
  console.error("   ▸ You can initialize git manually later with:");
  console.error("      git init");
  console.error(`      git remote add origin ${gitRepoInput}`);
}
