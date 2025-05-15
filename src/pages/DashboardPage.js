import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalAmount: 0,
    creditScore: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!user) {
    navigate("/");
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = {
    borrower: [
      { title: "Apply for Loan", path: "/loan-application", color: "#4299e1" },
      { title: "View Loan History", path: "/loan-history", color: "#48bb78" },
      { title: "Make Payment", path: "/loan-application", color: "#ed8936" },
      { title: "Check Credit Score", path: "/loan-history", color: "#667eea" }
    ],
    lender: [
      { title: "Review Applications", path: "/loan-approval", color: "#4299e1" },
      { title: "Active Loans", path: "/loan-history", color: "#48bb78" },
      { title: "Performance Report", path: "/reports", color: "#ed8936" },
      { title: "Risk Analysis", path: "/reports", color: "#667eea" }
    ],
    admin: [
      { title: "User Management", path: "/admin/users", color: "#4299e1" },
      { title: "System Reports", path: "/reports", color: "#48bb78" },
      { title: "Settings", path: "/admin/settings", color: "#667eea" }
    ]
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ 
        width: "50px", 
        height: "50px", 
        borderRadius: "10px", 
        background: `${color}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: "0", color: "#2d3748", fontSize: "24px" }}>{value}</h3>
        <p style={{ margin: "5px 0 0", color: "#718096", fontSize: "14px" }}>{title}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar with quick navigation */}
      <div
        style={{
          width: "220px",
          background: "#2d3748",
          padding: "20px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <h3 style={{ margin: "0", fontSize: "20px", padding: "10px 0" }}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
        </h3>

        <div style={{ flex: 1 }}>
          {quickActions[user.role].map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "5px 0",
                background: "transparent",
                border: "none",
                borderRadius: "6px",
                color: "white",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#4a5568"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {action.title}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          style={{
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            background: "#e53e3e",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.2s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#c53030"}
          onMouseLeave={e => e.currentTarget.style.background = "#e53e3e"}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", backgroundColor: "#f7fafc", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ color: "#2d3748", marginBottom: "10px", fontSize: "28px" }}>
            {getGreeting()}, {user.name}!
          </h2>
          <p style={{ color: "#718096", marginBottom: "30px" }}>
            Here's what's happening with your account today
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ 
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3182ce",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                margin: "0 auto",
                animation: "spin 1s linear infinite"
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <>
              {/* Statistics Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "20px",
                marginBottom: "40px"
              }}>
                {user.role === "borrower" && stats.creditScore && (
                  <StatCard
                    title="Credit Score"
                    value={stats.creditScore}
                    icon="⭐"
                    color="#667eea"
                  />
                )}
              </div>

              {/* Quick Actions Grid */}
              <h3 style={{ color: "#2d3748", marginBottom: "20px" }}>Quick Actions</h3>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px"
              }}>
                {quickActions[user.role].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    style={{
                      padding: "20px",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ 
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: `${action.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: action.color,
                      marginBottom: "5px"
                    }}>
                      {action.title[0]}
                    </div>
                    <span style={{ color: "#2d3748", fontWeight: "500" }}>{action.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
