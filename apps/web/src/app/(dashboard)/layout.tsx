"use client";

import { useEffect } from "react";
import { useAuthUser } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { User} from "lucide-react";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, error } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.push("/login");
    }
  }, [user, loading, error, router]);


  if (!user || error) {
    return null;
  }

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.dashboardLayout__wrapper}>
        {/* Header Section */}
        <header className={styles.dashboardLayout__header}>
          <div className={styles.dashboardLayout__userSection}>
            <div className={styles.dashboardLayout__avatar}>
              <User className={styles.dashboardLayout__avatarIcon} />
            </div>
            <div className={styles.dashboardLayout__userInfo}>
              <p className={styles.dashboardLayout__userLabel}>Connecté en tant que</p>
              <p className={styles.dashboardLayout__userEmail}>{user?.email || "Utilisateur"}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.dashboardLayout__content}>
          {children}
        </main>
      </div>
    </div>
  );
}
