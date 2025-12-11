"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, signup } from "../api";
import { setToken } from "@/lib/authStorage";
import { Mail, Lock} from "lucide-react";
import styles from "./AuthForm.module.css";

/******************************************
 * Props for AuthForm component
 * - `mode` : `login` or `signup` to determine the form mode
 ******************************************/
type AuthFormProps = {
  mode: "login" | "signup";
};

/******************************************
 * AuthForm component for login and signup
 * @param mode - Form mode: 'login' or 'signup'
 * @return JSX.Element representing the authentication form
 ******************************************/
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const token = await login(email, password);
        setToken(token.access_token);
        router.push("/dashboard");
      } else {
        await signup(email, password);
        router.push("/login");
      }
    } catch (err) {
      const error = err as { status?: number; message?: string };
      if (error.status === 401) setError("Email ou mot de passe incorrect.");
      else if (error.status === 409) setError("Email déjà utilisé.");
      else setError("Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authForm}>
      <div className={styles.authForm__card}>
        <h2 className={styles.authForm__title}>{mode === "login" ? "Connexion" : "Inscription"}</h2>
        <form onSubmit={handleSubmit} className={styles.authForm__form}>
          {/* Email Field */}
          <div className={styles.authForm__field}>
            <label htmlFor="email" className={styles.authForm__label}>Email</label>
            <div className={styles.authForm__inputWrapper}>
              <Mail className={styles.authForm__icon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className={styles.authForm__input}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className={styles.authForm__field}>
            <label htmlFor="password" className={styles.authForm__label}>Mot de passe</label>
            <div className={styles.authForm__inputWrapper}>
              <Lock className={styles.authForm__icon} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={styles.authForm__input}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.authForm__error}>
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.authForm__submit}
          >
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        
        {/* Switch Mode Link */}
        <div className={styles.authForm__switch}>
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <Link href="/signup" className={styles.authForm__link}>
                S&apos;inscrire
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <Link href="/login" className={styles.authForm__link}>
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
