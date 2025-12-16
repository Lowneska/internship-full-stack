"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateProgram } from "@/features/program/api";
import type { ProgramResponse, ProgramDay } from "@/features/program/types";
import { ProgramGenerator } from "@/features/program/components/ProgramGenerator";
import { ProgramDisplay } from "@/features/program/components/ProgramDisplay";
import styles from "./page.module.css";

type ApiError = {
  status?: number;
  data?: { detail?: string };
  [key: string]: unknown;
};

function normalizeProgram(program: ProgramResponse): ProgramResponse {
  return {
    ...program,
    days: [...program.days].sort((a: ProgramDay, b: ProgramDay) => a.day - b.day),
  };
}

export default function ProgramPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [program, setProgram] = useState<ProgramResponse | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    if (!token) router.push("/login");
  }, [router]);

  const handleApiError = useCallback(
    (err: unknown, fallbackMessage: string) => {
      if (err && typeof err === "object" && "status" in err) {
        const e = err as ApiError;

        if (e.status === 401) {
          setError("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        if (e.status === 422) {
          setError(e.data?.detail ?? "Invalid request.");
          setProgram(null);
          return;
        }

        setError(e.data?.detail ?? fallbackMessage);
        setProgram(null);
        return;
      }

      setError(fallbackMessage);
      setProgram(null);
    },
    [router]
  );

  const runGeneration = useCallback(
    async (prompt: string, mode: "generate" | "regenerate") => {
      const setBusy = mode === "generate" ? setLoading : setRegenLoading;
      const fallbackMessage =
        mode === "generate" ? "Failed to generate program." : "Failed to regenerate program.";

      setBusy(true);
      setError(null);

      try {
        const data = await generateProgram(prompt);
        if (!data.success) {
          setError(data.error_message || fallbackMessage);
          setProgram(null);
          return;
        }

        setProgram(normalizeProgram(data));
        if (mode === "generate") setLastPrompt(prompt);
      } catch (err) {
        handleApiError(err, fallbackMessage);
      } finally {
        setBusy(false);
      }
    },
    [handleApiError]
  );

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError("Please describe your goals, constraints, etc.");
      return;
    }
    await runGeneration(input.trim(), "generate");
  }, [input, runGeneration]);

  const handleRegenerate = useCallback(async () => {
    if (!lastPrompt) return;
    await runGeneration(lastPrompt, "regenerate");
  }, [lastPrompt, runGeneration]);

  const handleDownloadJson = useCallback(() => {
    if (!program) return;
    const blob = new Blob([JSON.stringify(program, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-program.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [program]);

  return (
    <main className={styles.programPage}>
      <ProgramGenerator
        input={input}
        loading={loading}
        regenLoading={regenLoading}
        error={error}
        lastPrompt={lastPrompt}
        onInputChange={setInput}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
        onDownload={handleDownloadJson}
      />

      {program && program.success && <ProgramDisplay program={program} />}
    </main>
  );
}
