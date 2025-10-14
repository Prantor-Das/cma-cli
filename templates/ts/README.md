# cma-cli (Create MERN App CLI) - TypeScript

Stop wasting time on boilerplate — cma-cli instantly scaffolds a production-ready MERN stack with clean structure, developer tooling, and everything you need to get started. This TypeScript version provides full type safety and enhanced developer experience.

## 🚀 Features

-   **Modern Stack**: React, Node.js, Express, MongoDB with full TypeScript support
-   **Type Safety**: Strict TypeScript configuration with comprehensive type checking
-   **Package Manager Support**: Works with bun, pnpm, yarn, or npm with TypeScript optimizations
-   **Flexible Setup**: Client-only, server-only, or full-stack initialization with proper typing
-   **Development Tools**: Hot reload, ESLint with TypeScript rules, Vite with fast refresh
-   **UI Components**: Tailwind CSS v4 with typed custom components and dark mode
-   **Security**: Helmet, CORS, Rate limiting, Compression with typed configurations
-   **Database**: MongoDB with Mongoose ODM and comprehensive TypeScript schemas
-   **Validation**: Express Validator with full TypeScript type inference
-   **Error Handling**: Centralized error handling with typed error classes
-   **Logging**: Morgan for HTTP request logging with typed middleware
-   **Routing**: React Router with typed routes and parameters
-   **Git Integration**: Automatic Git initialization with GitHub support
-   **Production Ready**: Optimized TypeScript build configurations for deployment

## 📁 Project Structure

