// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoanHistoryPage from "./pages/LoanHistoryPage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import LoanApprovalPage from "./pages/LoanApprovalPage";
import ReportsPage from "./pages/ReportsPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilePage";

// Basic style constants
export const styleSystem = {
  colors: {
    primary: '#1976d2',
    secondary: '#666666',
    background: '#f5f5f5',
    text: '#333333',
    error: '#d32f2f',
    success: '#2e7d32',
    white: '#ffffff',
    border: '#e0e0e0',
    danger: '#dc3545'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  typography: {
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: 'all 0.3s ease'
  }
};

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: styleSystem.colors.background,
        color: styleSystem.colors.text
      }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/loan-history" element={<LoanHistoryPage />} />
          <Route path="/loan-application" element={<LoanApplicationPage />} />
          <Route path="/loan-approval" element={<LoanApprovalPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          {/* Catch any other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;