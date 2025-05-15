import React, { useState, useEffect } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { styleSystem } from "../App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ReportsPage() {
  const styles = {
    container: {
      padding: styleSystem.spacing.xl,
      backgroundColor: styleSystem.colors.background,
      minHeight: '100vh',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: styleSystem.spacing.xl,
    },
    title: {
      fontSize: styleSystem.typography.sizes.xxl,
      fontWeight: styleSystem.typography.weights.bold,
      color: styleSystem.colors.text,
      marginBottom: styleSystem.spacing.sm,
    },
    subtitle: {
      fontSize: styleSystem.typography.sizes.base,
      color: styleSystem.colors.secondary,
      marginBottom: styleSystem.spacing.xl,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: styleSystem.spacing.lg,
      marginBottom: styleSystem.spacing.xxl,
    },
    statCard: {
      backgroundColor: styleSystem.colors.white,
      padding: styleSystem.spacing.lg,
      borderRadius: styleSystem.borderRadius.lg,
      boxShadow: styleSystem.shadows.sm,
      transition: styleSystem.transitions.default,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: styleSystem.shadows.md,
      },
    },
    statTitle: {
      fontSize: styleSystem.typography.sizes.sm,
      color: styleSystem.colors.secondary,
      marginBottom: styleSystem.spacing.xs,
    },
    statValue: {
      fontSize: styleSystem.typography.sizes.xl,
      fontWeight: styleSystem.typography.weights.bold,
      color: styleSystem.colors.primary,
    },
    chartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: styleSystem.spacing.xl,
      marginBottom: styleSystem.spacing.xxl,
    },
    chartCard: {
      backgroundColor: styleSystem.colors.white,
      padding: styleSystem.spacing.xl,
      borderRadius: styleSystem.borderRadius.lg,
      boxShadow: styleSystem.shadows.sm,
      height: '300px',
    },
    chartTitle: {
      fontSize: styleSystem.typography.sizes.lg,
      fontWeight: styleSystem.typography.weights.semibold,
      color: styleSystem.colors.text,
      marginBottom: styleSystem.spacing.lg,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: styleSystem.colors.white,
      borderRadius: styleSystem.borderRadius.lg,
      overflow: 'hidden',
      boxShadow: styleSystem.shadows.sm,
    },
    th: {
      padding: styleSystem.spacing.md,
      backgroundColor: `${styleSystem.colors.primary}10`,
      color: styleSystem.colors.text,
      fontSize: styleSystem.typography.sizes.sm,
      fontWeight: styleSystem.typography.weights.semibold,
      textAlign: 'left',
      borderBottom: `1px solid ${styleSystem.colors.border}`,
    },
    td: {
      padding: styleSystem.spacing.md,
      fontSize: styleSystem.typography.sizes.sm,
      color: styleSystem.colors.text,
      borderBottom: `1px solid ${styleSystem.colors.border}`,
    },
    creditScoreCell: {
      display: 'flex',
      alignItems: 'center',
      gap: styleSystem.spacing.sm,
    },
    creditScoreBadge: (score) => ({
      padding: `${styleSystem.spacing.xs} ${styleSystem.spacing.sm}`,
      borderRadius: styleSystem.borderRadius.sm,
      fontSize: styleSystem.typography.sizes.sm,
      fontWeight: styleSystem.typography.weights.medium,
      backgroundColor: score >= 70 
        ? `${styleSystem.colors.success}15`
        : score >= 40
        ? `${styleSystem.colors.primary}15`
        : `${styleSystem.colors.error}15`,
      color: score >= 70
        ? styleSystem.colors.success
        : score >= 40
        ? styleSystem.colors.primary
        : styleSystem.colors.error,
    }),
    filterSection: {
      marginBottom: styleSystem.spacing.xl,
      display: 'flex',
      gap: styleSystem.spacing.md,
      alignItems: 'center',
    },
    select: {
      padding: `${styleSystem.spacing.sm} ${styleSystem.spacing.md}`,
      borderRadius: styleSystem.borderRadius.md,
      border: `1px solid ${styleSystem.colors.border}`,
      fontSize: styleSystem.typography.sizes.sm,
      color: styleSystem.colors.text,
      backgroundColor: styleSystem.colors.white,
      cursor: 'pointer',
      outline: 'none',
      transition: styleSystem.transitions.default,
      '&:focus': {
        borderColor: styleSystem.colors.primary,
        boxShadow: `0 0 0 2px ${styleSystem.colors.primary}20`,
      },
    },
    button: {
      padding: `${styleSystem.spacing.sm} ${styleSystem.spacing.md}`,
      backgroundColor: styleSystem.colors.primary,
      color: styleSystem.colors.white,
      border: 'none',
      borderRadius: styleSystem.borderRadius.md,
      fontSize: styleSystem.typography.sizes.sm,
      fontWeight: styleSystem.typography.weights.medium,
      cursor: 'pointer',
      transition: styleSystem.transitions.default,
      '&:hover': {
        backgroundColor: `${styleSystem.colors.primary}dd`,
      },
    },
    noDataMessage: {
      textAlign: 'center',
      padding: styleSystem.spacing.xl,
      color: styleSystem.colors.secondary,
      fontSize: styleSystem.typography.sizes.lg,
    },
    loadingText: {
      textAlign: 'center',
      color: styleSystem.colors.secondary,
      fontSize: '1rem',
      padding: styleSystem.spacing.large
    },
    viewButton: {
      padding: styleSystem.spacing.small,
      backgroundColor: styleSystem.colors.primary,
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.875rem',
      cursor: 'pointer'
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: styleSystem.spacing.large,
      borderRadius: '4px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '1000px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: styleSystem.spacing.medium,
      paddingBottom: styleSystem.spacing.small,
      borderBottom: '1px solid #ddd',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: styleSystem.colors.text,
    },
    closeButton: {
      padding: styleSystem.spacing.small,
      backgroundColor: 'transparent',
      border: 'none',
      color: styleSystem.colors.text,
      cursor: 'pointer',
      fontSize: '1.25rem',
      lineHeight: 1,
      transition: 'all 0.2s ease',
      borderRadius: '50%',
      '&:hover': {
        color: styleSystem.colors.primary,
        backgroundColor: styleSystem.colors.background,
      },
    },
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: styleSystem.spacing.medium,
      marginBottom: styleSystem.spacing.large,
    },
    summaryCard: {
      backgroundColor: '#fff',
      padding: styleSystem.spacing.medium,
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
    summaryLabel: {
      fontSize: '0.875rem',
      color: styleSystem.colors.text,
      marginBottom: '4px',
    },
    summaryValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: styleSystem.colors.primary
    },
    summarySubtext: {
      fontSize: '0.875rem',
      color: styleSystem.colors.text,
      marginTop: '4px',
    },
    trendPositive: {
      color: '#059669',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: '#ecfdf5',
      padding: '4px 8px',
      borderRadius: '4px',
      marginTop: '4px',
    },
    trendNegative: {
      color: '#dc2626',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: '#fef2f2',
      padding: '4px 8px',
      borderRadius: '4px',
      marginTop: '4px',
    },
  };

  const [lenderReport, setLenderReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLender, setSelectedLender] = useState(null);
  const [borrowersData, setBorrowersData] = useState([]);
  const [showBorrowersModal, setShowBorrowersModal] = useState(false);
  const [loadingBorrowers, setLoadingBorrowers] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [borrowerSummary, setBorrowerSummary] = useState(null);

  const fetchLenderReport = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/reports/lenders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
        setLenderReport(data);
        if (searchQuery) {
          const filtered = data.filter(lender =>
            lender.lenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lender.lenderEmail.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredReport(filtered);
          processChartData(filtered);
        } else {
      setFilteredReport(data);
      processChartData(data);
        }
    } else {
        alert("Failed to fetch lender report: " + data.message);
      }
    } catch (err) {
      alert("An error occurred while fetching the report");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (reportData) => {
    // Total loans amount per lender
    const lenderLoanAmounts = {};
    reportData.forEach(lender => {
      lenderLoanAmounts[lender.lenderName] = lender.totalLoansAmount;
    });

    const barChartData = {
      labels: Object.keys(lenderLoanAmounts),
      datasets: [{
        label: 'Total Loan Amount',
        data: Object.values(lenderLoanAmounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        maxBarThickness: 50,
      }],
    };

    // Total remaining amount per lender
    const lenderRemainingAmounts = {};
    reportData.forEach(lender => {
      lenderRemainingAmounts[lender.lenderName] = lender.totalRemainingAmount;
    });

    const remainingBarChartData = {
      labels: Object.keys(lenderRemainingAmounts),
      datasets: [{
        label: 'Total Outstanding Amount',
        data: Object.values(lenderRemainingAmounts),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        maxBarThickness: 50,
      }],
    };

    // Aggregate loan statuses across all lenders
    const totalStatusCounts = reportData.reduce((counts, lender) => {
      Object.entries(lender.loanStatuses).forEach(([status, count]) => {
        counts[status] = (counts[status] || 0) + count;
      });
      return counts;
    }, {});

    const pieChartData = {
      labels: Object.keys(totalStatusCounts),
      datasets: [{
        data: Object.values(totalStatusCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      }],
    };

    setChartData({
      barChart: barChartData,
      remainingBarChart: remainingBarChartData,
      pieChart: pieChartData,
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (lenderReport.length > 0) {
      const filtered = lenderReport.filter(lender =>
        lender.lenderName.toLowerCase().includes(query) ||
        lender.lenderEmail.toLowerCase().includes(query)
      );
    setFilteredReport(filtered);
    processChartData(filtered);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Math.round(value);
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Number of Borrowers: ${context.parsed.y}`;
          }
        }
      }
    }
  };

  const fetchBorrowersForLender = async (lenderId, lenderName) => {
    setLoadingBorrowers(true);
    const token = localStorage.getItem("token");

    try {
      // Fetch all loans for this lender
      const loansRes = await fetch(`http://localhost:5000/api/loans/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!loansRes.ok) {
        throw new Error("Failed to fetch loans");
      }

      const loansData = await loansRes.json();
      const lenderLoans = loansData.filter(loan => loan.lenderId?._id === lenderId);

      // Get unique borrower IDs
      const borrowerIds = [...new Set(lenderLoans.map(loan => loan.borrowerId?._id))];

      // Fetch details for each borrower
      const borrowersWithScores = await Promise.all(
        borrowerIds.map(async (borrowerId) => {
          const res = await fetch(`http://localhost:5000/api/borrowers/${borrowerId}/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch borrower details for ID: ${borrowerId}`);
          }

          const data = await res.json();
          const borrowerLoans = lenderLoans.filter(loan => loan.borrowerId?._id === borrowerId);
          
          return {
            borrowerId: borrowerId,
            name: data.borrower.name,
            email: data.borrower.email,
            creditScore: data.creditScore,
            totalLoans: borrowerLoans.length,
            activeLoans: borrowerLoans.filter(loan => loan.status === 'approved' && loan.amount > (loan.paidAmount || 0)).length,
            totalAmount: borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0),
            totalPaid: borrowerLoans.reduce((sum, loan) => sum + (loan.paidAmount || 0), 0),
          };
        })
      );

      setSelectedLender({ id: lenderId, name: lenderName });
      setBorrowersData(borrowersWithScores);
      setShowBorrowersModal(true);
    } catch (err) {
      console.error("Error fetching borrowers:", err);
      alert("Failed to fetch borrowers data");
    } finally {
      setLoadingBorrowers(false);
    }
  };

  const fetchBorrowerSummary = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      // Fetch all loans for this lender
      const loansRes = await fetch(`http://localhost:5000/api/loans/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!loansRes.ok) {
        throw new Error("Failed to fetch loans");
      }

      const loansData = await loansRes.json();
      const lenderLoans = loansData.filter(loan => loan.lenderId?._id === user.id);

      // Get unique borrower IDs
      const borrowerIds = [...new Set(lenderLoans.map(loan => loan.borrowerId?._id))];

      // Fetch details for each borrower
      const borrowersWithScores = await Promise.all(
        borrowerIds.map(async (borrowerId) => {
          const res = await fetch(`http://localhost:5000/api/borrowers/${borrowerId}/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch borrower details for ID: ${borrowerId}`);
          }

          return await res.json();
        })
      );

      // Calculate summary statistics
      const summary = {
        totalBorrowers: borrowerIds.length,
        totalLoans: lenderLoans.length,
        totalAmount: lenderLoans.reduce((sum, loan) => sum + loan.amount, 0),
        totalPaid: lenderLoans.reduce((sum, loan) => sum + (loan.paidAmount || 0), 0),
        averageCreditScore: Math.round(
          borrowersWithScores.reduce((sum, b) => sum + b.creditScore, 0) / borrowersWithScores.length
        ),
        activeLoans: lenderLoans.filter(loan => 
          loan.status === 'approved' && loan.amount > (loan.paidAmount || 0)
        ).length,
        completedLoans: lenderLoans.filter(loan => 
          loan.amount <= (loan.paidAmount || 0)
        ).length,
        defaultRate: (
          lenderLoans.filter(loan => 
            loan.status === 'approved' && 
            loan.amount > (loan.paidAmount || 0) && 
            new Date(loan.appliedAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length / Math.max(1, lenderLoans.filter(loan => loan.status === 'approved').length)
        ) * 100,
        borrowers: borrowersWithScores,
      };

      setBorrowerSummary(summary);
      processChartDataForLender(summary);
    } catch (err) {
      console.error("Error fetching borrower summary:", err);
      alert("Failed to fetch borrower summary");
    } finally {
      setLoading(false);
    }
  };

  const processChartDataForLender = (summary) => {
    // Loan Status Distribution
    const statusCounts = summary.borrowers.reduce((acc, borrower) => {
      borrower.loanHistory.forEach(loan => {
        acc[loan.status] = (acc[loan.status] || 0) + 1;
      });
      return acc;
    }, {});

    const pieChartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(0, 188, 212, 0.6)',  // Aqua
          'rgba(0, 229, 255, 0.6)',  // Lighter aqua
          'rgba(0, 172, 193, 0.6)',  // Darker aqua
          'rgba(128, 222, 234, 0.6)', // Light aqua
        ],
        borderColor: [
          'rgba(0, 188, 212, 1)',    // Aqua
          'rgba(0, 229, 255, 1)',    // Lighter aqua
          'rgba(0, 172, 193, 1)',    // Darker aqua
          'rgba(128, 222, 234, 1)',  // Light aqua
        ],
        borderWidth: 1,
      }],
    };

    // Credit Score Distribution
    const creditScores = summary.borrowers.map(b => b.creditScore);
    const creditScoreRanges = {
      'Excellent (80-100)': creditScores.filter(score => score >= 80).length,
      'Good (60-79)': creditScores.filter(score => score >= 60 && score < 80).length,
      'Fair (40-59)': creditScores.filter(score => score >= 40 && score < 60).length,
      'Poor (0-39)': creditScores.filter(score => score < 40).length,
    };

    const creditScoreChart = {
      labels: Object.keys(creditScoreRanges),
      datasets: [{
        label: 'Number of Borrowers',
        data: Object.values(creditScoreRanges),
        backgroundColor: 'rgba(0, 188, 212, 0.6)',  // Aqua
        borderColor: 'rgba(0, 188, 212, 1)',        // Aqua
        borderWidth: 1,
        maxBarThickness: 50,
      }],
    };

    setChartData({
      pieChart: pieChartData,
      barChart: creditScoreChart,
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);

    if (user.role === 'lender') {
      fetchBorrowerSummary();
    } else if (user.role === 'admin') {
      fetchLenderReport();
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          {userRole === 'admin' ? 'Lender Performance Report' : 'Borrower Summary Report'}
        </h1>

        {userRole === 'lender' && borrowerSummary && (
          <>
            <div style={styles.summaryCards}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Total Borrowers</div>
                <div style={styles.summaryValue}>{borrowerSummary.totalBorrowers}</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Active Loans</div>
                <div style={styles.summaryValue}>{borrowerSummary.activeLoans}</div>
                <div style={styles.summarySubtext}>
                  {borrowerSummary.completedLoans} loans completed
                </div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Total Amount Lent</div>
                <div style={styles.summaryValue}>
                  ${borrowerSummary.totalAmount.toLocaleString()}
                </div>
                <div style={styles.summarySubtext}>
                  ${borrowerSummary.totalPaid.toLocaleString()} repaid
                </div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Average Credit Score</div>
                <div style={styles.summaryValue}>{borrowerSummary.averageCreditScore}</div>
                <div 
                  style={
                    borrowerSummary.averageCreditScore >= 60 
                      ? styles.trendPositive 
                      : styles.trendNegative
                  }
                >
                  {borrowerSummary.averageCreditScore >= 60 ? '↑ Good' : '↓ Needs Improvement'}
                </div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Default Rate</div>
                <div style={styles.summaryValue}>
                  {borrowerSummary.defaultRate.toFixed(1)}%
                </div>
                <div 
                  style={
                    borrowerSummary.defaultRate <= 5 
                      ? styles.trendPositive 
                      : styles.trendNegative
                  }
                >
                  {borrowerSummary.defaultRate <= 5 ? '↓ Low Risk' : '↑ High Risk'}
                </div>
              </div>
            </div>

            {chartData && (
              <div style={styles.chartGrid}>
                <div style={styles.chartCard}>
                  <h2 style={styles.chartTitle}>Loan Status Distribution</h2>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <Pie 
                      data={chartData.pieChart} 
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 8,
                              font: {
                                size: 11
                              }
                            }
                          }
                        }
                      }} 
                    />
      </div>
          </div>
                <div style={styles.chartCard}>
                  <h2 style={styles.chartTitle}>Credit Score Distribution</h2>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <Bar data={chartData.barChart} options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                              size: 11
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }} />
          </div>
          </div>
        </div>
      )}

            <div style={{ marginTop: styleSystem.spacing.xl }}>
              <h2 style={styles.chartTitle}>Borrower Details</h2>
              <table style={styles.table}>
            <thead>
              <tr>
                    <th style={styles.th}>Borrower Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Credit Score</th>
                    <th style={styles.th}>Total Loans</th>
                    <th style={styles.th}>Active Loans</th>
                    <th style={styles.th}>Completed Loans</th>
                    <th style={styles.th}>Total Amount</th>
                    <th style={styles.th}>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
                  {borrowerSummary.borrowers.map(borrower => (
                    <tr key={borrower.borrower._id}>
                      <td style={styles.td}>{borrower.borrower.name}</td>
                      <td style={styles.td}>{borrower.borrower.email}</td>
                      <td style={styles.td}>
                        <div style={styles.creditScoreCell}>
                          <span style={styles.creditScoreBadge(borrower.creditScore)}>
                            {borrower.creditScore}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>{borrower.stats.totalLoans}</td>
                      <td style={styles.td}>{borrower.stats.activeLoans}</td>
                      <td style={styles.td}>{borrower.stats.completedLoans}</td>
                      <td style={styles.td}>
                        ${borrower.loanHistory.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        ${borrower.loanHistory.reduce((sum, loan) => sum + (loan.paidAmount || 0), 0).toLocaleString()}
                      </td>
                  </tr>
                  ))}
            </tbody>
          </table>
            </div>
          </>
        )}

        {userRole === 'admin' && (
          <div style={styles.filterSection}>
            <input
              type="text"
              placeholder="Search by lender name or email"
              value={searchQuery}
              onChange={handleSearch}
              style={styles.select}
            />

            <button 
              onClick={fetchLenderReport} 
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Generating Report..." : "Generate Lender Report"}
          </button>
        </div>
      )}

        {loading && <p style={styles.loadingText}>Loading report data...</p>}

        {!loading && userRole === 'lender' && !borrowerSummary && (
          <div style={styles.noDataMessage}>
            <p>No borrower data available.</p>
          </div>
        )}

        {!loading && userRole === 'admin' && filteredReport.length > 0 && (
          <>
            <div style={styles.chartGrid}>
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>Total Loan Amount by Lender</h2>
                <div style={{ height: '200px', position: 'relative' }}>
                  <Bar data={chartData.barChart} options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          font: {
                            size: 11
                          },
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          boxWidth: 12,
                          padding: 8,
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Total Amount: $${context.parsed.y.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>Outstanding Amount by Lender</h2>
                <div style={{ height: '200px', position: 'relative' }}>
                  <Bar data={chartData.remainingBarChart} options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          font: {
                            size: 11
                          },
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          boxWidth: 12,
                          padding: 8,
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Outstanding Amount: $${context.parsed.y.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: styleSystem.spacing.xl }}>
              <h2 style={styles.chartTitle}>Lender Performance Details</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Lender Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Total Loans</th>
                    <th style={styles.th}>Total Amount</th>
                    <th style={styles.th}>Amount Paid</th>
                    <th style={styles.th}>Outstanding</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReport.map(lender => (
                    <tr key={lender.lenderId}>
                      <td style={styles.td}>{lender.lenderName}</td>
                      <td style={styles.td}>{lender.lenderEmail}</td>
                      <td style={styles.td}>{lender.totalLoans}</td>
                      <td style={styles.td}>${lender.totalLoansAmount.toLocaleString()}</td>
                      <td style={styles.td}>${lender.totalPaidAmount.toLocaleString()}</td>
                      <td style={styles.td}>${lender.totalRemainingAmount.toLocaleString()}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => fetchBorrowersForLender(lender.lenderId, lender.lenderName)}
          style={{
                            ...styles.button,
                            padding: `${styleSystem.spacing.xs} ${styleSystem.spacing.sm}`,
                            fontSize: styleSystem.typography.sizes.sm,
                          }}
                          disabled={loadingBorrowers}
                        >
                          View Borrowers
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && userRole === 'admin' && filteredReport.length === 0 && (
          <div style={styles.noDataMessage}>
            <p>No lender data available. Click "Generate Lender Report" to load the data.</p>
        </div>
      )}

        {showBorrowersModal && selectedLender && (
          <>
            <div style={styles.modalOverlay} onClick={() => setShowBorrowersModal(false)} />
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  Borrowers for {selectedLender.name}
                </h3>
                <button
                  style={styles.closeButton}
                  onClick={() => setShowBorrowersModal(false)}
                >
                  ×
                </button>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Borrower Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Credit Score</th>
                    <th style={styles.th}>Total Loans</th>
                    <th style={styles.th}>Active Loans</th>
                    <th style={styles.th}>Total Amount</th>
                    <th style={styles.th}>Total Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowersData.map(borrower => (
                    <tr key={borrower.borrowerId}>
                      <td style={styles.td}>{borrower.name}</td>
                      <td style={styles.td}>{borrower.email}</td>
                      <td style={styles.td}>
                        <div style={styles.creditScoreCell}>
                          <span style={styles.creditScoreBadge(borrower.creditScore)}>
                            {borrower.creditScore}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>{borrower.totalLoans}</td>
                      <td style={styles.td}>{borrower.activeLoans}</td>
                      <td style={styles.td}>${borrower.totalAmount.toLocaleString()}</td>
                      <td style={styles.td}>${borrower.totalPaid.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