```
├── client/                 # React frontend (TypeScript)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Static assets (.gitkeep)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # UI components
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── Navigation.tsx
│   │   ├── config/         # Configuration files
│   │   │   └── constants.ts
│   │   ├── context/        # React contexts (.gitkeep)
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useTheme.ts
│   │   ├── pages/          # Page components
│   │   │   ├── Demo.tsx    # Landing page with demo content
│   │   │   └── NotFound.tsx # 404 page
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── App.tsx         # Main app with routing
│   │   ├── Layout.tsx      # Layout wrapper
│   │   ├── main.tsx        # React entry point
│   │   ├── global.css      # Global styles
│   │   └── vite-env.d.ts   # Vite environment types
│   ├── index.html          # HTML template
│   ├── vite.config.ts      # Vite configuration (TypeScript)
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tsconfig.app.json   # TypeScript app configuration
│   ├── tsconfig.node.json  # TypeScript configuration for Node.js
│   ├── eslint.config.js    # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   ├── .prettierignore     # Prettier ignore file
│   ├── .env.example        # Environment variables template
│   └── package.json
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── __tests__/      # Server tests
│   │   │   ├── server.test.ts
│   │   │   └── setup.ts
│   │   ├── config/         # Database and app configuration
│   │   │   ├── connectDB.ts
│   │   │   └── validateEnv.ts
│   │   ├── controllers/    # Request handlers (.gitkeep)
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorMiddleware.ts
│   │   ├── models/         # Mongoose models with TypeScript interfaces (.gitkeep)
│   │   ├── routes/         # API routes
│   │   │   └── index.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── validation/     # Input validation (empty)
│   │   └── server.ts       # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── .env.test           # Test environment variables
│   ├── jest.config.js      # Jest configuration
│   ├── tsconfig.json       # TypeScript configuration
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
-   **TypeScript** knowledge recommended for full development experience

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
    npm run dev        # Starts both client and server with TypeScript compilation
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

-   **Client**: http://localhost:5173 (with hot reload and TypeScript checking)
-   **Server**: http://localhost:8000 (with nodemon and TypeScript compilation)

## 📜 Available Scripts

The available scripts depend on your project setup:

### Full Stack (Both Client & Server)

#### Workspace Scripts (from root directory)
-   `npm run dev` - Start both client and server with TypeScript compilation
-   `npm run build` - Build both client and server for production
-   `npm run start` - Start production server
-   `npm run test` - Run tests for server
-   `npm run lint` - Lint both client and server code
-   `npm run type-check` - Run TypeScript type checking for entire project

#### Individual Component Scripts
-   `npm run client` - Start only the client with TypeScript
-   `npm run server` - Start only the server with TypeScript
-   `npm run build --workspace client` - Build client for production
-   `npm run preview --workspace client` - Preview production build
-   `npm run type-check --workspace client` - Type check client code
-   `npm run type-check --workspace server` - Type check server code

### Client-Only Setup

-   `npm run dev` - Start development server with TypeScript compilation
-   `npm run build` - Build for production with TypeScript
-   `npm run preview` - Preview production build
-   `npm run lint` - Lint code with ESLint and TypeScript rules
-   `npm run type-check` - Run TypeScript type checking

### Server-Only Setup

-   `npm run dev` - Start development server with TypeScript and hot reload
-   `npm run build` - Compile TypeScript for production
-   `npm run start` - Start production server
-   `npm run test` - Run server tests with TypeScript
-   `npm run lint` - Lint code with ESLint and TypeScript rules
-   `npm run type-check` - Run TypeScript type checking

### Package Manager Specific Commands

Replace `npm` with your chosen package manager:
-   **bun**: `bun run dev`, `bun install`, etc. (includes @types/bun automatically)
-   **pnpm**: `pnpm dev`, `pnpm install`, etc.
-   **yarn**: `yarn dev`, `yarn install`, etc.

## 🔧 Configuration

### TypeScript Configuration

The template includes optimized TypeScript configurations:

#### Client (tsconfig.json)

-   Strict type checking enabled
-   React JSX support
-   Modern ES2020 target
-   Vite-specific module resolution

#### Server (tsconfig.json)

-   Node.js target configuration
-   Strict type checking
-   ES2020 features
-   Path mapping support

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

    - Remove `client/src/pages/Demo.tsx` and it's route from `client/src/App.tsx`
    - Customize UI components in `client/src/components/ui/` (ThemeToggle)
    - Update type definitions in `client/src/vite-env.d.ts` as needed

2. **Server Side**:
    - Add your own models, routes, and type definitions in respective directories
    - Update `server/src/routes/index.ts` to register your routes
    - Update `server/src/types/index.ts` with your custom types

### TypeScript Best Practices

-   **Interface Definitions**: Define clear interfaces for your data structures
-   **Type Guards**: Use type guards for runtime type checking
-   **Generic Types**: Leverage generics for reusable components
-   **Strict Null Checks**: The template has strict null checks enabled
-   **Path Mapping**: Use absolute imports with path mapping when needed

### Styling

The template uses **Tailwind CSS v4** for styling with built-in dark mode support. All components are fully typed with proper prop interfaces.

## 📚 Learn More

-   [TypeScript Documentation](https://www.typescriptlang.org/)
-   [React with TypeScript](https://react.dev/learn/typescript)
-   [React Router Documentation](https://reactrouter.com/)
-   [Express.js with TypeScript](https://expressjs.com/)
-   [MongoDB Documentation](https://docs.mongodb.com/)
-   [Mongoose with TypeScript](https://mongoosejs.com/docs/typescript.html)
-   [Tailwind CSS Documentation](https://tailwindcss.com/)
-   [Vite Documentation](https://vitejs.dev/)
-   [Vitest Documentation](https://vitest.dev/)

## 🆘 Troubleshooting

### Common Issues

1. **TypeScript compilation errors**:

    ```bash
    # Run type checking to see detailed errors
    npm run type-check

    # Check specific workspace
    npm run type-check --workspace client
    npm run type-check --workspace server
    ```

2. **Port already in use**:

    ```bash
    # Kill process on port 5173 or 8000
    npx kill-port 5173
    npx kill-port 8000
    ```

3. **MongoDB connection issues**:

    - Ensure MongoDB is running locally
    - Check connection string in `.env`
    - Verify network access for MongoDB Atlas
    - Check TypeScript types for database models

4. **Module not found errors**:

    ```bash
    # Clear node_modules and reinstall
    rm -rf node_modules client/node_modules server/node_modules
    npm install
    ```

5. **Build errors**:

    ```bash
    # Clear build cache and TypeScript cache
    npm run clean
    rm -rf client/dist server/dist
    npm run build
    ```

6. **Type definition issues**:
    ```bash
    # Ensure all @types packages are installed
    npm install --save-dev @types/node @types/react @types/react-dom
    ```

### TypeScript Tips

-   Use `npm run type-check` regularly during development
-   Enable TypeScript strict mode for better type safety
-   Use proper typing for API responses and database models
-   Leverage TypeScript's IntelliSense for better development experience

---

**Happy coding!** 🎉
