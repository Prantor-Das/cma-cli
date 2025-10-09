export const LOCK_FILE_MANAGERS = {
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm",
  "bun.lock": "bun",
};

export const GITHUB_URL_PATTERN =
  /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\.git$/;
export const REPO_NAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

export const PROJECT_TYPES = {
  ROOT: "root",
  CLIENT: "client",
  SERVER: "server",
};

export const INIT_PARTS = {
  BOTH: "both",
  CLIENT: "client",
  SERVER: "server",
};

export const LANGUAGES = {
  JAVASCRIPT: "JavaScript",
  TYPESCRIPT: "TypeScript",
};
