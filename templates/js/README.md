# MERN Stack Starter (JavaScript)

A modern, full-stack application template built with the MERN stack (MongoDB, Express.js, React, Node.js) using JavaScript.

## 🚀 Features

-   **Modern Stack**: React 18, Node.js, Express, MongoDB
-   **Development Tools**: Hot reload, ESLint, Vite
-   **UI Components**: Tailwind CSS with custom components
-   **Testing**: Vitest with React Testing Library
-   **Security**: Helmet, CORS, Rate limiting, Compression
-   **Database**: MongoDB with Mongoose ODM
-   **Validation**: Express Validator
-   **Error Handling**: Centralized error handling
-   **Logging**: Morgan for HTTP request logging
-   **Routing**: React Router for client-side routing

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Static assets (.gitkeep)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # UI components (DocumentationCard, Person, ThemeToggle)
│   │   │   ├── ApiMessage.jsx
│   │   │   └── Navigation.jsx
│   │   ├── config/         # Configuration files
│   │   │   └── constants.js
│   │   ├── context/        # React contexts (.gitkeep)
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useTheme.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Landing page with demo content
│   │   │   └── NotFound.jsx # 404 page
│   │   ├── utils/          # Utility functions (.gitkeep)
│   │   ├── App.jsx         # Main app with routing
│   │   ├── Layout.jsx      # Layout wrapper
│   │   ├── main.jsx        # React entry point
│   │   └── global.css      # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── connectDB.js
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorMiddleware.js
│   │   ├── models/         # Mongoose models
│   │   │   └── user.js
│   │   ├── routes/         # API routes
│   │   │   ├── index.js
│   │   │   └── users.js
│   │   ├── __tests__/      # Server tests
│   │   │   └── server.test.js
│   │   └── server.js       # Server entry point
│   ├── .env.example        # Environment variables template
│   ├── vitest.config.js    # Vitest configuration
│   └── package.json
└── package.json           # Workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **npm**
-   **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community)

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

-   **Client**: http://localhost:5173 (with hot reload)
-   **Server**: http://localhost:8000 (with nodemon)

## 📜 Available Scripts

### Workspace Scripts

-   `npm run dev` - Start both client and server in development mode
-   `npm run build` - Build both client and server for production
-   `npm run start` - Start production server
-   `npm run test` - Run tests for server
-   `npm run lint` - Lint both client and server code

### Client Scripts

-   `npm run client` - Start only the client
-   `npm run build --workspace client` - Build client for production
-   `npm run preview --workspace client` - Preview production build

### Server Scripts

-   `npm run server` - Start only the server
-   `npm run test --workspace server` - Run server tests
-   `npm run start --workspace server` - Start production server

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

    - Update `client/src/pages/Home.jsx` with your content
    - Remove `client/src/components/ApiMessage.jsx`
    - Update navigation in `client/src/components/Navigation.jsx`
    - Customize UI components in `client/src/components/ui/` (DocumentationCard, Person, ThemeToggle)
    - Remove `.gitkeep` files from empty directories (assets, context, utils)

2. **Server Side**:
    - Remove demo routes in `server/src/routes/users.js`
    - Update `server/src/routes/index.js`
    - Modify or remove `server/src/models/user.js`
    - Add your own models and routes

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