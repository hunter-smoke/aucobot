export const API_DEFAULT_PORT = 4000;
export const WEB_DEFAULT_PORT = 3000;

export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  database: "connected" | "disconnected";
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  createdAt: string;
}
