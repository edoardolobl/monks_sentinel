#!/bin/bash

# Protocol Buffer Compiler Installation Script
# Version: 1.0.0
# 
# This script installs the latest stable version of protoc and required language plugins
# for the Monks Sentinel GTM Quality Assurance System.
#
# Supported platforms: macOS (Intel/Apple Silicon), Linux (x86_64)
# Supported languages: Python, TypeScript, Go, Rust

set -euo pipefail

# Configuration
PROTOBUF_VERSION="25.1"  # Latest stable version as of 2025
INSTALL_DIR="${HOME}/.local/bin"
TEMP_DIR=$(mktemp -d)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error handler
cleanup() {
    if [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
}

trap cleanup EXIT

# Platform detection
detect_platform() {
    local os
    local arch
    
    os=$(uname -s)
    arch=$(uname -m)
    
    case "$os" in
        Darwin)
            if [[ "$arch" == "arm64" ]]; then
                echo "osx-aarch_64"
            else
                echo "osx-x86_64"
            fi
            ;;
        Linux)
            case "$arch" in
                x86_64)
                    echo "linux-x86_64"
                    ;;
                aarch64)
                    echo "linux-aarch_64"
                    ;;
                *)
                    log_error "Unsupported architecture: $arch"
                    exit 1
                    ;;
            esac
            ;;
        *)
            log_error "Unsupported operating system: $os"
            exit 1
            ;;
    esac
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Version check
version_ge() {
    printf '%s\n' "$2" "$1" | sort -V -C
}

# Check existing protoc installation
check_protoc() {
    if command_exists protoc; then
        local current_version
        current_version=$(protoc --version | awk '{print $2}')
        log_info "Found existing protoc version: $current_version"
        
        if version_ge "$current_version" "$PROTOBUF_VERSION"; then
            log_success "protoc is already up to date (>= $PROTOBUF_VERSION)"
            return 0
        else
            log_warning "protoc version $current_version is outdated, upgrading to $PROTOBUF_VERSION"
        fi
    else
        log_info "protoc not found, installing version $PROTOBUF_VERSION"
    fi
    
    return 1
}

# Install protoc
install_protoc() {
    local platform
    platform=$(detect_platform)
    
    log_info "Installing protoc $PROTOBUF_VERSION for $platform"
    
    local download_url="https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOBUF_VERSION/protoc-$PROTOBUF_VERSION-$platform.zip"
    local zip_file="$TEMP_DIR/protoc.zip"
    
    # Download protoc
    log_info "Downloading protoc from: $download_url"
    if command_exists curl; then
        curl -L -o "$zip_file" "$download_url"
    elif command_exists wget; then
        wget -O "$zip_file" "$download_url"
    else
        log_error "Neither curl nor wget found. Cannot download protoc."
        exit 1
    fi
    
    # Extract protoc
    log_info "Extracting protoc to $INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
    
    if command_exists unzip; then
        unzip -q "$zip_file" -d "$TEMP_DIR/protoc"
    else
        log_error "unzip command not found. Cannot extract protoc."
        exit 1
    fi
    
    # Copy binary
    cp "$TEMP_DIR/protoc/bin/protoc" "$INSTALL_DIR/"
    chmod +x "$INSTALL_DIR/protoc"
    
    # Copy includes
    if [[ -d "$TEMP_DIR/protoc/include" ]]; then
        mkdir -p "$HOME/.local/include"
        cp -r "$TEMP_DIR/protoc/include/"* "$HOME/.local/include/"
    fi
    
    log_success "protoc installed successfully"
}

# Install Python protobuf tools
install_python_tools() {
    log_info "Installing Python protobuf tools"
    
    # Check if pip is available
    if ! command_exists pip && ! command_exists pip3; then
        log_warning "pip not found, skipping Python protobuf tools installation"
        return 0
    fi
    
    local pip_cmd="pip"
    if command_exists pip3; then
        pip_cmd="pip3"
    fi
    
    # Install grpcio-tools (includes protoc plugin for Python)
    log_info "Installing grpcio-tools and protobuf"
    $pip_cmd install --user --upgrade grpcio-tools protobuf
    
    log_success "Python protobuf tools installed"
}

# Install Node.js protobuf tools
install_nodejs_tools() {
    log_info "Installing Node.js protobuf tools"
    
    if ! command_exists npm; then
        log_warning "npm not found, skipping Node.js protobuf tools installation"
        return 0
    fi
    
    # Check if we're in a project with package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        log_info "Installing TypeScript protobuf tools as dev dependencies"
        cd "$PROJECT_ROOT"
        npm install --save-dev ts-proto @types/google-protobuf google-protobuf
    else
        # Install globally
        log_info "Installing TypeScript protobuf tools globally"
        npm install -g ts-proto @types/google-protobuf google-protobuf
    fi
    
    log_success "Node.js protobuf tools installed"
}

