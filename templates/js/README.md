# MERN Stack Starter (JavaScript)

A modern, full-stack application template built with the MERN stack (MongoDB, Express.js, React, Node.js) using JavaScript.

## 🚀 Features

- **Modern Stack**: React 18, Node.js, Express, MongoDB
- **Development Tools**: Hot reload, ESLint, Prettier
- **UI Components**: Tailwind CSS with custom components
- **Testing**: Vitest with React Testing Library
- **Security**: Helmet, CORS, Rate limiting
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express Validator
- **Error Handling**: Centralized error handling
- **Logging**: Morgan for HTTP request logging

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Button, Card, etc.)
│   │   │   ├── Navigation.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── __tests__/  # Component tests
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Dashboard/landing page
│   │   │   ├── About.jsx   # About page
│   │   │   ├── Users.jsx   # Users management
│   │   │   └── NotFound.jsx # 404 page
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   ├── test/           # Test setup
│   │   ├── App.jsx         # Main app with routing
│   │   ├── Layout.jsx      # Layout wrapper
│   │   └── ThemeContext.jsx # Theme management
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── __tests__/      # Server tests
│   │   └── server.js       # Server entry point
│   └── package.json
└── package.json           # Workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. Clone or create your project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp server/src/.env.example server/src/.env
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

### Client Scripts
- `npm run client` - Start only the client
- `npm run build --workspace client` - Build client for production
- `npm run test --workspace client` - Run client tests

### Server Scripts
- `npm run server` - Start only the server
- `npm run build --workspace server` - Build server (if applicable)
- `npm run test --workspace server` - Run server tests

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server/src` directory:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mern_app
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

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
- **Vitest** for test runner
- **React Testing Library** for component testing
- **jsdom** for DOM simulation

## 🚀 Deployment

### Client (Frontend)
The client can be deployed to:
- Vercel
- Netlify
- GitHub Pages

### Server (Backend)
The server can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.