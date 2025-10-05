#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Starting cleanup process...${NC}\n"

# Find and count targets
echo -e "${CYAN}Scanning for node_modules directories and lock files...${NC}"

# Find node_modules directories
NODE_MODULES_DIRS=$(find . -name "node_modules" -type d 2>/dev/null)
NODE_MODULES_COUNT=$(echo "$NODE_MODULES_DIRS" | grep -c . 2>/dev/null || echo "0")

# Find lock files
LOCK_FILES=$(find . -name "package-lock.json" -o -name "pnpm-lock.yaml" -o -name "yarn.lock" -o -name "bun.lockb" 2>/dev/null)
LOCK_FILES_COUNT=$(echo "$LOCK_FILES" | grep -c . 2>/dev/null || echo "0")

TOTAL_COUNT=$((NODE_MODULES_COUNT + LOCK_FILES_COUNT))

if [ "$TOTAL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✨ No node_modules directories or lock files found. Already clean!${NC}"
    exit 0
fi

echo -e "${CYAN}\nFound:${NC}"
echo -e "${CYAN}  • $NODE_MODULES_COUNT node_modules directories${NC}"
echo -e "${CYAN}  • $LOCK_FILES_COUNT lock files${NC}\n"

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

# Summary
if [ "$REMOVED_COUNT" -eq "$TOTAL_COUNT" ]; then
    echo -e "${GREEN}✨ Cleanup complete! Removed $REMOVED_COUNT/$TOTAL_COUNT items.${NC}"
else
    echo -e "${YELLOW}⚠️  Cleanup finished with warnings. Removed $REMOVED_COUNT/$TOTAL_COUNT items.${NC}"
fi