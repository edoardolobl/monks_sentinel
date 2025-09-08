#!/bin/bash

# GTM Module Template Generator
# Creates new analysis modules from templates with placeholder substitution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
LANGUAGE=""
MODULE_NAME=""
ANALYZER_CLASS=""
SERVICE_NAME=""
PORT=""
DESTINATION=""

# Usage function
usage() {
    echo -e "${BLUE}GTM Module Template Generator${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -l, --language LANG     Template language (python|typescript|golang)"
    echo "  -n, --name NAME         Module name (e.g., 'javascript', 'security')"
    echo "  -p, --port PORT         gRPC server port (e.g., 50053)"
    echo "  -d, --destination DIR   Destination directory (default: ../modules/{name})"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -l python -n javascript -p 50053"
    echo "  $0 -l typescript -n security -p 50054 -d ../modules/security"
    echo "  $0 -l golang -n performance -p 50055"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -l|--language)
            LANGUAGE="$2"
            shift 2
            ;;
        -n|--name)
            MODULE_NAME="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -d|--destination)
            DESTINATION="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$LANGUAGE" ]]; then
    echo -e "${RED}Error: Language is required (-l|--language)${NC}"
    usage
    exit 1
fi

if [[ -z "$MODULE_NAME" ]]; then
    echo -e "${RED}Error: Module name is required (-n|--name)${NC}"
    usage
    exit 1
fi

if [[ -z "$PORT" ]]; then
    echo -e "${RED}Error: Port is required (-p|--port)${NC}"
    usage
    exit 1
fi

# Validate language
if [[ ! "$LANGUAGE" =~ ^(python|typescript|golang)$ ]]; then
    echo -e "${RED}Error: Language must be one of: python, typescript, golang${NC}"
    exit 1
fi

# Validate port number
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
    echo -e "${RED}Error: Port must be a number between 1024 and 65535${NC}"
    exit 1
fi

# Set default destination
if [[ -z "$DESTINATION" ]]; then
    DESTINATION="../modules/${MODULE_NAME}"
fi

# Generate derived names
ANALYZER_CLASS="${MODULE_NAME^}Analyzer"  # Capitalize first letter
SERVICE_NAME="${MODULE_NAME^}AnalysisService"
REQUEST_TYPE="${MODULE_NAME^}AnalysisRequest"

# Check if template exists
TEMPLATE_DIR="${LANGUAGE}"
if [[ ! -d "$TEMPLATE_DIR" ]]; then
    echo -e "${RED}Error: Template directory '$TEMPLATE_DIR' not found${NC}"
    exit 1
fi

# Check if destination already exists
if [[ -d "$DESTINATION" ]]; then
    echo -e "${YELLOW}Warning: Destination directory '$DESTINATION' already exists${NC}"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
    rm -rf "$DESTINATION"
fi

# Display summary
echo -e "${BLUE}Creating GTM Analysis Module${NC}"
echo "  Language:     $LANGUAGE"
echo "  Module name:  $MODULE_NAME"
echo "  Analyzer:     $ANALYZER_CLASS"  
echo "  Service:      $SERVICE_NAME"
echo "  Request type: $REQUEST_TYPE"
echo "  Port:         $PORT"
echo "  Destination:  $DESTINATION"
echo ""

# Create destination directory
mkdir -p "$DESTINATION"

# Copy template files
echo -e "${GREEN}Copying template files...${NC}"
cp -r "$TEMPLATE_DIR"/* "$DESTINATION/"

# Function to replace placeholders in a file
replace_placeholders() {
    local file="$1"
    
    # Skip binary files
    if [[ $(file -b --mime-encoding "$file") == "binary" ]]; then
        return
    fi
    
    # Replace placeholders
    sed -i.bak \
        -e "s/{MODULE_NAME}/$MODULE_NAME/g" \
        -e "s/{ANALYZER_CLASS}/$ANALYZER_CLASS/g" \
        -e "s/{SERVICE_NAME}/$SERVICE_NAME/g" \
        -e "s/{REQUEST_TYPE}/$REQUEST_TYPE/g" \
        -e "s/{PORT}/$PORT/g" \
        "$file"
    
    # Remove backup file
    rm "${file}.bak"
}

# Replace placeholders in all files
echo -e "${GREEN}Replacing placeholders...${NC}"
find "$DESTINATION" -type f -exec bash -c 'replace_placeholders "$0"' {} \;

# Rename template files with placeholders
echo -e "${GREEN}Renaming template files...${NC}"
find "$DESTINATION" -name "*{MODULE_NAME}*" | while read -r file; do
    dir=$(dirname "$file")
    base=$(basename "$file")
    new_name=$(echo "$base" | sed "s/{MODULE_NAME}/$MODULE_NAME/g")
    if [[ "$file" != "$dir/$new_name" ]]; then
        mv "$file" "$dir/$new_name"
    fi
done

# Set executable permissions on scripts
find "$DESTINATION" -name "*.sh" -exec chmod +x {} \;

# Language-specific post-processing
case $LANGUAGE in
    python)
        echo -e "${GREEN}Python module created successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. cd $DESTINATION"
        echo "  2. python -m venv venv && source venv/bin/activate"
        echo "  3. pip install -r requirements.txt"
        echo "  4. python main.py"
        ;;
    typescript)
        echo -e "${GREEN}TypeScript module created successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. cd $DESTINATION"
        echo "  2. npm install"
        echo "  3. npm run build"
        echo "  4. npm start"
        ;;
    golang)
        echo -e "${GREEN}Go module created successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. cd $DESTINATION"
        echo "  2. go mod download"
        echo "  3. go build -o main ./cmd"
        echo "  4. ./main"
        ;;
esac

echo ""
echo -e "${BLUE}Template generated successfully!${NC}"
echo "Location: $DESTINATION"
echo ""
echo "Don't forget to:"
echo "  • Implement your analysis logic in the analyzer file"
echo "  • Update proto definitions if needed"
echo "  • Add your module to docker-compose.yml"
echo "  • Test with: grpcurl -plaintext localhost:$PORT health.v1.Health/Check"