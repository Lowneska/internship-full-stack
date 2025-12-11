"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateProgram } from "@/features/program/api";
import type { ProgramResponse, ProgramDay } from "@/features/program/types";
import { ProgramGenerator } from "@/features/program/components/ProgramGenerator";
import { ProgramDisplay } from "@/features/program/components/ProgramDisplay";
import styles from "./page.module.css";

/******************************************
 * ProgramPage component for generating workout programs
 * @return JSX.Element representing the program generation page
 ******************************************/
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
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  async function handleGenerate() {
    if (!input.trim()) {
      setError("Please describe your goals, constraints, etc.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateProgram(input);
      data.days.sort((a: ProgramDay, b: ProgramDay) => a.day - b.day);
      setProgram(data);
      setLastPrompt(input);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "status" in err && err.status === 401) {
        setError("Session expired. Please login again.");
        router.push("/login");
      } else {
        setError("Failed to generate program.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    if (!lastPrompt) return;
    setRegenLoading(true);
    setError(null);

    try {
      const data = await generateProgram(lastPrompt);
      data.days.sort((a: ProgramDay, b: ProgramDay) => a.day - b.day);
      setProgram(data);
    } catch {
      setError("Failed to regenerate program.");
    } finally {
      setRegenLoading(false);
    }
  }

  function handleDownloadJson() {
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
  }

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

      {program && <ProgramDisplay program={program} />}
    </main>
  );
}
