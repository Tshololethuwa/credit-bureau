// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { styleSystem } from '../App';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const styles = {
    navbar: {
      backgroundColor: styleSystem.colors.white,
      padding: `${styleSystem.spacing.sm} 0`,
      borderBottom: `1px solid ${styleSystem.colors.border}`,
      boxShadow: styleSystem.shadows.sm,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${styleSystem.spacing.md} ${styleSystem.spacing.lg}`,
    },
    logo: {
      fontSize: styleSystem.typography.sizes.xl,
      fontWeight: styleSystem.typography.weights.bold,
      color: styleSystem.colors.primary,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.xs,
      transition: styleSystem.transitions.default,
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.md,
    },
    link: {
      color: styleSystem.colors.text,
      textDecoration: 'none',
      padding: `${styleSystem.spacing.xs} ${styleSystem.spacing.sm}`,
      borderRadius: styleSystem.borderRadius.sm,
      fontSize: styleSystem.typography.sizes.sm,
      fontWeight: styleSystem.typography.weights.medium,
      transition: styleSystem.transitions.default,
    },
    activeLink: {
      backgroundColor: `${styleSystem.colors.primary}15`,
      color: styleSystem.colors.primary,
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.md,
      marginLeft: styleSystem.spacing.xl,
    },
    userRole: {
      fontSize: styleSystem.typography.sizes.sm,
      color: styleSystem.colors.secondary,
      backgroundColor: `${styleSystem.colors.secondary}15`,
      padding: `${styleSystem.spacing.xs} ${styleSystem.spacing.sm}`,
      borderRadius: styleSystem.borderRadius.sm,
      textTransform: 'capitalize',
    },
    logoutButton: {
      padding: `${styleSystem.spacing.xs} ${styleSystem.spacing.md}`,
      backgroundColor: styleSystem.colors.error,
      color: styleSystem.colors.white,
      border: 'none',
      borderRadius: styleSystem.borderRadius.md,
      cursor: 'pointer',
      fontSize: styleSystem.typography.sizes.sm,
      fontWeight: styleSystem.typography.weights.medium,
      transition: styleSystem.transitions.default,
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.xs,
    },
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const renderNavLinks = () => {
    const role = user.role;
    const commonLinks = [
      <Link 
        key="profile" 
        to="/profile" 
        style={{
          ...styles.link,
          ...(isLinkActive('/profile') ? styles.activeLink : {})
        }}
      >
        Profile
      </Link>,
    ];

    if (role === 'borrower') {
      return [
        <Link 
          key="dashboard" 
          to="/dashboard" 
          style={{
            ...styles.link,
            ...(isLinkActive('/dashboard') ? styles.activeLink : {})
          }}
        >
          Dashboard
        </Link>,
        <Link 
          key="loan-application" 
          to="/loan-application" 
          style={{
            ...styles.link,
            ...(isLinkActive('/loan-application') ? styles.activeLink : {})
          }}
        >
          Apply for Loan
        </Link>,
        <Link 
          key="loan-history" 
          to="/loan-history" 
          style={{
            ...styles.link,
            ...(isLinkActive('/loan-history') ? styles.activeLink : {})
          }}
        >
          Loan History
        </Link>,
        ...commonLinks
      ];
    } else if (role === 'lender') {
      return [
        <Link 
          key="dashboard" 
          to="/dashboard" 
          style={{
            ...styles.link,
            ...(isLinkActive('/dashboard') ? styles.activeLink : {})
          }}
        >
          Dashboard
        </Link>,
        <Link 
          key="loan-approval" 
          to="/loan-approval" 
          style={{
            ...styles.link,
            ...(isLinkActive('/loan-approval') ? styles.activeLink : {})
          }}
        >
          Loan Requests
        </Link>,
        <Link 
          key="loan-history" 
          to="/loan-history" 
          style={{
            ...styles.link,
            ...(isLinkActive('/loan-history') ? styles.activeLink : {})
          }}
        >
          Loan History
        </Link>,
        <Link 
          key="reports" 
          to="/reports" 
          style={{
            ...styles.link,
            ...(isLinkActive('/reports') ? styles.activeLink : {})
          }}
        >
          Reports
        </Link>,
        ...commonLinks
      ];
    } else if (role === 'admin') {
      return [
        <Link 
          key="dashboard" 
          to="/dashboard" 
          style={{
            ...styles.link,
            ...(isLinkActive('/dashboard') ? styles.activeLink : {})
          }}
        >
          Dashboard
        </Link>,
        <Link 
          key="users" 
          to="/admin/users" 
          style={{
            ...styles.link,
            ...(isLinkActive('/admin/users') ? styles.activeLink : {})
          }}
        >
          User Management
        </Link>,
        <Link 
          key="reports" 
          to="/reports" 
          style={{
            ...styles.link,
            ...(isLinkActive('/reports') ? styles.activeLink : {})
          }}
        >
          Reports
        </Link>,
        ...commonLinks
      ];
    }
    return [];
  };

  if (!user.role) return null;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.logo}>
          <span role="img" aria-label="bank">🏦</span>
          LoanHub
        </Link>
        <div style={styles.nav}>
          {renderNavLinks()}
          <div style={styles.userInfo}>
            <span style={styles.userRole}>{user.role}</span>
            <button 
              onClick={handleLogout} 
              style={styles.logoutButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${styleSystem.colors.error}dd`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.error;
              }}
            >
              <span role="img" aria-label="logout">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;