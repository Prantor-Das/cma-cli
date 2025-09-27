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
    message: "Enter Git repository URL:",
    when: (answers) => answers.gitRepo, // only ask if gitRepo is true
    validate: (input) =>
      input && input.trim() !== "" ? true : "Please provide a valid URL.",
  },
];
