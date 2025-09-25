import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { API_ENDPOINTS } from "../config/constants";

interface ApiState {
  message: string;
  loading: boolean;
  error: string | null;
}

export default function ApiMessage() {
  const [state, setState] = useState<ApiState>({
    message: "",
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.API_ROOT);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: { message: string } = await response.json();
        setState({
          message: data.message,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("API fetch error:", error);
        setState({
          message: "",
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch from API"
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          {state.loading && (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">
                Connecting to API...
              </span>
            </>
          )}
          
          {state.error && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Connection Failed
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.error}
                </p>
              </div>
            </>
          )}
          
          {!state.loading && !state.error && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  API Connected
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {state.message}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
