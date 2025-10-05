#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Starting comprehensive cleanup process...${NC}\n"

# Find and count targets
echo -e "${CYAN}Scanning for dependencies, lock files, cache directories, and logs...${NC}"

# Find node_modules directories
NODE_MODULES_DIRS=$(find . -name "node_modules" -type d 2>/dev/null)
if [ -z "$NODE_MODULES_DIRS" ]; then
    NODE_MODULES_COUNT=0
else
    NODE_MODULES_COUNT=$(echo "$NODE_MODULES_DIRS" | wc -l)
fi

# Find all types of lock files
LOCK_FILES=$(find . \( \
    -name "package-lock.json" -o \
    -name "npm-shrinkwrap.json" -o \
    -name "yarn.lock" -o \
    -name ".yarnrc" -o \
    -name ".yarnrc.yml" -o \
    -name "pnpm-lock.yaml" -o \
    -name "pnpm-workspace.yaml" -o \
    -name ".pnpmfile.cjs" -o \
    -name "bun.lockb" -o \
    -name "shrinkwrap.yaml" -o \
    -name "package-lock.yaml" -o \
    -name "rush.json" -o \
    -name "common-versions.json" \
\) -type f 2>/dev/null)
if [ -z "$LOCK_FILES" ]; then
    LOCK_FILES_COUNT=0
else
    LOCK_FILES_COUNT=$(echo "$LOCK_FILES" | wc -l)
fi

# Find cache directories
CACHE_DIRS=$(find . \( \
    -name ".npm" -o \
    -name ".yarn" -o \
    -name ".pnpm-store" -o \
    -name ".pnpm" -o \
    -name ".cache" -o \
    -name ".next" -o \
    -name ".nuxt" -o \
    -name "dist" -o \
    -name "build" -o \
    -name ".turbo" -o \
    -name ".rush" \
\) -type d 2>/dev/null | grep -v node_modules)
if [ -z "$CACHE_DIRS" ]; then
    CACHE_DIRS_COUNT=0
else
    CACHE_DIRS_COUNT=$(echo "$CACHE_DIRS" | wc -l)
fi

# Find log files
LOG_FILES=$(find . \( \
    -name "npm-debug.log*" -o \
    -name "yarn-debug.log*" -o \
    -name "yarn-error.log*" -o \
    -name "pnpm-debug.log*" -o \
    -name "lerna-debug.log*" -o \
    -name ".pnpm-debug.log*" \
\) -type f 2>/dev/null)
if [ -z "$LOG_FILES" ]; then
    LOG_FILES_COUNT=0
else
    LOG_FILES_COUNT=$(echo "$LOG_FILES" | wc -l)
fi

TOTAL_COUNT=$((NODE_MODULES_COUNT + LOCK_FILES_COUNT + CACHE_DIRS_COUNT + LOG_FILES_COUNT))

if [ "$TOTAL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✨ No cleanup targets found. Already clean!${NC}"
    exit 0
fi

echo -e "${CYAN}\nFound:${NC}"
echo -e "${CYAN}  • $NODE_MODULES_COUNT node_modules directories${NC}"
echo -e "${CYAN}  • $LOCK_FILES_COUNT lock files${NC}"
echo -e "${CYAN}  • $CACHE_DIRS_COUNT cache directories${NC}"
echo -e "${CYAN}  • $LOG_FILES_COUNT log files${NC}\n"

REMOVED_COUNT=0

# Remove node_modules directories
if [ "$NODE_MODULES_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Removing node_modules directories...${NC}"
    while IFS= read -r dir; do
        if [ -n "$dir" ]; then
            if rm -rf "$dir" 2>/dev/null; then
                echo -e "${GREEN}✓ Removed node_modules: ${dir#./}${NC}"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                echo -e "${RED}✗ Failed to remove node_modules: ${dir#./}${NC}"
            fi
        fi
    done <<< "$NODE_MODULES_DIRS"
    echo ""
fi

# Remove lock files
if [ "$LOCK_FILES_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Removing lock files...${NC}"
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            if rm -f "$file" 2>/dev/null; then
                echo -e "${GREEN}✓ Removed lock file: ${file#./}${NC}"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                echo -e "${RED}✗ Failed to remove lock file: ${file#./}${NC}"
            fi
        fi
    done <<< "$LOCK_FILES"
    echo ""
fi

# Remove cache directories
if [ "$CACHE_DIRS_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Removing cache directories...${NC}"
    while IFS= read -r dir; do
        if [ -n "$dir" ]; then
            if rm -rf "$dir" 2>/dev/null; then
                echo -e "${GREEN}✓ Removed cache directory: ${dir#./}${NC}"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                echo -e "${RED}✗ Failed to remove cache directory: ${dir#./}${NC}"
            fi
        fi
    done <<< "$CACHE_DIRS"
    echo ""
fi

# Remove log files
if [ "$LOG_FILES_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Removing log files...${NC}"
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            if rm -f "$file" 2>/dev/null; then
                echo -e "${GREEN}✓ Removed log file: ${file#./}${NC}"
                REMOVED_COUNT=$((REMOVED_COUNT + 1))
            else
                echo -e "${RED}✗ Failed to remove log file: ${file#./}${NC}"
            fi
        fi
    done <<< "$LOG_FILES"
    echo ""
fi

# Summary
if [ "$REMOVED_COUNT" -eq "$TOTAL_COUNT" ]; then
    echo -e "${GREEN}✨ Cleanup complete! Removed $REMOVED_COUNT/$TOTAL_COUNT items.${NC}"
else
    echo -e "${YELLOW}⚠️  Cleanup finished with warnings. Removed $REMOVED_COUNT/$TOTAL_COUNT items.${NC}"
fi