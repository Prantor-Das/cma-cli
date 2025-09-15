#!/usr/bin/env node

import inquirer from "inquirer";
import { questions } from "./questions.js";
import { createProject } from "./actions.js";

async function run() {
    const answers = await inquirer.prompt(questions);
    
    const config = {
        ...answers,
        frontendPath: `${answers.projectName}/client`,
        backendPath: `${answers.projectName}/server`
    }

    
    await createProject(config);

    console.log("\nNext steps:");
    console.log(`  cd ${config.projectName}`);

    if (!config.installDependencies) {
      console.log("  npm install");
    }

    if (config.concurrently) {
      console.log("  npm run dev");
    } else {
      console.log("  # To run frontend:");
      console.log("  cd client && npm run dev");
      console.log("  # To run backend:");
      console.log("  cd server && npm run start");
    }

    console.log("\nHappy coding!\n");
}

run();
