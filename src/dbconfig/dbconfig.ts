
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create an Axios instance for API requests
const api: AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api", // Change as needed
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Example: Connect (ping API)
export const connect = async (): Promise<boolean> => {
  try {
    const res: AxiosResponse = await api.get("/health");
    return res.status === 200;
  } catch (error) {
    console.error("❌ API health check failed:", error);
    return false;
  }
};


// Example: Get connection status (API health)
export const getConnectionStatus = async (): Promise<{
  status: string;
  isConnected: boolean;
}> => {
  try {
    const res: AxiosResponse = await api.get("/health");
    return {
      status: res.status === 200 ? "connected" : "disconnected",
      isConnected: res.status === 200,
    };
  } catch {
    return {
      status: "disconnected",
      isConnected: false,
    };
  }
};


// Example: Disconnect (no-op for API)
export const disconnect = async (): Promise<void> => {
  // No direct DB connection to close; implement if your API supports logout/session
  console.log("🔌 API disconnect (no-op)");
};


// Example: Reconnect (just calls connect)
export const reconnect = async (): Promise<boolean> => {
  return await connect();
};

// Example: Health check (alias for connect)
export const healthCheck = async (): Promise<boolean> => {
  return await connect();
};
