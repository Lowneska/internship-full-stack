import type { ProgramResponse, ProgramDay } from "@/features/program/types";
import { ProgramDayCard } from "./ProgramDayCard";
import styles from "./ProgramDisplay.module.css";

interface ProgramDisplayProps {
  program: ProgramResponse;
}

/******************************************
 * Component to display the entire program
 * @param program - The workout program data
 * @return JSX Element representing the program display
 ******************************************/
export function ProgramDisplay({ program }: ProgramDisplayProps) {
  return (
    <section className={styles.programDisplay}>
      <h2 className={styles.programDisplay__title}>Program</h2>

      <div className={styles.programDisplay__grid}>
        {program.days.map((day: ProgramDay, index: number) => (
          <ProgramDayCard key={`day-${index}`} day={day} />
        ))}
      </div>
    </section>
  );
}
