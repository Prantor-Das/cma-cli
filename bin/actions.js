export function printPlannedActions(config) {
  console.log("\nPlanned Actions:\n");

  console.log(`✅ Creating project folder: ${config.projectName}`);

  console.log(
    `✅ Setting up frontend with ${
      config.language === "TypeScript"
        ? "Vite + React + TS"
        : "Vite + React + JS"
    }`
  );

  console.log("✅ Adding backend with Express + MongoDB");

  if (config.extraPackages.length > 0) {
    console.log(
      `✅ Installing extra packages: ${config.extraPackages.join(", ")}`
    );
  } else {
    console.log("❌ No extra packages selected");
  }

  if (config.concurrently) {
    console.log("✅ Will configure concurrently script for frontend + backend");
  } else {
    console.log("❌ Skipping concurrently setup");
  }

  if (config.installDependencies) {
    console.log("✅ Will install dependencies");
  } else {
    console.log("❌ Skipping dependency installation");
  }

  if (config.gitRepo) {
    console.log("✅ Will initialize Git repository");
  } else {
    console.log("❌ Skipping Git initialization");
  }

  console.log("\n🚀 Dry run complete. (No files created yet)\n");
}
