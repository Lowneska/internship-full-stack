"use client";

import { useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className={styles.dashboardPage}>
      {/* Main Content */}
      <div className={styles.dashboardPage__card}>
        <div className={styles.dashboardPage__header}>
          <div className={styles.dashboardPage__iconWrapper}>
            <Dumbbell className={styles.dashboardPage__icon} />
          </div>
          <h1 className={styles.dashboardPage__title}>Générateur de Programme Sportif</h1>
          <p className={styles.dashboardPage__subtitle}>
            Créez un programme d&apos;entraînement personnalisé adapté à vos objectifs
          </p>
        </div>

        {/* Generate Button */}
        <div className={styles.dashboardPage__actions}>
          <button
            onClick={() => router.push("/program")}
            className={styles.dashboardPage__generateButton}
          >
            Générer un Programme
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.dashboardPage__footer}>
        <p>Votre programme sera personnalisé en fonction de vos objectifs et de votre niveau</p>
      </div>
    </div>
  );
}
