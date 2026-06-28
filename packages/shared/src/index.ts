export const API_DEFAULT_PORT = 8387;
export const WEB_DEFAULT_PORT = 8386;

export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  database: "connected" | "disconnected";
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  timezone: string;
  createdAt: string;
}
