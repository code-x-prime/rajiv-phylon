import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Extracts a human-readable error message from an Axios error.
 * Shows the server's actual message (e.g. "Slug already exists") + the HTTP status code.
 * Admins can see exactly why something failed without opening DevTools.
 */
export function getApiError(e: unknown): string {
  if (e && typeof e === "object") {
    const axiosErr = e as {
      response?: { data?: { message?: string; error?: string }; status?: number };
      message?: string;
    };
    const serverMsg =
      axiosErr.response?.data?.message ||
      axiosErr.response?.data?.error;
    const status = axiosErr.response?.status;
    if (serverMsg) return status ? `${serverMsg} (${status})` : serverMsg;
    if (status) return `Request failed (${status})`;
    if (axiosErr.message) return axiosErr.message;
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong. Please try again.";
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(err);
  }
);

export default api;
