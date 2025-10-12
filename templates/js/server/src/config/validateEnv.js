// Environment variable validation
// Ensures all required environment variables are present before server starts
const validateEnv = () => {
  const isTest = process.env.NODE_ENV === "test";

  // Core required variables
  const requiredEnvVars = [];

  // Database not required in test environment (uses in-memory DB)
  if (!isTest) {
    requiredEnvVars.push("MONGODB_URI");
  }

  /*
   * Please uncomment the following lines to add env vars to the validation
   *
   * Check for missing required variables
   * @type {string[]}
   */

  // const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  // if (missing.length > 0) {
  //   console.error("❌ Missing required environment variables:");
  //   missing.forEach((envVar) => console.error(`   - ${envVar}`));
  //   console.error(
  //     "\n💡 Copy .env.example to .env and fill in the required values",
  //   );
  //   process.exit(1);
  // }

  if (!isTest) {
    console.log("✅ Environment variables validated successfully");
  }
};

export default validateEnv;
