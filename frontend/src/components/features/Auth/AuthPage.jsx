import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../services/api";
import styles from "./AuthForm.module.css";

export default function AuthPage({ isLogin = true }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

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
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* Toggle Link Section */}
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Link
            to={isLogin ? "/register" : "/login"}
            className="ml-2 font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
