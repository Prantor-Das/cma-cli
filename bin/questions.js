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
    type: "checkbox",
    name: "extraPackages",
    message: "Select additional packages:",
    choices: ["axios", "jsonwebtoken", "cors", "dotenv", "bcrypt"],
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
    default: true,
  },
];
