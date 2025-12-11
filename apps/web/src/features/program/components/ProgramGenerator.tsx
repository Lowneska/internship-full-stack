import styles from "./ProgramGenerator.module.css";

/******************************************
 *Props for ProgramGenerator component
    * - `input` : User input string
    * - `loading` : Loading state for generation
    * - `regenLoading` : Loading state for regeneration
    * - `error` : Error message string
    * - `lastPrompt` : Last prompt string
    * - `onInputChange` : Handler for input change
    * - `onGenerate` : Handler for generate action
    * - `onRegenerate` : Handler for regenerate action
    * - `onDownload` : Handler for download action
 ******************************************/
interface ProgramGeneratorProps {
  input: string;
  loading: boolean;
  regenLoading: boolean;
  error: string | null;
  lastPrompt: string | null;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
}

/******************************************
 * ProgramGenerator component for generating workout programs
 * @param props - Props for the component
 * @return JSX.Element representing the program generator UI
 ******************************************/
export function ProgramGenerator({
  input,
  loading,
  regenLoading,
  error,
  lastPrompt,
  onInputChange,
  onGenerate,
  onRegenerate,
  onDownload,
}: ProgramGeneratorProps) {
  return (
    <>
      <h1 className={styles.programGenerator__title}>Generate Workout Program</h1>
      <p className={styles.programGenerator__subtitle}>
        Describe your goals, constraints, equipment, availability, and fitness level.
      </p>

      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        rows={5}
        className={styles.programGenerator__textarea}
        placeholder='Example: "I want to lose weight, 4 sessions/week, 45 min, no dumbbells, intermediate level"'
      />

      {error && <p className={styles.programGenerator__error}>{error}</p>}

      <div className={styles.programGenerator__buttonGroup}>
        <button
          onClick={onGenerate}
          disabled={loading}
          className={styles.programGenerator__buttonPrimary}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={onRegenerate}
          disabled={!lastPrompt || regenLoading}
          className={styles.programGenerator__buttonSecondary}
        >
          {regenLoading ? "Re-generating..." : "Re-generate"}
        </button>

        <button
          onClick={onDownload}
          disabled={false}
          className={styles.programGenerator__buttonOutline}
        >
          Download JSON
        </button>
      </div>
    </>
  );
}
