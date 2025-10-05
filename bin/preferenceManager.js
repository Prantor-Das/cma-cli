import fs from "fs-extra";
import path from "path";
import os from "os";
import { createWarningMessage, createSuccessMessage, createErrorMessage } from "./lib/utils.js";

const USER_CONFIG_DIR = path.join(os.homedir(), ".cma");
const USER_PREFERENCES_FILE = path.join(USER_CONFIG_DIR, "preferences.json");
const PROJECT_PREFERENCES_FILE = ".cma-preferences.json";
const DEFAULT_PREFERENCES = {
  preferredPackageManager: null,
  autoInstallMissing: true,
  enableFallback: true,
  installationTimeout: 300000,
  projectPreferences: {},
  lastUpdated: new Date().toISOString()
};

async function ensureUserConfigDir() {
  try {
    await fs.ensureDir(USER_CONFIG_DIR);
    return true;
  } catch (error) {
    console.warn(createWarningMessage(`Could not create user config directory: ${error.message}`));
    return false;
  }
}

// Load user preferences from file
async function loadUserPreferences() {
  try {
    await ensureUserConfigDir();
    
    if (await fs.pathExists(USER_PREFERENCES_FILE)) {
      const preferences = await fs.readJson(USER_PREFERENCES_FILE);
      
      // Validate and merge with defaults
      return {
        ...DEFAULT_PREFERENCES,
        ...preferences,
        lastUpdated: preferences.lastUpdated || new Date().toISOString()
      };
    }
    
    return { ...DEFAULT_PREFERENCES };
  } catch (error) {
    console.warn(createWarningMessage(`Could not load user preferences: ${error.message}`));
    return { ...DEFAULT_PREFERENCES };
  }
}

