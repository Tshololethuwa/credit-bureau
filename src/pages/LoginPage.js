// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styleSystem } from "../App";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: styleSystem.spacing.lg,
      backgroundColor: styleSystem.colors.background,
      backgroundImage: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)'
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: styleSystem.colors.white,
      borderRadius: styleSystem.borderRadius.lg,
      padding: styleSystem.spacing.xxl,
      boxShadow: styleSystem.shadows.lg,
      transform: 'translateY(-5vh)'
    },
    header: {
      textAlign: 'center',
      marginBottom: styleSystem.spacing.xl
    },
    logo: {
      fontSize: styleSystem.typography.sizes.xxl,
      fontWeight: styleSystem.typography.weights.bold,
      color: styleSystem.colors.primary,
      marginBottom: styleSystem.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: styleSystem.spacing.xs
    },
    subtitle: {
      color: styleSystem.colors.secondary,
      fontSize: styleSystem.typography.sizes.sm,
      marginBottom: styleSystem.spacing.lg
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: styleSystem.spacing.md
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: styleSystem.spacing.xs
    },
    label: {
      fontSize: styleSystem.typography.sizes.sm,
      color: styleSystem.colors.text,
      fontWeight: styleSystem.typography.weights.medium
    },
    input: {
      padding: styleSystem.spacing.md,
      border: `1px solid ${styleSystem.colors.border}`,
      borderRadius: styleSystem.borderRadius.md,
      fontSize: styleSystem.typography.sizes.base,
      transition: styleSystem.transitions.default,
      outline: 'none',
      width: '100%',
      '&:focus': {
        borderColor: styleSystem.colors.primary,
        boxShadow: `0 0 0 2px ${styleSystem.colors.primary}20`
      }
    },
    button: {
      padding: styleSystem.spacing.md,
      backgroundColor: styleSystem.colors.primary,
      color: styleSystem.colors.white,
      border: 'none',
      borderRadius: styleSystem.borderRadius.md,
      cursor: 'pointer',
      fontSize: styleSystem.typography.sizes.base,
      fontWeight: styleSystem.typography.weights.medium,
      transition: styleSystem.transitions.default,
      marginTop: styleSystem.spacing.sm,
      '&:hover': {
        backgroundColor: `${styleSystem.colors.primary}dd`
      },
      '&:disabled': {
        backgroundColor: styleSystem.colors.secondary,
        cursor: 'not-allowed'
      }
    },
    error: {
      backgroundColor: `${styleSystem.colors.error}15`,
      color: styleSystem.colors.error,
      padding: styleSystem.spacing.md,
      borderRadius: styleSystem.borderRadius.md,
      marginBottom: styleSystem.spacing.md,
      fontSize: styleSystem.typography.sizes.sm,
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.sm
    },
    footer: {
      marginTop: styleSystem.spacing.xl,
      textAlign: 'center',
      color: styleSystem.colors.secondary,
      fontSize: styleSystem.typography.sizes.sm
    },
    link: {
      color: styleSystem.colors.primary,
      textDecoration: 'none',
      fontWeight: styleSystem.typography.weights.medium,
      transition: styleSystem.transitions.default,
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

      const data = await response.json();

      if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
    } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.logo}>
            <span role="img" aria-label="bank">🏦</span>
            LoanHub
          </h1>
          <p style={styles.subtitle}>Welcome back! Please sign in to continue.</p>
        </div>

        {error && (
          <div style={styles.error}>
            <span role="img" aria-label="error">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
          <input
              type="email"
              id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
          <input
              type="password"
              id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = `${styleSystem.colors.primary}dd`;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styleSystem.colors.primary;
              }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;