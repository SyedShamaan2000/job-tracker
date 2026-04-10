import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../services/api";
import styles from "./AuthForm.module.css";

export default function AuthPage({ isLogin = true }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = isLogin
        ? await authService.login({
            email: formData.email,
            password: formData.password,
          })
        : await authService.register(formData);

      login(data);
      navigate("/"); // Redirect to dashboard immediately after login
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🎯</span>
          <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p>Manage your career journey effectively</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="name@company.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Get Started"}
          </button>
        </form>

        <p className={styles.footerText}>
          {isLogin ? "New here?" : "Already have an account?"}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? " Create an account" : " Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
