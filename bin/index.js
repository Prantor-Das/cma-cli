#!/usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import { questions } from "./questions.js";
import { createProject } from "./actions.js";

// Print ASCII art banner before questions
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
    const answers = await inquirer.prompt(questions);

    const config = {
        ...answers,
        frontendPath: `${answers.projectName}/client`,
        backendPath: `${answers.projectName}/server`,
    };

    await createProject(config);

    console.log("\nNext steps:");
    console.log(`  cd ${config.projectName}`);

    if (config.concurrently) {
        if (!config.installDependencies) {
            console.log("  npm install");
        }
        console.log("  npm run dev (to start both frontend and backend)");
    } else {
        console.log("\n  To run the frontend:");
        console.log("  cd client");
        console.log("  npm install");
        console.log("  npm run dev");
        console.log("\n  To run the backend (in a new terminal):");
        console.log("  cd server");
        console.log("  npm install");
        console.log("  npm run start");
    }

    console.log("\nHappy coding!\n");
}

run();
