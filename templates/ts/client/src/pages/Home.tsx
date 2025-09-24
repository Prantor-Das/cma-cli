import { useState } from "react";
import { Code2, Database, Globe, Zap, ExternalLink } from "lucide-react";
import ApiMessage from "../components/ApiMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Code2,
    title: "Modern Stack",
    description: "Built with React, Node.js, Express, and MongoDB"
  },
  {
    icon: Zap,
    title: "Fast Development",
    description: "Hot reload, TypeScript support, and modern tooling"
  },
  {
    icon: Database,
    title: "Database Ready",
    description: "MongoDB integration with Mongoose ODM"
  },
  {
    icon: Globe,
    title: "Production Ready",
    description: "Optimized builds and deployment configurations"
  }
];

type TabType = "overview" | "api" | "docs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MERN Stack Starter
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          A modern, full-stack application template
        </p>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {(["overview", "api", "docs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="animate-fade-in">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-3">
                    <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Get your MERN application up and running in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <code className="text-sm">
                    npm run dev
                  </code>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will start both the client and server in development mode with hot reload.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    Example Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Status</CardTitle>
                <CardDescription>
                  Check the connection to your backend API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiMessage />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available endpoints in your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        GET
                      </span>
                      <span className="ml-3 font-mono">/api</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Health check
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        GET
                      </span>
                      <span className="ml-3 font-mono">/api/users</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Get all users
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "docs" && (
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Learn how to build with this MERN stack template
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>Getting Started</h3>
              <p>
                This template provides a solid foundation for building full-stack applications
                with the MERN stack (MongoDB, Express, React, Node.js).
              </p>
              
              <h3>Project Structure</h3>
              <ul>
                <li><strong>client/</strong> - React frontend application</li>
                <li><strong>server/</strong> - Express backend API</li>
                <li><strong>shared/</strong> - Shared utilities and types</li>
              </ul>

              <h3>Development</h3>
              <p>
                Run <code>npm run dev</code> to start both client and server in development mode.
                The client will be available at <code>http://localhost:5173</code> and the API
                at <code>http://localhost:8000</code>.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}