#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default options
FORCED_PM=""
SCOPE="all"

# All directories
declare -a ALL_DIRECTORIES=("." "templates/js" "templates/ts")
declare -a ALL_DIR_NAMES=("Root" "JavaScript Template" "TypeScript Template")

# Root only
declare -a ROOT_DIRECTORIES=(".")
declare -a ROOT_DIR_NAMES=("Root")

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --pm|--package-manager)
                FORCED_PM="$2"
                shift 2
                ;;
            --root-only|--root)
                SCOPE="root"
                shift
                ;;
            --all)
                SCOPE="all"
                shift
                ;;
            npm|yarn|pnpm|bun)
                FORCED_PM="$1"
                shift
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# Show help message
show_help() {
    echo -e "${BLUE}📦 Package Installation Script${NC}\n"
    echo "Usage: ./scripts/install-all.sh [options]"
    echo ""
    echo "Options:"
    echo "  --pm, --package-manager <pm>  Force specific package manager (npm, yarn, pnpm, bun)"
    echo "  --root-only, --root           Install only in root directory"
    echo "  --all                         Install in all directories (default)"
    echo "  -h, --help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/install-all.sh                    # Install in all directories (auto-detect PM)"
    echo "  ./scripts/install-all.sh --root             # Install only in root"
    echo "  ./scripts/install-all.sh --pm bun           # Use bun for all installations"
    echo "  ./scripts/install-all.sh bun --root         # Use bun for root only"
}

# Function to detect package manager
detect_package_manager() {
    local dir="$1"
    
    # Use forced package manager if specified
    if [ -n "$FORCED_PM" ]; then
        echo "$FORCED_PM"
        return
    fi
    
    if [ -f "$dir/pnpm-lock.yaml" ]; then
        echo "pnpm"
    elif [ -f "$dir/yarn.lock" ]; then
        echo "yarn"
    elif [ -f "$dir/bun.lockb" ]; then
        echo "bun"
    else
        echo "npm"
    fi
}

# Function to install packages in a directory
install_in_directory() {
    local dir_path="$1"
    local dir_name="$2"
    
    # Check if package.json exists
    if [ ! -f "$dir_path/package.json" ]; then
        echo -e "${YELLOW}⚠️  Skipping $dir_name: No package.json found${NC}"
        SKIPPED=$((SKIPPED + 1))
        return 0
    fi
    
    # Detect package manager
    local package_manager=$(detect_package_manager "$dir_path")
    echo -e "${CYAN}📦 Installing packages in $dir_name using $package_manager...${NC}"
    
    # Record start time
    local start_time=$(date +%s.%N)
    
    # Run installation
    if (cd "$dir_path" && $package_manager install > /dev/null 2>&1); then
        local end_time=$(date +%s.%N)
        local duration=$(echo "$end_time - $start_time" | bc -l)
        local duration_formatted=$(printf "%.1f" "$duration")
        
        echo -e "${GREEN}✓ $dir_name installation completed in ${duration_formatted}s${NC}"
        SUCCESSFUL=$((SUCCESSFUL + 1))
        TOTAL_TIME=$(echo "$TOTAL_TIME + $duration" | bc -l)
    else
        echo -e "${RED}✗ Failed to install packages in $dir_name${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Parse arguments
parse_args "$@"

# Validate package manager if specified
if [ -n "$FORCED_PM" ] && [[ ! "$FORCED_PM" =~ ^(npm|yarn|pnpm|bun)$ ]]; then
    echo -e "${RED}❌ Invalid package manager: $FORCED_PM${NC}"
    echo -e "${YELLOW}Valid options: npm, yarn, pnpm, bun${NC}"
    exit 1
fi

# Set directories based on scope
if [ "$SCOPE" = "root" ]; then
    DIRECTORIES=("${ROOT_DIRECTORIES[@]}")
    DIR_NAMES=("${ROOT_DIR_NAMES[@]}")
    SCOPE_TEXT="root directory"
else
    DIRECTORIES=("${ALL_DIRECTORIES[@]}")
    DIR_NAMES=("${ALL_DIR_NAMES[@]}")
    SCOPE_TEXT="all directories"
fi

# Counters
SUCCESSFUL=0
SKIPPED=0
FAILED=0
TOTAL_TIME=0

# Display start message
PM_TEXT=""
if [ -n "$FORCED_PM" ]; then
    PM_TEXT=" using $FORCED_PM"
fi

echo -e "${BLUE}📦 Starting package installation for $SCOPE_TEXT$PM_TEXT...${NC}\n"

# Install packages in each directory
for i in "${!DIRECTORIES[@]}"; do
    install_in_directory "${DIRECTORIES[$i]}" "${DIR_NAMES[$i]}"
    echo ""
done

# Summary
echo -e "${BLUE}📊 Installation Summary:${NC}"
echo -e "${GREEN}  ✓ Successful: $SUCCESSFUL${NC}"

if [ "$SKIPPED" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Skipped: $SKIPPED${NC}"
fi

if [ "$FAILED" -gt 0 ]; then
    echo -e "${RED}  ✗ Failed: $FAILED${NC}"
fi

if (( $(echo "$TOTAL_TIME > 0" | bc -l) )); then
    total_formatted=$(printf "%.1f" "$TOTAL_TIME")
    echo -e "${CYAN}  ⏱️  Total time: ${total_formatted}s${NC}"
fi

echo ""

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 All package installations completed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some installations failed. Check the output above.${NC}"
    exit 1
fi