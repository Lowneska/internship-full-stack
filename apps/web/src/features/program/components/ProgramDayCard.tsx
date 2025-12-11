// src/features/program/components/ProgramDayCard.tsx
import type { ProgramDay, Exercise } from "@/features/program/types";
import { Clock, Flame, Download, Dumbbell } from "lucide-react";
import styles from "./ProgramDayCard.module.css";

/******************************************
 * Props for ProgramDayCard component
 * - `day` : Program day data
 ******************************************/
type Props = {
  day: ProgramDay;
};

/******************************************
 * Component to display a card for a program day
 * @param day - Program day data
 * @return JSX Element representing the program day card
 ******************************************/
export function ProgramDayCard({ day }: Props) {
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(day, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `workout-day-${day.day}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={styles.programDayCard}>
      {/* Header */}
      <div className={styles.programDayCard__header}>
        <div>
          <div className={styles.programDayCard__badgeWrapper}>
            <span className={styles.programDayCard__badge}>
              Jour {day.day}
            </span>
          </div>
          <h3 className={styles.programDayCard__title}>{day.focus}</h3>
        </div>
        <div className={styles.programDayCard__iconWrapper}>
          <Dumbbell className={styles.programDayCard__icon} />
        </div>
      </div>

      {/* Metadata */}
      <div className={styles.programDayCard__metadata}>
        <div className={styles.programDayCard__metadataItem}>
          <Clock className={styles.programDayCard__metadataIcon} />
          <span className={styles.programDayCard__metadataText}>{day.duration_min} min</span>
        </div>
        <div className={styles.programDayCard__metadataItem}>
          <Flame className={styles.programDayCard__metadataIcon} />
          <span className={styles.programDayCard__metadataText}>{day.estimated_calories} kcal</span>
        </div>
      </div>

      {/* Equipment */}
      <div className={styles.programDayCard__section}>
        <p className={styles.programDayCard__sectionLabel}>Équipement</p>
        <div className={styles.programDayCard__equipmentList}>
          {day.equipment.length === 0 ? (
            <span className={styles.programDayCard__equipmentTag}>Aucun</span>
          ) : (
            day.equipment.map((eq: string, index: number) => (
              <span key={index} className={styles.programDayCard__equipmentTag}>
                {eq}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Warmup */}
      <div className={styles.programDayCard__section}>
        <p className={styles.programDayCard__sectionTitle}>Échauffement</p>
        <p className={styles.programDayCard__sectionText}>{day.warmup}</p>
      </div>

      {/* Exercises */}
      <div className={styles.programDayCard__section}>
        <p className={styles.programDayCard__sectionTitle}>Exercices</p>
        <div className={styles.programDayCard__exerciseList}>
          {day.exercises.map((ex: Exercise, index: number) => (
            <div key={index} className={styles.programDayCard__exerciseCard}>
              <p className={styles.programDayCard__exerciseName}>{ex.name}</p>
              <div className={styles.programDayCard__exerciseDetails}>
                <span>{ex.sets} × {ex.reps}</span>
                <span className={styles.programDayCard__separator}>•</span>
                <span>Repos: {ex.rest_sec}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooldown */}
      <div className={styles.programDayCard__section}>
        <p className={styles.programDayCard__sectionTitle}>Retour au calme</p>
        <p className={styles.programDayCard__sectionText}>{day.cooldown}</p>
      </div>

      {/* Action Button */}
      <div className={styles.programDayCard__actions}>
        <button onClick={handleDownloadJSON} className={styles.programDayCard__downloadButton}>
          <Download className={styles.programDayCard__buttonIcon} />
          Télécharger JSON
        </button>
      </div>
    </div>
  );
}
