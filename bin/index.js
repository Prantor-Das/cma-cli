#!/usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import { questions } from "./questions.js";
import { createProject } from "./actions.js";

// Banner
console.log(
  chalk.white.bold(
    figlet.textSync("> C M A", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    }),
  ),
);

async function run() {
  try {
    const answers = await inquirer.prompt(questions);

    const config = {
      ...answers,
      frontendPath: `${answers.projectName}/client`,
      backendPath: `${answers.projectName}/server`,
    };

    await createProject(config);

    // Show next steps
    console.log("\n📌 Next steps:");
    console.log(`  cd ${config.projectName}`);

    if (config.concurrently) {
      if (!config.installDependencies) {
        console.log("  npm install");
      }

      if (config.language === "TypeScript") {
        console.log("  npm run build && npm run dev");
      } else {
        console.log("  npm run dev");
      }
    } else {
      console.log("\n  To run the frontend:");
      console.log("  cd client");
      if (!config.installDependencies) {
        console.log("  npm install");
      }
      console.log(
        config.language === "TypeScript"
          ? "  npm run build && npm run dev"
          : "  npm run dev",
      );

      console.log("\n  To run the backend (in a new terminal):");
      console.log("  cd server");
      if (!config.installDependencies) {
        console.log("  npm install");
      }
      console.log("  npm run start");
    }

    console.log("\nHappy coding!\n");
  } catch (err) {
    console.error(chalk.red(`\n❌ Error: ${err.message}\n`));
  }
}

run();