# Install Go protobuf tools
install_go_tools() {
    log_info "Installing Go protobuf tools"
    
    if ! command_exists go; then
        log_warning "go not found, skipping Go protobuf tools installation"
        return 0
    fi
    
    # Install protoc-gen-go and protoc-gen-go-grpc
    log_info "Installing protoc-gen-go and protoc-gen-go-grpc"
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    
    log_success "Go protobuf tools installed"
}

# Install Rust protobuf tools
install_rust_tools() {
    log_info "Installing Rust protobuf tools"
    
    if ! command_exists cargo; then
        log_warning "cargo not found, skipping Rust protobuf tools installation"
        return 0
    fi
    
    # Install protoc-gen-rust
    log_info "Installing protobuf-codegen"
    cargo install protobuf-codegen
    
    log_success "Rust protobuf tools installed"
}

# Update PATH if needed
update_path() {
    local shell_rc
    
    # Detect shell
    case "$SHELL" in
        */bash)
            shell_rc="$HOME/.bashrc"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                shell_rc="$HOME/.bash_profile"
            fi
            ;;
        */zsh)
            shell_rc="$HOME/.zshrc"
            ;;
        */fish)
            shell_rc="$HOME/.config/fish/config.fish"
            ;;
        *)
            log_warning "Unknown shell: $SHELL. You may need to manually add $INSTALL_DIR to your PATH."
            return 0
            ;;
    esac
    
    # Check if INSTALL_DIR is already in PATH
    if [[ ":$PATH:" == *":$INSTALL_DIR:"* ]]; then
        log_info "PATH already contains $INSTALL_DIR"
        return 0
    fi
    
    # Add to shell RC file
    if [[ -f "$shell_rc" ]]; then
        if ! grep -q "$INSTALL_DIR" "$shell_rc"; then
            echo "" >> "$shell_rc"
            echo "# Added by protoc installation script" >> "$shell_rc"
            echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$shell_rc"
            log_success "Added $INSTALL_DIR to PATH in $shell_rc"
            log_info "Please restart your shell or run: source $shell_rc"
        fi
    else
        log_warning "Shell RC file not found: $shell_rc"
        log_info "Please add $INSTALL_DIR to your PATH manually"
    fi
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    # Add install dir to PATH for verification
    export PATH="$INSTALL_DIR:$PATH"
    
    if ! command_exists protoc; then
        log_error "protoc not found in PATH after installation"
        return 1
    fi
    
    local installed_version
    installed_version=$(protoc --version | awk '{print $2}')
    
    if [[ "$installed_version" == "$PROTOBUF_VERSION" ]]; then
        log_success "protoc $installed_version verified successfully"
    else
        log_warning "protoc version mismatch: expected $PROTOBUF_VERSION, got $installed_version"
    fi
    
    # Test basic compilation
    log_info "Testing basic proto compilation..."
    
    # Create a test proto file
    local test_proto="$TEMP_DIR/test.proto"
    cat > "$test_proto" << 'EOF'
syntax = "proto3";
package test;
message TestMessage {
  string name = 1;
}
EOF
    
    # Test Python compilation
    if command_exists python-grpc-tools || python -c "import grpc_tools.protoc" 2>/dev/null; then
        if protoc --python_out="$TEMP_DIR" --proto_path="$TEMP_DIR" "$test_proto"; then
            log_success "Python protobuf compilation test passed"
        else
            log_warning "Python protobuf compilation test failed"
        fi
    fi
    
    log_success "Installation verification completed"
}

# Main installation function
main() {
    log_info "Starting Protocol Buffer Compiler installation"
    log_info "Target protoc version: $PROTOBUF_VERSION"
    log_info "Install directory: $INSTALL_DIR"
    
    # Create install directory
    mkdir -p "$INSTALL_DIR"
    
    # Install protoc if needed
    if ! check_protoc; then
        install_protoc
    fi
    
    # Install language-specific tools
    install_python_tools
    install_nodejs_tools
    install_go_tools
    install_rust_tools
    
    # Update PATH
    update_path
    
    # Verify installation
    verify_installation
    
    log_success "Protocol Buffer Compiler installation completed!"
    log_info "You can now run './scripts/generate_protobuf.sh' to compile proto files"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi