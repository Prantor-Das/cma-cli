# cma-cli (Create MERN App CLI)

[![npm version](https://img.shields.io/npm/v/cma-cli.svg)](https://www.npmjs.com/package/cma-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command. Stop wasting time on boilerplate and focus on your code.

## Why cma-cli?

`cma-cli` provides a production-ready MERN stack template with a clean and organized structure, essential developer tooling, and a great developer experience out of the box.

## Features

- **Interactive CLI:** An easy-to-use command-line interface to get you started in seconds.
- **Flexible Initialization:** Choose to initialize client-only, server-only, or both parts of your MERN stack.
- **JavaScript & TypeScript:** Choose between a JavaScript or a TypeScript template with full type safety.
- **Modern Stack:** React, Node.js, Express, and MongoDB with the latest best practices.
- **Multiple Package Managers:** Support for bun, pnpm, yarn, and npm with intelligent detection and fallback.
- **Vite Powered:** A fast and modern build tool for the frontend with hot reload.
- **Tailwind CSS v4:** A utility-first CSS framework with built-in dark mode support.
- **Git Integration:** Automatic Git repository initialization with GitHub integration.
- **Concurrent Development:** Optional setup to run both client and server simultaneously.
- **Production Ready:** Security middleware, error handling, and optimization out of the box.

## Installation  

You can install **`cma-cli`** either locally or globally.  

### 1. Local Installation and Usage
Run the following command:  
```bash
npx cma-cli
```

### 2. Global Installation and Usage 
First, install the CLI globally:
```bash
npm install -g cma-cli
```

Once installed, you can create a new MERN stack application anywhere by running:

```bash
cma-cli
```

The CLI will then prompt you with a few questions to configure your project:

1.  **Project Name:** The name of your project (use "./" for current directory).
2.  **Language:** Choose between JavaScript and TypeScript.
3.  **Package Manager:** Select from bun, pnpm, yarn, or npm (automatically detects available options).
4.  **Initialize Parts:** Choose to initialize client-only, server-only, or both parts.
5.  **Concurrently:** Set up scripts to run both client and server simultaneously (when both parts are selected).
6.  **Install Dependencies:** Automatically install all dependencies.
7.  **Initialize Git:** Initialize a new git repository with optional GitHub integration.

After the setup is complete, you can navigate to your new project and start the development server.

## Templates & Initialization Options

`cma-cli` provides flexible templates with multiple initialization options:

### Language Templates
- **JavaScript:** A complete MERN stack template using JavaScript.
- **TypeScript:** A fully type-safe MERN stack template with strict TypeScript configuration.

### Initialization Options
- **Full Stack (Both):** Complete MERN stack with both client and server in separate directories.
- **Client Only:** React frontend with Vite, Tailwind CSS, and routing (no backend).
- **Server Only:** Express backend with MongoDB, security middleware, and API structure (no frontend).

### Package Manager Support
- **bun** ⚡ Fastest - Ultra-fast JavaScript runtime and package manager
- **pnpm** 🚀 Very Fast - Efficient disk space usage with symlinks
- **yarn** ⚡ Fast - Reliable dependency management with offline support
- **npm** 📦 Standard - The default Node.js package manager

All templates include production-ready configurations, testing setup, and development tools optimized for your chosen package manager.

## Contributing

We welcome contributions to `cma-cli`! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

### Development Setup

To set up your development environment, follow these steps:

1.  **Clone the repository:** `git clone https://github.com/prasoonk1204/cma-cli.git`
2.  **Install dependencies:** `npm install` in the root directory.
3.  **Link the CLI:** `npm link` to use your local `cma-cli` version globally.

### Making Changes

Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on reporting bugs, suggesting enhancements, and submitting code contributions.

### Project Structure

The project is structured as follows:

-   `bin/`: Contains the CLI's executable files and logic.
-   `templates/`: Holds the JavaScript (`js/`) and TypeScript (`ts/`) project templates.
    -   Each template has a `client/` (React frontend) and `server/` (Node.js/Express backend) directory.

### Release Process

The release process involves:

1.  Ensuring all changes are merged into the `master` branch.
2.  Updating the version number in `package.json`.
3.  Creating a new Git tag for the release.
4.  Publishing the package to npm.

For more details, please refer to the project maintainers.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Authors

-   **Prasoon Kumar**
    -   Github: [@prasoonk1204](https://github.com/prasoonk1204)
    -   Twitter: [@kenma_dev](https://x.com/kenma_dev)
-   **Prantor Das**
    -   GitHub: [@Prantor-Das](https://github.com/Prantor-Das)
    -   Twitter: [@akashi_sde](https://x.com/akashi_sde)