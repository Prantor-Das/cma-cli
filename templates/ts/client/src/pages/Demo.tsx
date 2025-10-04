import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  Server,
  Palette,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  LucideIcon,
} from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/constants";

// Main Component

export default function Demo() {
  return (
    <div className="space-y-12 my-4">
      {/* Header */}
      <div className="space-y-4 max-w-5xl mx-auto flex items-center justify-between flex-col sm:flex-row ">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
            MERN Stack Starter
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 md:w-2/3">
            Instantly scaffold a production-ready MERN stack app with clean
            structure and dev tooling
          </p>
        </div>
        <div className="pt-0 flex flex-col items-center space-y-2 w-48">
          <a
            href="https://github.com/prasoonk1204/cma-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 bg-gray-900 text-white dark:bg-zinc-100 dark:text-gray-900 rounded-xl text-sm font-medium hover:opacity-90 transition w-full border border-zinc-900 dark:border-zinc-100"
          >
            View on GitHub <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
          <a
            href="https://npmjs.com/package/cma-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 bg-zinc-100 text-zinc-950 border border-zinc-950 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-gray-100 dark:border-zinc-700 rounded-xl text-sm font-medium transition w-full"
          >
            View on&nbsp;
            <span className="text-red-500 dark:text-red-400">NPM</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      {/* API Endpoint and Status */}
      <div className="rounded-xl max-w-5xl mx-auto border bg-white border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight dark:text-zinc-100">
            Test API Endpoint & Status
          </h3>
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Check the connection and health of your backend API
          </p>
        </div>
        <div className="p-6 pt-0 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg w-full">
            <div>
              <span className="font-mono text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                GET
              </span>
              <span className="ml-3 font-mono text-gray-900 dark:text-zinc-100">
                /health
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-zinc-400">
              Health check
            </span>
          </div>
          <ApiMessage />
        </div>
      </div>

      {/* Documentation Section */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
            Getting Started Guide
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">
            Follow these steps to customize your MERN stack application and make
            it your own
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <DocumentationCard
            icon={Palette}
            title="Client Setup"
            items={[
              {
                title: "Environment Variables",
                code: "client/.env.example",
                description:
                  "Rename .env.example to .env and set your client configurations",
              },
              {
                title: "Remove Demo Component",
                code: "client/src/pages/Demo.jsx",
                description:
                  "Delete the Demo component and remove it's route from App.jsx",
              },
            ]}
          />

          <DocumentationCard
            icon={Server}
            title="Server Setup"
            items={[
              {
                title: "Environment Variables",
                code: "server/.env",
                description:
                  "Rename .env.example to .env and set your server configurations",
              },
              {
                title: "Database Models",
                code: "server/src/models/",
                description:
                  "Create or modify models for your data structure (remove User model if not needed)",
              },
              {
                title: "Remove Demo Api Routes",
                code: "server/src/routes/users.js",
                description:
                  "Delete or modify sample auth and user routes. Create routes specific to your app",
              },
              {
                title: "Update Route Index",
                code: "server/src/routes/index.js",
                description:
                  "Register your new routes and remove unused demo route imports",
              },
            ]}
          />
        </div>
      </div>

      {/* Developer Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t-1 border-zinc-300 dark:border-zinc-700 pt-6 mt-14 max-w-5xl mx-auto">
        <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
          <span className="">Built by</span>
          <Link
            to="https://x.com/akashi_sde"
            target="_blank"
            className="text-zinc-900 dark:text-zinc-100 hover:text-blue-500 hover:dark:text-blue-400 font-semibold text-lg"
          >
            Prantor
          </Link>
          &
          <Link
            to="https://prasoonk.vercel.app"
            target="_blank"
            className="text-zinc-900 dark:text-zinc-100 hover:text-blue-500 hover:dark:text-blue-400 font-semibold text-lg"
          >
            Prasoon
          </Link>
        </div>
        <div className="flex gap-4">
          <a
            href="https://forms.gle/bL9ziLifgEEyZQXp6"
            target="_blank"
            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 hover:dark:bg-zinc-700 transition-all duration-200 px-4 py-2 rounded-xl font-semibold font-mono"
          >
            Give Feedback
          </a>
          <a
            href="mailto:create.mern.app.cli@gmail.com"
            target="_blank"
            className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 hover:dark:bg-zinc-700 transition-all duration-200 px-4 py-2 rounded-xl font-semibold font-mono"
          >
            Mail Us
          </a>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

interface ApiState {
  message: string;
  loading: boolean;
  error: string | null;
}

function ApiMessage() {
  const [state, setState] = useState<ApiState>({
    message: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ message: string }>(
          API_ENDPOINTS.HEALTH,
        );
        setState({
          message: response.data.message,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("API fetch error:", error);
        setState({
          message: "",
          loading: false,
          error:
            error.response?.data?.error ||
            error.message ||
            "Failed to fetch from API",
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 w-full ">
      <div className="p-4">
        <div className="flex items-center gap-3">
          {state.loading && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-gray-600 dark:text-zinc-400">
                Connecting to API...
              </span>
            </>
          )}

          {state.error && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Connection Failed
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  {state.error}
                </p>
              </div>
            </>
          )}

          {!state.loading && !state.error && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  API Connected
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  RESPONSE : {state.message}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentationItem {
  title: string;
  code?: string;
  description: string;
}

interface DocumentationCardProps {
  icon: LucideIcon;
  title: string;
  items: DocumentationItem[];
}

function DocumentationCard({
  icon: Icon,
  title,
  items,
}: DocumentationCardProps) {
  return (
    <div className="rounded-xl border bg-white border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <Icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-x-hidden"
            >
              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100">
                    {item.title}
                  </span>
                  {item.code && (
                    <code className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded font-mono border border-zinc-300 dark:border-zinc-600">
                      {item.code}
                    </code>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
