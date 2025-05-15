import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function LoanApprovalPage() {
  // Style system
  const styles = {
    container: {
      padding: "32px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    header: {
      textAlign: "center",
      color: "#1e293b",
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "32px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "24px",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    tableHeader: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "left",
    },
    tableCell: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
      color: "#475569",
    },
    tableCellCenter: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
      color: "#475569",
      textAlign: "center",
    },
    statusBadge: (status) => ({
      padding: "4px 12px",
      borderRadius: "12px",
      color: "white",
      backgroundColor: 
        status === "approved" ? "#22c55e" :
        status === "rejected" ? "#ef4444" :
        status === "pending" ? "#eab308" : "#64748b",
      fontWeight: "500",
      fontSize: "12px",
      textTransform: "capitalize",
      display: "inline-block",
    }),
    buttonContainer: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
    },
    button: (variant) => ({
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor:
        variant === "view" ? "#0ea5e9" :
        variant === "approve" ? "#22c55e" :
        variant === "reject" ? "#ef4444" :
        variant === "close" ? "#64748b" : "#2563eb",
      color: "white",
      '&:hover': {
        opacity: 0.9,
      },
    }),
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      maxWidth: "800px",
      width: "90%",
      maxHeight: "90vh",
      overflowY: "auto",
      zIndex: 1000,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999,
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: "1px solid #e2e8f0",
    },
    modalTitle: {
      margin: 0,
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      padding: "20px",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    statTitle: {
      margin: "0 0 12px 0",
      fontSize: "14px",
      fontWeight: "600",
      color: "#475569",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2563eb",
    },
    infoSection: {
      marginBottom: "24px",
    },
    infoTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "16px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    infoItem: {
      fontSize: "14px",
      color: "#475569",
    },
    infoLabel: {
      fontWeight: "500",
      color: "#64748b",
      marginRight: "8px",
    },
    historyTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "16px",
    },
    historyHeader: {
      backgroundColor: "#f8fafc",
      padding: "12px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#475569",
      textAlign: "left",
      borderBottom: "1px solid #e2e8f0",
    },
    historyCell: {
      padding: "12px",
      fontSize: "14px",
      color: "#475569",
      borderBottom: "1px solid #e2e8f0",
    },
    loadingText: {
      textAlign: "center",
      marginTop: "40px",
      color: "#64748b",
      fontSize: "16px",
    },
    emptyText: {
      textAlign: "center",
      padding: "24px",
      color: "#64748b",
      fontSize: "14px",
    },
    dashboardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    chartContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: "32px",
      height: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    chartTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    tableTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "16px",
    },
    th: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
      fontWeight: "500",
      color: "#475569",
    },
    tr: {
      borderBottom: "1px solid #e2e8f0",
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
      color: "#475569",
    },
    borrowerInfo: {
      display: "flex",
      alignItems: "center",
    },
    borrowerName: {
      fontWeight: "500",
      color: "#1e293b",
    },
    viewDetailsButton: {
      padding: "4px 8px",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#0ea5e9",
      color: "white",
      '&:hover': {
        opacity: 0.9,
      },
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    approveButton: {
      padding: "4px 8px",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#22c55e",
      color: "white",
      '&:hover': {
        opacity: 0.9,
      },
    },
    rejectButton: {
      padding: "4px 8px",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#ef4444",
      color: "white",
      '&:hover': {
        opacity: 0.9,
      },
    },
  };

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [borrowerDetails, setBorrowerDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  const calculateDashboardStats = (loansData) => {
    const stats = {
      totalLoans: loansData.length,
      pendingLoans: 0,
      approvedLoans: 0,
      rejectedLoans: 0,
      totalAmount: 0,
      averageAmount: 0
    };

    loansData.forEach(loan => {
      const status = loan.status?.toLowerCase() || 'pending';
      stats[status + 'Loans']++;
      stats.totalAmount += loan.amount;
    });

    stats.averageAmount = stats.totalAmount / (stats.totalLoans || 1);
    return stats;
  };

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user || !user.id) {
        alert("User not authenticated");
        setLoading(false);
        return;
      }

      const lenderId = user.id;

      const res = await fetch("http://localhost:5000/api/loans/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch loans");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        const filteredLoans = data.filter((loan) => {
          const lenderObject = loan.lenderId;
          return lenderObject && lenderObject._id === lenderId;
        });
        setLoans(filteredLoans);
        setDashboardStats(calculateDashboardStats(filteredLoans));
      } else {
        setLoans([]);
        setDashboardStats(calculateDashboardStats([]));
      }
    } catch (err) {
      console.error("Error fetching loans:", err);
      alert("Error fetching loans. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowerDetails = async (borrowerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/borrowers/${borrowerId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrower details");
      }

      const data = await response.json();
      setBorrowerDetails(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching borrower details:", err);
      alert(err.message);
    }
  };

  const handleViewDetails = (borrower) => {
    setSelectedBorrower(borrower);
    fetchBorrowerDetails(borrower._id);
  };

  const handleApprove = async (loanId) => {
    const token = localStorage.getItem("token");
    try {
      // Create a more user-friendly prompt for loan terms
      const confirmApproval = window.confirm(
        "Before approving the loan, you'll need to set the interest rate and loan duration. Would you like to proceed?"
      );

      if (!confirmApproval) {
        return;
      }

      // Get interest rate with validation
      let interestRate;
      while (true) {
        const rateInput = prompt(
          "Enter annual interest rate (as percentage):\nExample: 10 for 10% per year",
          "10"
        );
        
        if (rateInput === null) return; // User cancelled
        
        const rate = parseFloat(rateInput);
        if (!isNaN(rate) && rate >= 0 && rate <= 100) {
          interestRate = rate;
          break;
        }
        alert("Please enter a valid interest rate between 0 and 100");
      }

      // Get duration with validation
      let durationMonths;
      while (true) {
        const durationInput = prompt(
          "Enter loan duration in months:\nExample: 12 for 1 year",
          "12"
        );
        
        if (durationInput === null) return; // User cancelled
        
        const duration = parseInt(durationInput);
        if (!isNaN(duration) && duration > 0 && duration <= 360) { // Max 30 years
          durationMonths = duration;
          break;
        }
        alert("Please enter a valid duration between 1 and 360 months");
      }

      // Show summary before final approval
      const confirmTerms = window.confirm(
        `Please confirm the loan terms:\n\n` +
        `Interest Rate: ${interestRate}% per year\n` +
        `Duration: ${durationMonths} months\n\n` +
        `Would you like to approve the loan with these terms?`
      );

      if (!confirmTerms) {
        return;
      }

      const res = await fetch(`http://localhost:5000/api/loans/${loanId}/approve`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interestRate,
          durationMonths
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to approve");
      }

      const data = await res.json();
      alert(`Loan approved successfully!\n\nMonthly Payment: $${data.loan.monthlyPayment.toLocaleString()}\nTotal Amount to Pay: $${data.loan.totalAmount.toLocaleString()}`);
      fetchLoans();
    } catch (err) {
      console.error("Approve error:", err);
      alert(err.message);
    }
  };

  const handleReject = async (loanId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${loanId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reject");
      }
      alert("Loan rejected!");
      fetchLoans();
    } catch (err) {
      console.error("Reject error:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) {
    return <div style={styles.loadingText}>Loading loans...</div>;
  }

  const pieChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [
        dashboardStats.pendingLoans,
        dashboardStats.approvedLoans,
        dashboardStats.rejectedLoans
      ],
      backgroundColor: [
        '#eab308',
        '#22c55e',
        '#ef4444'
      ],
      borderColor: [
        '#fef9c3',
        '#dcfce7',
        '#fee2e2'
      ],
      borderWidth: 1,
    }],
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Loan Approval Dashboard</h2>

      <div style={styles.dashboardGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardStats.totalLoans}</div>
          <div style={styles.statLabel}>Total Loans</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${dashboardStats.totalAmount.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Amount</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${Math.round(dashboardStats.averageAmount).toLocaleString()}</div>
          <div style={styles.statLabel}>Average Loan Amount</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboardStats.pendingLoans}</div>
          <div style={styles.statLabel}>Pending Approvals</div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Loan Status Distribution</h3>
        <div style={{ flex: 1, maxWidth: "400px", margin: "0 auto" }}>
          <Pie 
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    font: {
                      size: 12,
                      family: 'Arial, sans-serif'
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Recent Loan Applications</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Borrower</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Interest Rate</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Monthly Payment</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applied At</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.borrowerInfo}>
                    <span style={styles.borrowerName}>
                      {loan.borrowerId?.name || "Unknown"}
                    </span>
                    <button
                      onClick={() => handleViewDetails(loan.borrowerId)}
                      style={styles.viewDetailsButton}
                    >
                      View Details
                    </button>
                  </div>
                </td>
                <td style={styles.td}>${loan.amount.toLocaleString()}</td>
                <td style={styles.td}>{loan.interestRate ? `${loan.interestRate}%` : 'Not set'}</td>
                <td style={styles.td}>{loan.durationMonths ? `${loan.durationMonths} months` : 'Not set'}</td>
                <td style={styles.td}>{loan.monthlyPayment ? `$${loan.monthlyPayment.toLocaleString()}` : 'Not set'}</td>
                <td style={styles.td}>{loan.totalAmount ? `$${loan.totalAmount.toLocaleString()}` : 'Not set'}</td>
                <td style={styles.td}>{loan.purpose}</td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(loan.status)}>
                    {loan.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(loan.appliedAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {loan.status === "pending" && (
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleApprove(loan._id)}
                        style={styles.approveButton}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan._id)}
                        style={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && borrowerDetails && (
        <>
          <div style={styles.overlay} onClick={() => setShowModal(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Borrower Details</h3>
              <button
                onClick={() => setShowModal(false)}
                style={styles.button("close")}
              >
                Close
              </button>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Credit Score</h4>
                <div style={styles.statValue}>
                  {borrowerDetails.creditScore}/100
                </div>
              </div>
              <div style={styles.statCard}>
                <h4 style={styles.statTitle}>Loan Statistics</h4>
                <div style={styles.infoItem}>Total Loans: {borrowerDetails.stats.totalLoans}</div>
                <div style={styles.infoItem}>Active Loans: {borrowerDetails.stats.activeLoans}</div>
                <div style={styles.infoItem}>Completed: {borrowerDetails.stats.completedLoans}</div>
                <div style={styles.infoItem}>Rejected: {borrowerDetails.stats.rejectedLoans}</div>
              </div>
            </div>

            <div style={styles.infoSection}>
              <h4 style={styles.infoTitle}>Personal Information</h4>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Name:</span>
                  {borrowerDetails.borrower.name}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email:</span>
                  {borrowerDetails.borrower.email}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone:</span>
                  {borrowerDetails.borrower.phone || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address:</span>
                  {borrowerDetails.borrower.address || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>National ID:</span>
                  {borrowerDetails.borrower.nationalId || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Date of Birth:</span>
                  {borrowerDetails.borrower.dateOfBirth ? 
                    new Date(borrowerDetails.borrower.dateOfBirth).toLocaleDateString() : 
                    "Not provided"}
                </div>
              </div>
            </div>

            <div style={styles.infoSection}>
              <h4 style={styles.infoTitle}>Employment Information</h4>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Employer:</span>
                  {borrowerDetails.borrower.employer || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Occupation:</span>
                  {borrowerDetails.borrower.occupation || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Employment Status:</span>
                  {borrowerDetails.borrower.employmentStatus || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Net Salary:</span>
                  {borrowerDetails.borrower.netSalary ? 
                    `$${borrowerDetails.borrower.netSalary}` : 
                    "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Employer Address:</span>
                  {borrowerDetails.borrower.employerAddress || "Not provided"}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Employer Phone:</span>
                  {borrowerDetails.borrower.employerPhone || "Not provided"}
                </div>
              </div>
            </div>

            <div style={styles.infoSection}>
              <h4 style={styles.infoTitle}>Recent Loan History</h4>
              <table style={styles.historyTable}>
                <thead>
                  <tr>
                    <th style={styles.historyHeader}>Amount</th>
                    <th style={styles.historyHeader}>Status</th>
                    <th style={styles.historyHeader}>Paid</th>
                    <th style={styles.historyHeader}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowerDetails.loanHistory.map((loan) => (
                    <tr key={loan._id}>
                      <td style={styles.historyCell}>${loan.amount}</td>
                      <td style={styles.historyCell}>
                        <span style={styles.statusBadge(loan.status)}>
                          {loan.status}
                        </span>
                      </td>
                      <td style={styles.historyCell}>${loan.paidAmount || 0}</td>
                      <td style={styles.historyCell}>
                        {new Date(loan.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LoanApprovalPage;
