# MERN Stack Starter (TypeScript)

A modern, full-stack application template built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript for enhanced type safety and developer experience.

## 🚀 Features

- **Modern Stack**: React 18, Node.js, Express, MongoDB
- **TypeScript**: Full type safety across frontend and backend
- **Development Tools**: Hot reload, ESLint, Prettier
- **UI Components**: Tailwind CSS with custom typed components
- **Testing**: Vitest with React Testing Library
- **Security**: Helmet, CORS, Rate limiting
- **Database**: MongoDB with Mongoose ODM and TypeScript interfaces
- **Validation**: Express Validator with TypeScript support
- **Error Handling**: Centralized error handling with proper typing
- **Logging**: Morgan for HTTP request logging

## 📁 Project Structure

```
├── client/                 # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Button, Card, etc.)
│   │   │   ├── Navigation.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── __tests__/  # Component tests
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx    # Dashboard/landing page
│   │   │   ├── About.tsx   # About page
│   │   │   ├── Users.tsx   # Users management
│   │   │   └── NotFound.tsx # 404 page
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   ├── types/          # TypeScript type definitions
│   │   ├── test/           # Test setup
│   │   ├── App.tsx         # Main app with routing
│   │   ├── Layout.tsx      # Layout wrapper
│   │   └── vite-env.d.ts   # Vite environment types
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models with interfaces
│   │   ├── routes/         # API routes with type safety
│   │   ├── types/          # TypeScript type definitions
│   │   ├── __tests__/      # Server tests
│   │   └── server.ts       # Server entry point
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json
└── package.json           # Workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)
- TypeScript knowledge

### Installation

1. Clone or create your project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit the `.env` file with your configuration.

4. Start development servers:
   ```bash
   npm run dev
   ```

This will start:
- Client: http://localhost:5173
- Server: http://localhost:8000

## 📜 Available Scripts

### Workspace Scripts
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start production server
- `npm run test` - Run tests for both client and server
- `npm run lint` - Lint both client and server code
- `npm run type-check` - Type check both client and server

### Client Scripts
- `npm run client` - Start only the client
- `npm run build --workspace client` - Build client for production
- `npm run test --workspace client` - Run client tests
- `npm run type-check --workspace client` - Type check client code

### Server Scripts
- `npm run server` - Start only the server
- `npm run build --workspace server` - Build server for production
- `npm run test --workspace server` - Run server tests
- `npm run type-check --workspace server` - Type check server code

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

### TypeScript Configuration

Both client and server have their own `tsconfig.json` files optimized for their respective environments.

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically connect to the database

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Tests are configured with:
- **Vitest** for test runner with TypeScript support
- **React Testing Library** for component testing
- **jsdom** for DOM simulation
- **TypeScript** for type-safe tests

## 🔍 Type Safety

This template provides full type safety:

- **Frontend**: React components with proper TypeScript interfaces
- **Backend**: Express routes with typed request/response objects
- **Database**: Mongoose models with TypeScript interfaces
- **API**: Shared types between frontend and backend

## 🚀 Deployment

### Client (Frontend)
The client can be deployed to:
- Vercel (with TypeScript support)
- Netlify
- GitHub Pages

### Server (Backend)
The server can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS

Make sure to run `npm run build` before deployment to compile TypeScript.

## 📚 Learn More

- [React with TypeScript](https://reactjs.org/docs/static-type-checking.html)
- [Express.js with TypeScript](https://expressjs.com/)
- [MongoDB with TypeScript](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests if applicable
5. Ensure type checking passes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.