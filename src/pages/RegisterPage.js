// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styleSystem } from "../App";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "borrower",
    dateOfBirth: "",
    nationalId: ""
  });
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
      maxWidth: '450px',
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
    select: {
      padding: styleSystem.spacing.md,
      border: `1px solid ${styleSystem.colors.border}`,
      borderRadius: styleSystem.borderRadius.md,
      fontSize: styleSystem.typography.sizes.base,
      backgroundColor: styleSystem.colors.white,
      transition: styleSystem.transitions.default,
      outline: 'none',
      width: '100%',
      cursor: 'pointer',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed. Please try again.");
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
          <p style={styles.subtitle}>Create your account</p>
        </div>

        {error && (
          <div style={styles.error}>
            <span role="img" aria-label="error">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            <label htmlFor="role" style={styles.label}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="borrower">Borrower</option>
              <option value="lender">Lender</option>
            </select>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;