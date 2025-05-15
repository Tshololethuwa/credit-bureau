import React, { useState, useEffect } from "react";

function LoanHistoryPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [searchBorrowerId, setSearchBorrowerId] = useState("");
  const [creditScore, setCreditScore] = useState(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowers, setBorrowers] = useState([]);

  const calculateCreditScore = (loans) => {
    if (!loans.length) return 0;
    const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
    const totalPaid = loans.reduce((acc, loan) => acc + (loan.paidAmount || 0), 0);
    const totalRemaining = loans.reduce((acc, loan) => acc + (loan.amount - (loan.paidAmount || 0)), 0);

    const paymentHistoryScore = Math.min(100, (totalPaid / totalAmount) * 100);
    const remainingDebtScore = Math.max(0, 100 - (totalRemaining / totalAmount) * 100);

    return Math.round((paymentHistoryScore + remainingDebtScore) / 2);
  };

  const fetchLoanHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      console.log('Debug - Token:', token);
      console.log('Debug - User data:', userStr);

      let user;
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error('Debug - User parse error:', e);
        throw new Error("Invalid user data");
      }

      if (!token || !user || !user.id || !user.role) {
        console.error('Debug - Missing data:', { token: !!token, user: !!user, userId: user?.id, userRole: user?.role });
        throw new Error("Please log in to view loan history");
      }

      setRole(user.role);

      const res = await fetch("http://localhost:5000/api/loans/history", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Debug - Response status:', res.status);

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Session expired. Please log in again.");
        }
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch loan history");
      }

      const data = await res.json();
      console.log('Debug - Response data:', data);
      
      setLoans(data);

      if (data.length > 0) {
        const borrower = data[0].borrowerId;
        setBorrowerName(borrower?.name || "Unknown");
        const score = calculateCreditScore(data);
        setCreditScore(score);
      } else {
        setCreditScore(null);
        setBorrowerName("");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/reports/borrowers", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch borrowers");
      }

      const data = await res.json();
      setBorrowers(data);
    } catch (err) {
      console.error("Error fetching borrowers:", err);
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (searchBorrowerId.trim() !== "" && role !== "borrower") {
      fetchLoanHistory();
    }
  };

  useEffect(() => {
    fetchLoanHistory();
    // Fetch borrowers list if user is a lender
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "lender") {
      fetchBorrowers();
    }
  }, []);

  const thStyle = { padding: 10, border: "1px solid #ccc" };
  const tdStyle = { padding: 10, border: "1px solid #ccc" };

  const getCreditScoreColor = (score) => {
    if (score >= 80) return "#48bb78"; // green
    if (score >= 60) return "#ecc94b"; // yellow
    return "#f56565"; // red
  };

  const styles = {
    loanTerms: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
      border: '1px solid #e2e8f0',
    },
    termTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#2d3748',
    },
    termGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
    },
    termItem: {
      padding: '10px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    termLabel: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '5px',
    },
    termValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
    },
    statusApproved: {
      color: '#48bb78',
      fontWeight: 'bold',
    },
    statusPending: {
      color: '#ecc94b',
      fontWeight: 'bold',
    },
    statusRejected: {
      color: '#f56565',
      fontWeight: 'bold',
    },
    creditScoreContainer: {
      textAlign: "center",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
    creditScoreGauge: {
      width: "200px",
      height: "100px",
      margin: "20px auto",
      position: "relative",
      backgroundColor: "#f0f2f5",
      borderRadius: "100px 100px 0 0",
      overflow: "hidden",
    },
    creditScoreIndicator: (score) => ({
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      height: `${score}%`,
      backgroundColor: getCreditScoreColor(score),
      transition: "height 1s ease-out",
    }),
    creditScoreValue: {
      fontSize: "32px",
      fontWeight: "bold",
      marginTop: "10px",
      color: (score) => getCreditScoreColor(score),
    },
    loanCard: {
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      },
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      display: "inline-block",
      marginLeft: "10px",
    },
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: 30, fontFamily: "Arial, sans-serif" }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: 20 }}>
          Loan History {role === "borrower" ? "" : `(${role})`}
        </h2>

        {/* Search/Filter Section */}
        {role === "admin" && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <input
              type="text"
              placeholder="Enter Borrower ID"
              value={searchBorrowerId}
              onChange={(e) => setSearchBorrowerId(e.target.value)}
              style={{
                padding: 8,
                width: 200,
                marginRight: 10,
                borderRadius: 5,
                border: "1px solid #ccc"
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer"
              }}
            >
              Search
            </button>
          </div>
        )}

        {/* Dropdown for lenders */}
        {role === "lender" && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <select
              value={searchBorrowerId}
              onChange={(e) => {
                setSearchBorrowerId(e.target.value);
                handleSearch();
              }}
              style={{
                padding: 8,
                width: 300,
                borderRadius: 5,
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              <option value="">Select a Borrower</option>
              {borrowers.map((borrower) => (
                <option key={borrower.borrowerId} value={borrower.borrowerId}>
                  {borrower.borrowerName} ({borrower.borrowerEmail})
                </option>
              ))}
            </select>
          </div>
        )}

        {borrowerName && creditScore !== null && role === "borrower" && (
          <div style={styles.creditScoreContainer}>
            <div style={styles.creditScoreGauge}>
              <div style={styles.creditScoreIndicator(creditScore)} />
            </div>
            <div style={styles.creditScoreValue}>
              {creditScore}
              <span style={{ fontSize: "16px", color: "#666" }}>/100</span>
            </div>
            <div style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
              <strong>Factors Used in Calculation:</strong>
            </div>
            <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "14px", color: "#555" }}>
              <li>Payment History (50%): Based on ratio of total amount paid to total loan amount</li>
              <li>Remaining Debt (50%): Based on ratio of remaining debt to total loan amount</li>
            </ul>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ 
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p style={{ marginTop: "20px", color: "#666" }}>Loading your loan history...</p>
          </div>
        ) : error ? (
          <div style={{ 
            color: "#f56565",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#fff5f5",
            borderRadius: "8px",
            margin: "20px 0"
          }}>
            <svg style={{ width: "24px", height: "24px", marginBottom: "10px" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ padding: "30px" }}>
            {loans.map((loan) => (
              <div key={loan._id} style={{
                ...styles.loanTerms,
                ...styles.loanCard,
              }}>
                <div style={styles.termTitle}>
                  Loan Details - {new Date(loan.appliedAt).toLocaleDateString()}
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: loan.status === 'approved' ? '#c6f6d5' : 
                                   loan.status === 'pending' ? '#fefcbf' : '#fed7d7',
                    color: loan.status === 'approved' ? '#2f855a' :
                           loan.status === 'pending' ? '#975a16' : '#9b2c2c',
                  }}>
                    {loan.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={styles.termGrid}>
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Principal Amount</div>
                    <div style={styles.termValue}>${loan.amount.toLocaleString()}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Interest Rate</div>
                    <div style={styles.termValue}>{loan.interestRate ? `${loan.interestRate}% per year` : 'Not set'}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Duration</div>
                    <div style={styles.termValue}>{loan.durationMonths ? `${loan.durationMonths} months` : 'Not set'}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Monthly Payment</div>
                    <div style={styles.termValue}>{loan.monthlyPayment ? `$${loan.monthlyPayment.toLocaleString()}` : 'Not set'}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Total Amount to Pay</div>
                    <div style={styles.termValue}>{loan.totalAmount ? `$${loan.totalAmount.toLocaleString()}` : 'Not set'}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Amount Paid</div>
                    <div style={styles.termValue}>${(loan.paidAmount || 0).toLocaleString()}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Remaining Balance</div>
                    <div style={styles.termValue}>
                      ${(loan.totalAmount ? (loan.totalAmount - (loan.paidAmount || 0)) : (loan.amount - (loan.paidAmount || 0))).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Purpose</div>
                    <div style={styles.termValue}>{loan.purpose}</div>
                  </div>
                  
                  <div style={styles.termItem}>
                    <div style={styles.termLabel}>Lender</div>
                    <div style={styles.termValue}>
                      {loan.lenderId?.name || "Unknown Lender"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanHistoryPage;
