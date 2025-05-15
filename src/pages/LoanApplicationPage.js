import React, { useState, useEffect } from "react";

function LoanApplicationPage() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [employer, setEmployer] = useState("");
  const [occupation, setOccupation] = useState("");
  const [grossMonthly, setGrossMonthly] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [maxLoanAmount, setMaxLoanAmount] = useState(null);
  const [netSalary, setNetSalary] = useState(null);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lenders, setLenders] = useState([]);
  const [selectedLender, setSelectedLender] = useState("");
  const [paymentInputs, setPaymentInputs] = useState({});

  // Add new state for calculated loan amount after down payment
  const [finalLoanAmount, setFinalLoanAmount] = useState("");

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchHistory();
    fetchLenders();
  }, []);

  // Update the useEffect to include calculation of final loan amount
  useEffect(() => {
    if (amount && downPayment) {
      const amountNum = parseFloat(amount);
      const downPaymentNum = parseFloat(downPayment);
      if (!isNaN(amountNum) && !isNaN(downPaymentNum)) {
        setFinalLoanAmount((amountNum - downPaymentNum).toString());
      }
    } else {
      setFinalLoanAmount("");
    }
  }, [amount, downPayment]);

  // Add new useEffect for calculating monthly payment
  useEffect(() => {
    if (amount && interestRate && durationMonths && downPayment) {
      const principal = parseFloat(amount) - parseFloat(downPayment);
      const monthlyRate = (parseFloat(interestRate) / 100) / 12;
      const totalMonths = parseInt(durationMonths);

      if (!isNaN(principal) && !isNaN(monthlyRate) && !isNaN(totalMonths) && monthlyRate > 0 && totalMonths > 0) {
        const payment = principal * 
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        setMonthlyPayment(Math.round(payment * 100) / 100);
      } else {
        setMonthlyPayment(null);
      }
    } else {
      setMonthlyPayment(null);
    }
  }, [amount, interestRate, durationMonths, downPayment]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const userData = await response.json();
      
      // Auto-populate form fields with user profile data
      setEmail(userData.email || "");
      setBirthDate(userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : "");
      setNationalId(userData.nationalId || "");
      setAddress(userData.address || "");
      setPhone(userData.phone || "");
      // Convert annual salary from monthly net salary
      if (userData.netSalary) {
        setNetSalary(userData.netSalary);
        setMaxLoanAmount(userData.netSalary * 12);
        setAnnualIncome((userData.netSalary * 12).toString());
      }
      setEmployer(userData.employer || "");
      setOccupation(userData.occupation || "");
      // Set gross monthly same as net salary if available
      if (userData.netSalary) {
        setGrossMonthly(userData.netSalary.toString());
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      let user;

      try {
        user = JSON.parse(userStr);
      } catch (e) {
        throw new Error("Invalid user data");
      }

      if (!token || !user || !user.id || !user.role) {
        throw new Error("Please log in to view loan history");
      }

      const res = await fetch("http://localhost:5000/api/loans/history", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

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
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLenders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      let user;

      try {
        user = JSON.parse(userStr);
      } catch (e) {
        throw new Error("Invalid user data");
      }

      if (!token || !user || !user.id || !user.role) {
        throw new Error("Please log in to view lenders");
      }

      const res = await fetch("http://localhost:5000/api/lenders", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Session expired. Please log in again.");
        }
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch lenders");
      }

      const data = await res.json();
      setLenders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching lenders:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          purpose,
          lenderId: selectedLender,
          email,
          birthDate,
          nationalId,
          address,
          phone,
          annualIncome: parseFloat(annualIncome),
          employer,
          occupation,
          grossMonthly: parseFloat(grossMonthly),
          downPayment: parseFloat(downPayment)
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit loan application");
      }

      alert("Loan applied successfully!");
      // Reset form
      setAmount("");
      setPurpose("");
      setSelectedLender("");
      setEmail("");
      setBirthDate("");
      setNationalId("");
      setAddress("");
      setPhone("");
      setAnnualIncome("");
      setEmployer("");
      setOccupation("");
      setGrossMonthly("");
      setDownPayment("");
      // Refresh history
      fetchHistory();
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const handlePaymentChange = (loanId, value) => {
    setPaymentInputs({ ...paymentInputs, [loanId]: value });
  };

  const handleAddPayment = async (loanId) => {
    setError(null);
    const amountToPay = paymentInputs[loanId];
    if (!amountToPay || isNaN(amountToPay) || parseFloat(amountToPay) <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`http://localhost:5000/api/loans/pay/${loanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amountPaid: parseFloat(amountToPay) }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to process payment");
      }

      alert("Payment recorded successfully");
      setPaymentInputs({ ...paymentInputs, [loanId]: "" });
      fetchHistory();
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px" }}>Loan Application</h2>

      {!netSalary && (
        <div style={{
          padding: "15px",
          backgroundColor: "#fff3cd",
          color: "#856404",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          Please update your net salary in your profile before applying for a loan.
        </div>
      )}

      {maxLoanAmount && (
        <div style={{
          padding: "15px",
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          Based on your net salary, your maximum loan amount is: ${maxLoanAmount.toLocaleString()}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <input 
            type="number" 
            placeholder="Total Amount Needed" 
            value={amount} 
            onChange={(e) => {
              const value = e.target.value;
              if (maxLoanAmount && parseFloat(value) > maxLoanAmount) {
                setError(`Amount cannot exceed your maximum loan amount of $${maxLoanAmount.toLocaleString()}`);
              } else {
                setError(null);
              }
              setAmount(value);
            }}
            required 
            style={{
              ...inputStyle,
              borderColor: error && amount ? '#dc3545' : inputStyle.borderColor
            }}
            max={maxLoanAmount || undefined}
          />
          {error && amount && (
            <div style={{
              color: '#dc3545',
              fontSize: '0.875rem',
              marginTop: '5px'
            }}>
              {error}
            </div>
          )}
          <input 
            type="number" 
            placeholder="Down Payment (amount you can pay upfront)" 
            value={downPayment} 
            onChange={(e) => setDownPayment(e.target.value)} 
            required 
            style={inputStyle} 
          />
          {amount && downPayment && finalLoanAmount && (
            <div style={{ 
              marginTop: "10px", 
              padding: "10px", 
              backgroundColor: "#f8f9fa", 
              borderRadius: "4px",
              fontSize: "14px"
            }}>
              <strong>Loan Amount Calculation:</strong><br />
              Total Amount Needed: ${parseFloat(amount).toLocaleString()}<br />
              Down Payment: ${parseFloat(downPayment).toLocaleString()}<br />
              Final Loan Amount: ${parseFloat(finalLoanAmount).toLocaleString()}
            </div>
          )}
        </div>

        <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="date" placeholder="Birth Date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="National ID Number" value={nationalId} onChange={(e) => setNationalId(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required style={inputStyle} />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Annual Income" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="Present Employer" value={employer} onChange={(e) => setEmployer(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Gross Monthly Payment" value={grossMonthly} onChange={(e) => setGrossMonthly(e.target.value)} required style={inputStyle} />

        <select value={selectedLender} onChange={(e) => setSelectedLender(e.target.value)} required style={inputStyle}>
          <option value="">Select Lender</option>
          {lenders.map((lender) => (
            <option key={lender._id} value={lender._id}>
              {lender.name} ({lender.email})
            </option>
          ))}
        </select>
        <button type="submit" style={submitButtonStyle}>
          Apply
        </button>
      </form>

      <h3 style={{ marginBottom: "10px" }}>Loan History</h3>
      <table border="1" cellPadding="5" style={tableStyle}>
        <thead style={{ background: "linear-gradient(135deg, #00ffff 0%, #40e0d0 100%)" }}>
          <tr>
            <th>Amount</th>
            <th>Interest Rate</th>
            <th>Duration</th>
            <th>Monthly Payment</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Status</th>
            <th>Purpose</th>
            <th>Applied At</th>
            <th>Lender</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          {history.map((loan) => {
            const remaining = loan.amount - (loan.paidAmount || 0);
            const isPaid = remaining <= 0;
            const lenderDisplayName = loan.lenderId ? loan.lenderId.name : "Unknown Lender";
            return (
              <tr key={loan._id}>
                <td>${loan.amount.toLocaleString()}</td>
                <td>{loan.interestRate ? `${loan.interestRate}%` : '-'}</td>
                <td>{loan.durationMonths ? `${loan.durationMonths} months` : '-'}</td>
                <td>{loan.monthlyPayment ? `$${loan.monthlyPayment.toLocaleString()}` : '-'}</td>
                <td>{loan.totalAmount ? `$${loan.totalAmount.toLocaleString()}` : '-'}</td>
                <td>${(loan.paidAmount || 0).toLocaleString()}</td>
                <td>${remaining.toLocaleString()}</td>
                <td style={{ color: isPaid ? "green" : "red", fontWeight: "bold" }}>{isPaid ? "Paid" : "Unpaid"}</td>
                <td>{loan.purpose}</td>
                <td>{new Date(loan.appliedAt).toLocaleDateString()}</td>
                <td>{lenderDisplayName}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Pay..."
                    value={paymentInputs[loan._id] || ""}
                    onChange={(e) => handlePaymentChange(loan._id, e.target.value)}
                    style={{ width: "70px", padding: "5px", marginRight: "5px" }}
                  />
                  <button onClick={() => handleAddPayment(loan._id)} style={payButtonStyle}>
                    Pay
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const inputStyle = {
  marginRight: "10px",
  marginBottom: "10px",
  padding: "8px",
  width: "220px",
};

const submitButtonStyle = {
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const payButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  textAlign: "left",
};

export default LoanApplicationPage;
