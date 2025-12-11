import { apiClient, authClient } from "@/lib/apiClient";
import type { User, UserToken } from "./types";

export async function signup(email: string, password: string): Promise<User> {
  return apiClient.post<User>("/api/auth/signup", { email, password });
}

export async function login(email: string, password: string): Promise<UserToken> {
  return apiClient.post<UserToken>("/api/auth/login", { email, password });
}

export async function getMe(): Promise<User> {
  return authClient.get<User>("/api/auth/me");
}
