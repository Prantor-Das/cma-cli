# cma-cli (Create MERN App CLI) - JavaScript

Stop wasting time on boilerplate — cma-cli instantly scaffolds a production-ready MERN stack with clean structure, developer tooling, and everything you need to get started.

## 🚀 Features

-   **Modern Stack**: React, Node.js, Express, MongoDB
-   **Package Manager Support**: Works with bun, pnpm, yarn, or npm
-   **Flexible Setup**: Client-only, server-only, or full-stack initialization
-   **Development Tools**: Hot reload, ESLint, Vite with fast refresh
-   **UI Components**: Tailwind CSS v4 with custom components and dark mode
-   **Security**: Helmet, CORS, Rate limiting, Compression, Query Sanitization
-   **Database**: MongoDB with Mongoose ODM and connection management
-   **Validation**: Express Validator with comprehensive error handling
-   **Error Handling**: Centralized error handling with custom middleware
-   **Logging**: Morgan for HTTP request logging in development
-   **Routing**: React Router for client-side routing
-   **Git Integration**: Automatic Git initialization with GitHub support
-   **Production Ready**: Optimized build configurations and deployment setup

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Static assets (.gitkeep)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # UI components
│   │   │   │   └── ThemeToggle.jsx
│   │   │   └── Navigation.jsx
│   │   ├── config/         # Configuration files
│   │   │   └── constants.js
│   │   ├── context/        # React contexts (.gitkeep)
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useTheme.js
│   │   ├── pages/          # Page components
│   │   │   ├── Demo.jsx    # Landing page with demo content
│   │   │   └── NotFound.jsx # 404 page
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── App.jsx         # Main app with routing
│   │   ├── Layout.jsx      # Layout wrapper
│   │   ├── main.jsx        # React entry point
│   │   └── global.css      # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── eslint.config.js    # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   ├── .prettierignore     # Prettier ignore file
│   ├── .env.example        # Environment variables template
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── __tests__/      # Server tests
│   │   │   ├── server.test.js
│   │   │   └── setup.js
│   │   ├── config/         # Database and app configuration
│   │   │   ├── connectDB.js
│   │   │   └── validateEnv.js
│   │   ├── controllers/    # Request handlers (.gitkeep)
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorMiddleware.js
│   │   ├── models/         # Mongoose models (.gitkeep)
│   │   ├── routes/         # API routes
│   │   │   └── index.js
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── validation/     # Input validation
│   │   │   └── validationHandler.js
│   │   └── server.js       # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── .env.test           # Test environment variables
│   ├── jest.config.js      # Jest configuration
│   ├── jsconfig.json       # JavaScript configuration
│   ├── eslint.config.js    # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   ├── .prettierignore     # Prettier ignore file
│   └── package.json
├── .gitignore              # Git ignore file
├── package.json            # Workspace configuration
└── README.md               # Project documentation
```

## 🛠️ Getting Started

### Prerequisites

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **Package Manager**: One of bun, pnpm, yarn, or npm (npm comes with Node.js)
-   **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community)
-   **Git** (optional, for repository initialization) - [Download here](https://git-scm.com/)

### Installation

The installation steps depend on how you initialized your project:

#### For Full Stack (Both Client & Server)

1. **Install dependencies**:

    ```bash
    # Using your chosen package manager
    npm install        # or
    pnpm install       # or  
    yarn install       # or
    bun install
    ```

2. **Set up environment variables**:

    ```bash
    cp server/.env.example server/.env
    cp client/.env.example client/.env
    ```

    Edit `server/.env` with your configuration:

    ```env
    PORT=8000
    NODE_ENV=development
    MONGODB_URI=mongodb://127.0.0.1:27017/your_app_name
    CORS_ORIGIN=http://localhost:5173
    ```

3. **Start development servers**:
    ```bash
    npm run dev        # Starts both client and server
    ```

#### For Client-Only Setup

1. **Install dependencies and start**:
    ```bash
    npm install && npm run dev
    ```

#### For Server-Only Setup

1. **Set up environment variables**:
    ```bash
    cp .env.example .env
    ```

2. **Install dependencies and start**:
    ```bash
    npm install && npm run dev
    ```

This will start:

-   **Client**: http://localhost:5173 (with hot reload)
-   **Server**: http://localhost:8000 (with nodemon)

## 📜 Available Scripts

The available scripts depend on your project setup:

### Full Stack (Both Client & Server)

#### Workspace Scripts (from root directory)
-   `npm run dev` - Start both client and server in development mode
-   `npm run build` - Build both client and server for production
-   `npm run start` - Start production server
-   `npm run test` - Run tests for server
-   `npm run lint` - Lint both client and server code

#### Individual Component Scripts
-   `npm run client` - Start only the client
-   `npm run server` - Start only the server
-   `npm run build --workspace client` - Build client for production
-   `npm run preview --workspace client` - Preview production build
-   `npm run test --workspace server` - Run server tests

### Client-Only Setup

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Lint code with ESLint

### Server-Only Setup

-   `npm run dev` - Start development server with hot reload
-   `npm run start` - Start production server
-   `npm run build` - Build for production (if using TypeScript)
-   `npm run test` - Run server tests
-   `npm run lint` - Lint code with ESLint

### Package Manager Specific Commands

Replace `npm` with your chosen package manager:
-   **bun**: `bun run dev`, `bun install`, etc.
-   **pnpm**: `pnpm dev`, `pnpm install`, etc.
-   **yarn**: `yarn dev`, `yarn install`, etc.

## 🔧 Configuration

### Environment Variables

#### Server (.env)

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app

# Client URL for CORS
CORS_ORIGIN=http://localhost:5173

# Security

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client (.env)

```env
# App Configuration
VITE_APP_NAME=Your App Name

# API Configuration
VITE_API_URL=http://localhost:8000
```

## 🎨 Customization

### Remove Demo Content

1. **Client Side**:

    - Remove `client/src/pages/Demo.jsx`
    - Customize UI components in `client/src/components/ui/` (ThemeToggle)

2. **Server Side**:
    - Add your own models and routes in `server/src/models/` and `server/src/routes/`
    - Update `server/src/routes/index.js` to register your routes

### Styling

The template uses **Tailwind CSS v4** for styling with built-in dark mode support. The configuration is minimal and uses the new CSS-based approach.

## 📚 Learn More

-   [React Documentation](https://reactjs.org/)
-   [React Router Documentation](https://reactrouter.com/)
-   [Express.js Documentation](https://expressjs.com/)
-   [MongoDB Documentation](https://docs.mongodb.com/)
-   [Mongoose Documentation](https://mongoosejs.com/)
-   [Tailwind CSS Documentation](https://tailwindcss.com/)
-   [Vite Documentation](https://vitejs.dev/)
-   [Vitest Documentation](https://vitest.dev/)

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**:

    ```bash
    # Kill process on port 5173 or 8000
    npx kill-port 5173
    npx kill-port 8000
    ```

2. **MongoDB connection issues**:

    - Ensure MongoDB is running locally
    - Check connection string in `.env`
    - Verify network access for MongoDB Atlas

3. **Module not found errors**:

    ```bash
    # Clear node_modules and reinstall
    rm -rf node_modules client/node_modules server/node_modules
    npm install
    ```

4. **Build errors**:
    ```bash
    # Clear build cache
    npm run clean
    npm run build
    ```

---

**Happy coding!** 🎉