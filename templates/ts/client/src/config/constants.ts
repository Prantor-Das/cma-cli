export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
export const APP_NAME = import.meta.env.VITE_APP_NAME;

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
} as const;
