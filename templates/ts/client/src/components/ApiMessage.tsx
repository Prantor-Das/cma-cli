import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../config/constants";
import axios, { AxiosError } from "axios";

interface ApiState {
    message: string;
    loading: boolean;
    error: string | null;
}

interface ApiResponse {
    message: string;
}

interface ApiErrorResponse {
    error: string;
}

export default function ApiMessage() {
    const [state, setState] = useState<ApiState>({
        message: "",
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await axios.get<ApiResponse>(
                    API_ENDPOINTS.API_ROOT,
                );
                setState({
                    message: response.data.message,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("API fetch error:", error);
                const axiosError = error as AxiosError<ApiErrorResponse>;
                setState({
                    message: "",
                    loading: false,
                    error:
                        axiosError.response?.data?.error ||
                        axiosError.message ||
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
