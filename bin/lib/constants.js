export const LOCK_FILE_MANAGERS = {
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm",
  "bun.lockb": "bun",
};

export const CONCURRENTLY_DEPENDENCIES = {
  // Core concurrently dependencies
  chalk: "^4.1.2",
  rxjs: "^7.8.2",
  "shell-quote": "^1.8.3",
  "supports-color": "^8.1.1",
  "tree-kill": "^1.2.2",
  yargs: "^17.7.2",

  // Yargs transitive dependencies
  y18n: "^5.0.8",
  "yargs-parser": "^21.1.1",
  "string-width": "^4.2.3",
  "strip-ansi": "^6.0.1",
  "wrap-ansi": "^7.0.0",
  cliui: "^8.0.1",
  escalade: "^3.1.1",
  "get-caller-file": "^2.0.5",
  "require-directory": "^2.1.1",

  // String manipulation dependencies
  "ansi-regex": "^5.0.1",
  "emoji-regex": "^8.0.0",
  "is-fullwidth-code-point": "^3.0.0",
  "ansi-styles": "^4.3.0",
  "color-convert": "^2.0.1",
  "color-name": "^1.1.4",

  // Additional missing dependencies
  "has-flag": "^4.0.0",
  tslib: "^2.8.1",

  // Nodemon dependencies
  chokidar: "^3.5.2",
  readdirp: "^4.0.2",
  anymatch: "^3.1.3",
  "glob-parent": "^6.0.2",
  "is-binary-path": "^2.1.0",
  "is-glob": "^4.0.3",
  "is-extglob": "^2.1.1",
  "normalize-path": "^3.0.0",
  debug: "^4.3.7",
  "ignore-by-default": "^1.0.1",
  minimatch: "^3.1.2",
  "pstree.remy": "^1.1.8",
  semver: "^7.5.3",
  "simple-update-notifier": "^2.0.0",
  touch: "^3.1.0",
  undefsafe: "^2.0.5",

  // Additional glob/path dependencies
  "brace-expansion": "^1.1.11",
  "balanced-match": "^1.0.2",
  "path-is-absolute": "^1.0.1",

  // Vite/Build tool dependencies (for workspace compatibility)
  rollup: "^4.30.1",
  postcss: "^8.5.1",
  picocolors: "^1.1.1",
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
