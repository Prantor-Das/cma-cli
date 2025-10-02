export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "MERN Stack Starter";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  API_ROOT: `${API_BASE_URL}/api`,
  USERS: `${API_BASE_URL}/api/users`,
};
