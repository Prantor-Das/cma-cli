# Getting Started

This guide will help you set up and run the MERN Stack Starter on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (optional, for database features) - [Download here](https://www.mongodb.com/try/download/community)

## Installation

### 1. Clone or Create Your Project

If you're using the CLI tool:
```bash
npx create-mern-app my-app
cd my-app
```

### 2. Install Dependencies

Install all dependencies for both client and server:
```bash
npm install
```

This will install dependencies for the workspace, client, and server.

### 3. Environment Setup

#### Server Environment
Copy the server environment template:
```bash
cp server/src/.env.example server/src/.env
```

Edit `server/src/.env` with your configuration:
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Client Environment
Copy the client environment template:
```bash
cp client/.env.example client/.env
```

Edit `client/.env` with your configuration:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=MERN Stack Starter
```

### 4. Database Setup (Optional)

If you want to use MongoDB features:

1. **Install MongoDB** locally or use **MongoDB Atlas** (cloud)
2. **Start MongoDB** (if using local installation):
   ```bash
   mongod
   ```
3. **Update the connection string** in your `.env` file

> **Note**: The application will work without MongoDB, but user management features will be limited.

## Running the Application

### Development Mode

Start both client and server in development mode:
```bash
npm run dev
```

This will start:
- **Client**: http://localhost:5173 (with hot reload)
- **Server**: http://localhost:8000 (with nodemon)

### Individual Services

Start only the client:
```bash
npm run client
```

Start only the server:
```bash
npm run server
```

## Verification

1. **Open your browser** to http://localhost:5173
2. **Check the API status** - you should see a green "API Connected" message
3. **Toggle the theme** using the theme switcher in the navigation
4. **Navigate between pages** using the navigation menu

## Next Steps

- [Explore the Project Structure](./project-structure.md)
- [Learn about Development Workflow](./development.md)
- [Customize UI Components](./components.md)
- [Set up Authentication](./authentication.md)

## Troubleshooting

If you encounter issues, check the [Troubleshooting Guide](./troubleshooting.md) or:

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules client/node_modules server/node_modules
   npm install
   ```

2. **Check port availability**:
   - Ensure ports 5173 and 8000 are not in use
   - Update ports in environment files if needed

3. **Verify Node.js version**:
   ```bash
   node --version  # Should be v18 or higher
   ```