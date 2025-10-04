import chalk from "chalk";
import {
    PACKAGE_MANAGERS,
    isPackageManagerInstalled,
    performPackageManagerHealthCheck,
} from "./packageManager.js";

// Fallback attempt logging
const fallbackLog = [];

// Get package managers in fallback priority order (excluding failed ones)
export function getFallbackOrder(excludeManagers = []) {
    const allManagers = Object.entries(PACKAGE_MANAGERS)
        .sort(([, a], [, b]) => a.priority - b.priority) // Sort by priority (lower number = higher priority)
        .map(([name]) => name)
        .filter((name) => !excludeManagers.includes(name));

    return allManagers;
}

// Log fallback attempt for debugging and user feedback
export function logFallbackAttempt(from, to, reason) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        from,
        to,
        reason,
        success: null, // Will be updated when attempt completes
    };

    fallbackLog.push(logEntry);

    console.log(chalk.yellow(`⚠️  Falling back from ${from} to ${to}`));
    console.log(chalk.gray(`   Reason: ${reason}`));

    return logEntry;
}

// Update fallback log entry with result
export function updateFallbackResult(logEntry, success, error = null) {
    if (logEntry) {
        logEntry.success = success;
        logEntry.error = error;
        logEntry.completedAt = new Date().toISOString();
    }
}

// Attempt fallback to next available package manager
export async function attemptFallback(
    failedManager,
    error,
    excludeManagers = [],
) {
    const excludeList = [...excludeManagers, failedManager];
    const fallbackOrder = getFallbackOrder(excludeList);

    console.log(chalk.yellow(`🔄 ${failedManager} failed: ${error.message}`));

    if (fallbackOrder.length === 0) {
        console.log(chalk.red("❌ No fallback package managers available"));
        throw new Error("All package managers have failed or are unavailable");
    }

    console.log(
        chalk.blue(`🔍 Checking ${fallbackOrder.length} fallback option(s)...`),
    );

    for (const fallbackManager of fallbackOrder) {
        const logEntry = logFallbackAttempt(
            failedManager,
            fallbackManager,
            error.message,
        );

        try {
            // Check if fallback manager is installed
            const isInstalled = await isPackageManagerInstalled(
                fallbackManager,
            );

            if (!isInstalled) {
                console.log(
                    chalk.gray(
                        `   ${fallbackManager} is not installed, skipping...`,
                    ),
                );
                updateFallbackResult(logEntry, false, "Not installed");
                continue;
            }

            // Perform health check
            const healthCheck = await performPackageManagerHealthCheck(
                fallbackManager,
            );

            if (!healthCheck.healthy) {
                console.log(
                    chalk.gray(
                        `   ${fallbackManager} failed health check: ${healthCheck.error}`,
                    ),
                );
                updateFallbackResult(logEntry, false, healthCheck.error);
                continue;
            }

            // Fallback manager is available and healthy
            console.log(
                chalk.green(`✅ Successfully fell back to ${fallbackManager}`),
            );
            updateFallbackResult(logEntry, true);

            return {
                manager: PACKAGE_MANAGERS[fallbackManager],
                fallbackUsed: true,
                originalManager: failedManager,
                fallbackReason: error.message,
            };
        } catch (fallbackError) {
            console.log(
                chalk.gray(
                    `   ${fallbackManager} failed: ${fallbackError.message}`,
                ),
            );
            updateFallbackResult(logEntry, false, fallbackError.message);
            continue;
        }
    }

    // All fallback attempts failed
    console.log(chalk.red("❌ All fallback attempts failed"));
    throw new Error(
        `All package managers failed. Original error: ${error.message}`,
    );
}

// Get fallback statistics for reporting
export function getFallbackStats() {
    const stats = {
        totalAttempts: fallbackLog.length,
        successfulFallbacks: fallbackLog.filter(
            (entry) => entry.success === true,
        ).length,
        failedFallbacks: fallbackLog.filter((entry) => entry.success === false)
            .length,
        pendingFallbacks: fallbackLog.filter((entry) => entry.success === null)
            .length,
        mostCommonFailures: {},
        mostCommonFallbacks: {},
        recentAttempts: fallbackLog.slice(-5), // Last 5 attempts
    };

    // Count failure reasons
    fallbackLog.forEach((entry) => {
        if (entry.reason) {
            stats.mostCommonFailures[entry.reason] =
                (stats.mostCommonFailures[entry.reason] || 0) + 1;
        }

        if (entry.to) {
            stats.mostCommonFallbacks[entry.to] =
                (stats.mostCommonFallbacks[entry.to] || 0) + 1;
        }
    });

    return stats;
}

// Clear fallback log (useful for testing or cleanup)
export function clearFallbackLog() {
    fallbackLog.length = 0;
    console.log(chalk.blue("ℹ️  Fallback log cleared"));
}