// Save user preferences to file
async function saveUserPreferences(preferences) {
  try {
    await ensureUserConfigDir();
    
    const updatedPreferences = {
      ...preferences,
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeJson(USER_PREFERENCES_FILE, updatedPreferences, { spaces: 2 });
    return true;
  } catch (error) {
    console.warn(createWarningMessage(`Could not save user preferences: ${error.message}`));
    return false;
  }
}

// Load project-specific preferences
async function loadProjectPreferences(projectPath) {
  try {
    const projectPrefsFile = path.join(projectPath, PROJECT_PREFERENCES_FILE);
    
    if (await fs.pathExists(projectPrefsFile)) {
      const preferences = await fs.readJson(projectPrefsFile);
      return preferences;
    }
    
    return {};
  } catch (error) {
    console.warn(createWarningMessage(`Could not load project preferences: ${error.message}`));
    return {};
  }
}

// Save project-specific preferences
async function saveProjectPreferences(projectPath, preferences) {
  try {
    const projectPrefsFile = path.join(projectPath, PROJECT_PREFERENCES_FILE);
    
    const updatedPreferences = {
      ...preferences,
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeJson(projectPrefsFile, updatedPreferences, { spaces: 2 });
    return true;
  } catch (error) {
    console.warn(createWarningMessage(`Could not save project preferences: ${error.message}`));
    return false;
  }
}

// Validate preference values
function validatePreference(managerName) {
  const validManagers = ["bun", "pnpm", "yarn", "npm"];
  return validManagers.includes(managerName);
}

// Get user's preferred package manager
export async function getUserPreference() {
  try {
    const preferences = await loadUserPreferences();
    return preferences.preferredPackageManager;
  } catch (error) {
    console.warn(createWarningMessage(`Could not get user preference: ${error.message}`));
    return null;
  }
}

// Set user's preferred package manager
export async function setUserPreference(managerName) {
  try {
    if (!validatePreference(managerName)) {
      throw new Error(`Invalid package manager: ${managerName}`);
    }
    
    const preferences = await loadUserPreferences();
    preferences.preferredPackageManager = managerName;
    
    const saved = await saveUserPreferences(preferences);
    if (saved) {
      // console.log(createSuccessMessage(`Set preferred package manager to ${managerName}`));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(createErrorMessage(`Could not set user preference: ${error.message}`));
    return false;
  }
}

// Get project-specific preference
export async function getProjectPreference(projectPath) {
  try {
    const projectPrefs = await loadProjectPreferences(projectPath);
    return projectPrefs.preferredPackageManager || null;
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Could not get project preference: ${error.message}`));
    return null;
  }
}

// Set project-specific preference
export async function setProjectPreference(projectPath, managerName) {
  try {
    if (!validatePreference(managerName)) {
      throw new Error(`Invalid package manager: ${managerName}`);
    }
    
    const projectPrefs = await loadProjectPreferences(projectPath);
    projectPrefs.preferredPackageManager = managerName;
    
    const saved = await saveProjectPreferences(projectPath, projectPrefs);
    if (saved) {
      console.log(createSuccessMessage(`Set project preference to ${managerName}`));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(createErrorMessage(`Could not set project preference: ${error.message}`));
    return false;
  }
}

// Clear all preferences
export async function clearPreferences() {
  try {
    let cleared = false;
    
    // Clear user preferences
    if (await fs.pathExists(USER_PREFERENCES_FILE)) {
      await fs.remove(USER_PREFERENCES_FILE);
      cleared = true;
    }
    
    // Clear project preferences in current directory
    const currentProjectPrefs = path.join(process.cwd(), PROJECT_PREFERENCES_FILE);
    if (await fs.pathExists(currentProjectPrefs)) {
      await fs.remove(currentProjectPrefs);
      cleared = true;
    }
    
    if (cleared) {
      console.log(chalk.green("✅ All preferences cleared"));
    } else {
      console.log(chalk.blue("ℹ️  No preferences to clear"));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Could not clear preferences: ${error.message}`));
    return false;
  }
}

// Get effective preference (project overrides user)
export async function getEffectivePreference(projectPath = process.cwd()) {
  try {
    // Check project preference first
    const projectPref = await getProjectPreference(projectPath);
    if (projectPref) {
      return { preference: projectPref, source: 'project' };
    }
    
    // Fall back to user preference
    const userPref = await getUserPreference();
    if (userPref) {
      return { preference: userPref, source: 'user' };
    }
    
    return { preference: null, source: 'none' };
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Could not get effective preference: ${error.message}`));
    return { preference: null, source: 'error' };
  }
}

// Handle preference conflicts and resolution
export async function resolvePreferenceConflict(userPref, projectPref, detectedPref) {
  console.log(chalk.yellow("⚠️  Multiple package manager preferences detected:"));
  
  if (userPref) {
    console.log(chalk.gray(`   User preference: ${userPref}`));
  }
  
  if (projectPref) {
    console.log(chalk.gray(`   Project preference: ${projectPref}`));
  }
  
  if (detectedPref) {
    console.log(chalk.gray(`   Detected from lock files: ${detectedPref}`));
  }
  
  // Priority: project > detected > user
  if (projectPref) {
    console.log(chalk.blue(`📋 Using project preference: ${projectPref}`));
    return projectPref;
  }
  
  if (detectedPref) {
    console.log(chalk.blue(`📋 Using detected preference: ${detectedPref}`));
    return detectedPref;
  }
  
  if (userPref) {
    console.log(chalk.blue(`📋 Using user preference: ${userPref}`));
    return userPref;
  }
  
  return null;
}

// Migrate old preferences format if needed
export async function migratePreferences() {
  try {
    const preferences = await loadUserPreferences();
    
    // Check if migration is needed (add future migration logic here)
    let needsMigration = false;
    
    // Example: migrate from old format
    if (preferences.packageManager && !preferences.preferredPackageManager) {
      preferences.preferredPackageManager = preferences.packageManager;
      delete preferences.packageManager;
      needsMigration = true;
    }
    
    if (needsMigration) {
      await saveUserPreferences(preferences);
      console.log(chalk.green("✅ Preferences migrated to new format"));
    }
    
    return true;
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Could not migrate preferences: ${error.message}`));
    return false;
  }
}

// Get all preferences for debugging
export async function getAllPreferences(projectPath = process.cwd()) {
  try {
    const userPrefs = await loadUserPreferences();
    const projectPrefs = await loadProjectPreferences(projectPath);
    const effective = await getEffectivePreference(projectPath);
    
    return {
      user: userPrefs,
      project: projectPrefs,
      effective: effective.preference,
      effectiveSource: effective.source
    };
  } catch (error) {
    console.error(chalk.red(`❌ Could not get all preferences: ${error.message}`));
    return null;
  }
}