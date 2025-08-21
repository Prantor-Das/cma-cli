#!/usr/bin/env node

import inquirer from "inquirer";
import { questions } from "./questions.js";
import { printPlannedActions } from "./actions.js";

async function run() {
    const answers = await inquirer.prompt(questions);
    
    const config = {
        ...answers,
        frontendPath: `${answers.projectName}/client`,
        backendPath: `${answers.projectName}/server`
    }

    printPlannedActions(config)
}

run();
