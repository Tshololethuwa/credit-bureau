import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styleSystem } from "../App";

function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    netSalary: "",
    employer: "",
    occupation: "",
    employmentStatus: "",
    employerAddress: "",
    employerPhone: "",
    dateOfBirth: "",
    nationalId: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
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
      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        netSalary: userData.netSalary || "",
        employer: userData.employer || "",
        occupation: userData.occupation || "",
        employmentStatus: userData.employmentStatus || "",
        employerAddress: userData.employerAddress || "",
        employerPhone: userData.employerPhone || "",
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : "",
        nationalId: userData.nationalId || ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric fields
    if (name === 'netSalary') {
      // Allow empty string or valid number
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }

    // Validate phone number
    if (name === 'phone' || name === 'employerPhone') {
      // Allow empty string or valid phone format
      if (value === '' || /^[\d\s\-\+\(\)]*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }

    // For all other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      
      // Create a copy of the form data
      const submitData = { ...formData };
      
      // Remove dateOfBirth and nationalId if user is a lender
      if (user.role === 'lender') {
        delete submitData.dateOfBirth;
        delete submitData.nationalId;
      }

      // Validate required fields
      if (!submitData.name) {
        throw new Error("Name is required");
      }

      // Convert numeric fields
      if (submitData.netSalary) {
        const salary = parseFloat(submitData.netSalary);
        if (isNaN(salary)) {
          throw new Error("Net salary must be a valid number");
        }
        submitData.netSalary = salary;
      }

      // Validate date format
      if (submitData.dateOfBirth) {
        const date = new Date(submitData.dateOfBirth);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date of birth format");
        }
        submitData.dateOfBirth = date.toISOString();
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
      alert(`Error updating profile: ${err.message}`);
      // If token is invalid, redirect to login
      if (err.message.toLowerCase().includes('token') || err.message.includes('401')) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: styleSystem.colors.secondary 
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: styleSystem.colors.danger 
      }}>
        {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const containerStyle = {
    maxWidth: "800px",
    margin: "50px auto",
    padding: styleSystem.spacing.xxl,
    backgroundColor: styleSystem.colors.white,
    borderRadius: styleSystem.borderRadius.lg,
    boxShadow: styleSystem.shadows.lg,
  };

  const headingStyle = {
    color: styleSystem.colors.dark,
    fontSize: styleSystem.typography.sizes.xxl,
    fontWeight: styleSystem.typography.weights.bold,
    marginBottom: styleSystem.spacing.xl,
    textAlign: "center",
  };

  const subHeadingStyle = {
    color: styleSystem.colors.dark,
    fontSize: styleSystem.typography.sizes.lg,
    fontWeight: styleSystem.typography.weights.semibold,
    marginBottom: styleSystem.spacing.md,
  };

  const inputStyle = {
    width: "100%",
    padding: styleSystem.spacing.md,
    marginBottom: styleSystem.spacing.md,
    border: `1px solid ${styleSystem.colors.border}`,
    borderRadius: styleSystem.borderRadius.md,
    fontSize: styleSystem.typography.sizes.base,
    transition: styleSystem.transitions.default,
    outline: 'none',
  };

  const buttonStyle = {
    padding: `${styleSystem.spacing.sm} ${styleSystem.spacing.lg}`,
    backgroundColor: styleSystem.colors.primary,
    color: styleSystem.colors.white,
    border: "none",
    borderRadius: styleSystem.borderRadius.md,
    cursor: "pointer",
    fontSize: styleSystem.typography.sizes.base,
    fontWeight: styleSystem.typography.weights.medium,
    transition: styleSystem.transitions.default,
    marginRight: styleSystem.spacing.sm,
  };

  const infoRowStyle = {
    marginBottom: styleSystem.spacing.sm,
    fontSize: styleSystem.typography.sizes.base,
  };

  const labelStyle = {
    fontWeight: styleSystem.typography.weights.medium,
    color: styleSystem.colors.secondary,
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>User Profile</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: styleSystem.spacing.xl }}>
            <h3 style={subHeadingStyle}>Personal Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
            <input
              type="text"
              name="address"
              placeholder="Residential Address"
              value={formData.address}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = styleSystem.colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styleSystem.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
            
            {/* Show date of birth and national ID only for borrowers */}
            {user.role === 'borrower' && (
              <>
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = styleSystem.colors.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styleSystem.colors.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  name="nationalId"
                  placeholder="National ID"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = styleSystem.colors.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = styleSystem.colors.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </>
            )}
          </div>

          {user.role === 'borrower' && (
            <div style={{ marginBottom: styleSystem.spacing.xl }}>
              <h3 style={subHeadingStyle}>Employment Information</h3>
              <input
                type="number"
                name="netSalary"
                placeholder="Net Monthly Salary"
                value={formData.netSalary}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = styleSystem.colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styleSystem.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="text"
                name="employer"
                placeholder="Employer Name"
                value={formData.employer}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = styleSystem.colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styleSystem.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = styleSystem.colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styleSystem.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = styleSystem.colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styleSystem.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Select Employment Status</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="self-employed">Self Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
              <input
                type="text"
                name="employerAddress"
                placeholder="Employer Address"
                value={formData.employerAddress}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = styleSystem.colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${styleSystem.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styleSystem.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="tel"
                name="employerPhone"
                placeholder="Employer Phone"
                value={formData.employerPhone}
                onChange={handleInputChange}
                style={inputStyle}
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
          )}

          <div style={{ textAlign: "center" }}>
            <button 
              type="submit" 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.primary + 'dd';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.primary;
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ 
                ...buttonStyle, 
                backgroundColor: styleSystem.colors.secondary 
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.secondary + 'dd';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.secondary;
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ marginBottom: styleSystem.spacing.xl }}>
            <h3 style={subHeadingStyle}>Personal Information</h3>
            <div style={infoRowStyle}><span style={labelStyle}>Name:</span> {user.name}</div>
            <div style={infoRowStyle}><span style={labelStyle}>Email:</span> {user.email}</div>
            <div style={infoRowStyle}><span style={labelStyle}>Role:</span> {user.role}</div>
            <div style={infoRowStyle}><span style={labelStyle}>Phone:</span> {user.phone || "Not provided"}</div>
            <div style={infoRowStyle}><span style={labelStyle}>Address:</span> {user.address || "Not provided"}</div>
            
            {/* Show date of birth and national ID only for borrowers */}
            {user.role === 'borrower' && (
              <>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>Date of Birth:</span> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                </div>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>National ID:</span> {user.nationalId || "Not provided"}
                </div>
              </>
            )}
          </div>

          {user.role === 'borrower' && (
            <div style={{ marginBottom: styleSystem.spacing.xl }}>
              <h3 style={subHeadingStyle}>Employment Information</h3>
              <div style={infoRowStyle}><span style={labelStyle}>Net Monthly Salary:</span> {user.netSalary ? `$${user.netSalary}` : "Not provided"}</div>
              <div style={infoRowStyle}><span style={labelStyle}>Employer:</span> {user.employer || "Not provided"}</div>
              <div style={infoRowStyle}><span style={labelStyle}>Occupation:</span> {user.occupation || "Not provided"}</div>
              <div style={infoRowStyle}><span style={labelStyle}>Employment Status:</span> {user.employmentStatus || "Not provided"}</div>
              <div style={infoRowStyle}><span style={labelStyle}>Employer Address:</span> {user.employerAddress || "Not provided"}</div>
              <div style={infoRowStyle}><span style={labelStyle}>Employer Phone:</span> {user.employerPhone || "Not provided"}</div>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.primary + 'dd';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.primary;
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              style={{ 
                ...buttonStyle, 
                backgroundColor: styleSystem.colors.danger 
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.danger + 'dd';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styleSystem.colors.danger;
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