// Display fallback summary for user
export function displayFallbackSummary() {
    const stats = getFallbackStats();

    if (stats.totalAttempts === 0) {
        return;
    }

    console.log(chalk.cyan("\n📊 Fallback Summary:"));
    console.log(
        chalk.gray(`   Total fallback attempts: ${stats.totalAttempts}`),
    );
    console.log(chalk.gray(`   Successful: ${stats.successfulFallbacks}`));
    console.log(chalk.gray(`   Failed: ${stats.failedFallbacks}`));

    if (stats.successfulFallbacks > 0) {
        console.log(
            chalk.green(
                `   ✅ Fallback system helped avoid ${stats.successfulFallbacks} failure(s)`,
            ),
        );
    }

    // Show most common fallback targets
    const fallbackEntries = Object.entries(stats.mostCommonFallbacks);
    if (fallbackEntries.length > 0) {
        const mostUsed = fallbackEntries.sort(([, a], [, b]) => b - a)[0];
        console.log(
            chalk.gray(
                `   Most used fallback: ${mostUsed[0]} (${mostUsed[1]} times)`,
            ),
        );
    }
}

// Intelligent fallback selection based on context
export async function selectIntelligentFallback(failedManager, context = {}) {
    const {
        hasLockFile = false,
        isCI = false,
        projectSize = "medium",
        networkCondition = "fast",
        preferredFeatures = [],
    } = context;

    const fallbackOrder = getFallbackOrder([failedManager]);
    const scoredFallbacks = [];

    for (const managerName of fallbackOrder) {
        const manager = PACKAGE_MANAGERS[managerName];
        let score = manager.priority; // Base score from priority (lower is better)

        // Adjust score based on context
        if (isCI && manager.optimizations.contextFlags.ci.length > 0) {
            score -= 1; // Prefer managers with good CI support
        }

        if (hasLockFile && manager.ciCmd !== manager.installCmd) {
            score -= 1; // Prefer managers with dedicated CI commands
        }

        if (projectSize === "large" && manager.optimizations.parallel) {
            score -= 2; // Strongly prefer parallel-capable managers for large projects
        }

        if (networkCondition === "slow" && manager.optimizations.offline) {
            score -= 1; // Prefer managers with offline capabilities
        }

        // Check for preferred features
        if (preferredFeatures.includes("speed") && manager.priority <= 2) {
            score -= 1; // Prefer fast managers (bun, pnpm)
        }

        if (preferredFeatures.includes("stability") && manager.name === "npm") {
            score -= 1; // npm is most stable/compatible
        }

        scoredFallbacks.push({ manager: managerName, score });
    }

    // Sort by score (lower is better) and return the best option
    scoredFallbacks.sort((a, b) => a.score - b.score);

    if (scoredFallbacks.length > 0) {
        const bestFallback = scoredFallbacks[0].manager;
        console.log(
            chalk.blue(
                `🎯 Intelligent fallback selected: ${bestFallback} (score: ${scoredFallbacks[0].score})`,
            ),
        );
        return bestFallback;
    }

    return null;
}

// Handle graceful degradation when optimizations fail
export async function handleOptimizationFallback(
    manager,
    originalFlags,
    error,
) {
    console.log(
        chalk.yellow(`⚠️  Optimized installation failed for ${manager.name}`),
    );
    console.log(chalk.gray(`   Original flags: ${originalFlags.join(" ")}`));
    console.log(chalk.gray(`   Error: ${error.message}`));

    // Try with reduced optimization flags
    const fallbackStrategies = [
        {
            name: "Remove silent flags",
            filter: (flag) =>
                !flag.includes("silent") && !flag.includes("quiet"),
        },
        {
            name: "Remove offline flags",
            filter: (flag) =>
                !flag.includes("offline") && !flag.includes("prefer-offline"),
        },
        {
            name: "Remove parallel flags",
            filter: (flag) =>
                !flag.includes("parallel") && !flag.includes("concurrent"),
        },
        {
            name: "Use basic flags only",
            filter: () => false, // Remove all optimization flags
        },
    ];

    for (const strategy of fallbackStrategies) {
        const reducedFlags = originalFlags.filter(strategy.filter);

        console.log(
            chalk.blue(`🔄 Trying fallback strategy: ${strategy.name}`),
        );
        console.log(
            chalk.gray(
                `   Reduced flags: ${reducedFlags.join(" ") || "(none)"}`,
            ),
        );

        try {
            return {
                flags: reducedFlags,
                strategy: strategy.name,
                fallbackUsed: true,
            };
        } catch (strategyError) {
            console.log(
                chalk.gray(`   Strategy failed: ${strategyError.message}`),
            );
            continue;
        }
    }

    throw new Error(
        `All optimization fallback strategies failed for ${manager.name}`,
    );
}

// Export fallback log for external analysis
export function exportFallbackLog() {
    return {
        log: [...fallbackLog],
        stats: getFallbackStats(),
        exportedAt: new Date().toISOString(),
    };
}
