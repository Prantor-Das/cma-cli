# cma-cli (Create MERN App CLI) - TypeScript

Stop wasting time on boilerplate — cma-cli instantly scaffolds a production-ready MERN stack with clean structure, developer tooling, and everything you need to get started. This TypeScript version provides full type safety and enhanced developer experience.

## 🚀 Features

-   **Modern Stack**: React 18, Node.js, Express, MongoDB with TypeScript
-   **Type Safety**: Full TypeScript support with strict type checking
-   **Development Tools**: Hot reload, ESLint with TypeScript, Vite
-   **UI Components**: Tailwind CSS with typed custom components
-   **Testing**: Vitest with React Testing Library and TypeScript
-   **Security**: Helmet, CORS, Rate limiting, Compression
-   **Database**: MongoDB with Mongoose ODM and TypeScript schemas
-   **Validation**: Express Validator with TypeScript types
-   **Error Handling**: Centralized error handling with typed errors
-   **Logging**: Morgan for HTTP request logging
-   **Routing**: React Router for client-side routing with typed routes

## 📁 Project Structure

```
├── client/                 # React frontend (TypeScript)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Static assets (.gitkeep)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # UI components (DocumentationCard, Person, ThemeToggle)
│   │   │   ├── ApiMessage.tsx
│   │   │   └── Navigation.tsx
│   │   ├── config/         # Configuration files
│   │   │   └── constants.ts
│   │   ├── context/        # React contexts (.gitkeep)
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useTheme.ts
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx    # Landing page with demo content
│   │   │   └── NotFound.tsx # 404 page
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── App.tsx         # Main app with routing
│   │   ├── Layout.tsx      # Layout wrapper
│   │   ├── main.tsx        # React entry point
│   │   ├── global.css      # Global styles
│   │   └── vite-env.d.ts   # Vite environment types
│   ├── index.html          # HTML template
│   ├── vite.config.ts      # Vite configuration (TypeScript)
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tsconfig.node.json  # TypeScript configuration for Node.js
│   └── package.json
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── connectDB.ts
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorMiddleware.ts
│   │   ├── models/         # Mongoose models with TypeScript interfaces
│   │   │   └── user.ts
│   │   ├── routes/         # API routes
│   │   │   ├── index.ts
│   │   │   └── users.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── __tests__/      # Server tests
│   │   │   └── server.test.ts
│   │   └── server.ts       # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── vitest.config.ts    # Vitest configuration (TypeScript)
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json
└── package.json           # Workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **npm**
-   **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community)
-   **TypeScript** knowledge recommended

### Installation

1. **Install dependencies**:

    ```bash
    npm install
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
    CLIENT_URL=http://localhost:5173
    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    ```

3. **Start development servers**:
    ```bash
    npm run dev
    ```

This will start:

-   **Client**: http://localhost:5173 (with hot reload and TypeScript checking)
-   **Server**: http://localhost:8000 (with nodemon and TypeScript compilation)

## 📜 Available Scripts

### Workspace Scripts

-   `npm run dev` - Start both client and server in development mode
-   `npm run build` - Build both client and server for production
-   `npm run start` - Start production server
-   `npm run test` - Run tests for server
-   `npm run lint` - Lint both client and server code
-   `npm run type-check` - Run TypeScript type checking

### Client Scripts

-   `npm run client` - Start only the client
-   `npm run build --workspace client` - Build client for production (includes TypeScript compilation)
-   `npm run preview --workspace client` - Preview production build
-   `npm run type-check --workspace client` - Run TypeScript type checking for client

### Server Scripts

-   `npm run server` - Start only the server
-   `npm run test --workspace server` - Run server tests
-   `npm run start --workspace server` - Start production server
-   `npm run type-check --workspace server` - Run TypeScript type checking for server

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
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12

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

    - Update `client/src/pages/Home.tsx` with your content
    - Remove `client/src/components/ApiMessage.tsx`
    - Update navigation in `client/src/components/Navigation.tsx`
    - Customize UI components in `client/src/components/ui/` (DocumentationCard, Person, ThemeToggle)
    - Remove `.gitkeep` files from empty directories (assets, context, utils)
    - Update type definitions in `client/src/vite-env.d.ts` as needed

2. **Server Side**:
    - Remove demo routes in `server/src/routes/users.ts`
    - Update `server/src/routes/index.ts`
    - Modify or remove `server/src/models/user.ts`
    - Add your own models, routes, and type definitions
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
