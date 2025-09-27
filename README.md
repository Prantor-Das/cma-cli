# cma-cli (Create MERN App CLI)

[![npm version](https://img.shields.io/npm/v/cma-cli.svg)](https://www.npmjs.com/package/cma-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command. Stop wasting time on boilerplate and focus on your code.

## Why cma-cli?

`cma-cli` provides a production-ready MERN stack template with a clean and organized structure, essential developer tooling, and a great developer experience out of the box.

## Features

- **Interactive CLI:** An easy-to-use command-line interface to get you started in seconds.
- **JavaScript & TypeScript:** Choose between a JavaScript or a TypeScript template.
- **Modern Stack:** React 18, Node.js, Express, and MongoDB.
- **Vite Powered:** A fast and modern build tool for the frontend.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Dark Mode:** The templates come with a pre-configured dark mode.
- **Server & Client Structure:** A clean and separated structure for the client and server.
- **Example API:** An example API endpoint to get you started.

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

1.  **Project Name:** The name of your project.
2.  **Language:** Choose between JavaScript and TypeScript.
3.  **Concurrently:** Set up scripts to run both client and server simultaneously.
4.  **Install Dependencies:** Automatically install all dependencies.
5.  **Initialize Git:** Initialize a new git repository.

After the setup is complete, you can navigate to your new project and start the development server.

## Templates

`cma-cli` provides two templates:

- **JavaScript:** A complete MERN stack template using JavaScript.
- **TypeScript:** A fully type-safe MERN stack template using TypeScript.

Both templates include a client-side built with React and Vite, and a server-side built with Node.js, Express, and Mongoose.

## Contributing

We welcome contributions to `cma-cli`! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

### Development Setup

To set up your development environment, follow these steps:

1.  **Clone the repository:** `git clone https://github.com/YOUR_USERNAME/create-mern-app.git`
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
