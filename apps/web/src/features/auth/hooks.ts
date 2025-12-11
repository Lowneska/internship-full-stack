"use client";

import { useEffect, useState } from "react";
import { getMe } from "./api";
import { clearToken, getToken } from "@/lib/authStorage";
import type { User } from "./types";

/******************************************
 * Hook to get the authenticated user
 ******************************************/
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const fetchUser = async () => {
      if (!token) {
        setError("Vous devez être connecté pour accéder à cette page");
        setLoading(false);
        return;
      }
      try {
        const userData = await getMe();
        setUser(userData);
        setError(null);
      } catch (err) {
        clearToken();
        setUser(null);
        setError("Session expirée ou non autorisée");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
}
