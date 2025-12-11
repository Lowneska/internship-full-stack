import type { ProgramResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/******************************************
 * Fonction pour récupérer le token d'authentification
 * @return Le token d'authentification ou null s'il n'existe pas
 ******************************************/
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/******************************************
 * Fuction to generate a training program based on user text input
 * @param text - User input describing goals, constraints, etc.
 * @return Generated training program
 ******************************************/
export async function generateProgram(text: string): Promise<ProgramResponse> {
  const token = getToken();

  if (!token) {
    throw { status: 401, data: { detail: "No token" } };
  }

  const res = await fetch(`${API_URL}/api/ai/program`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data as ProgramResponse;
}
