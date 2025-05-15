import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    systemSettings: {
      maxLoanAmount: 100000,
      minCreditScore: 600,
      interestRateRange: {
        min: 5,
        max: 25
      },
      loanTermsInMonths: {
        min: 6,
        max: 60
      },
      allowNewRegistrations: true,
      maintenanceMode: false
    },
    emailSettings: {
      enableEmailNotifications: true,
      notifyOnNewApplication: true,
      notifyOnLoanApproval: true,
      notifyOnPaymentDue: true,
      notifyOnLatePayment: true
    },
    securitySettings: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Fetch current settings from backend
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        setMessage({ text: 'Failed to load settings', type: 'error' });
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleRangeChange = (category, setting, subSetting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          [subSetting]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage({ text: 'Settings updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error saving settings', type: 'error' });
    }
    setLoading(false);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '30px',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px'
    },
    section: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#2c3e50'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#34495e'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '10px'
    },
    rangeGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '34px'
    },
    message: {
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    button: {
      backgroundColor: '#3498db',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>System Settings</h1>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* System Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Loan Parameters</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Maximum Loan Amount ($)</label>
            <input
              type="number"
              style={styles.input}
              value={settings.systemSettings.maxLoanAmount}
              onChange={(e) => handleSettingChange('systemSettings', 'maxLoanAmount', Number(e.target.value))}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Minimum Credit Score Required</label>
            <input
              type="number"
              style={styles.input}
              value={settings.systemSettings.minCreditScore}
              onChange={(e) => handleSettingChange('systemSettings', 'minCreditScore', Number(e.target.value))}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Interest Rate Range (%)</label>
            <div style={styles.rangeGroup}>
              <input
                type="number"
                style={{ ...styles.input, width: '45%' }}
                value={settings.systemSettings.interestRateRange.min}
                onChange={(e) => handleRangeChange('systemSettings', 'interestRateRange', 'min', Number(e.target.value))}
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                style={{ ...styles.input, width: '45%' }}
                value={settings.systemSettings.interestRateRange.max}
                onChange={(e) => handleRangeChange('systemSettings', 'interestRateRange', 'max', Number(e.target.value))}
                placeholder="Max"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Loan Terms (Months)</label>
            <div style={styles.rangeGroup}>
              <input
                type="number"
                style={{ ...styles.input, width: '45%' }}
                value={settings.systemSettings.loanTermsInMonths.min}
                onChange={(e) => handleRangeChange('systemSettings', 'loanTermsInMonths', 'min', Number(e.target.value))}
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                style={{ ...styles.input, width: '45%' }}
                value={settings.systemSettings.loanTermsInMonths.max}
                onChange={(e) => handleRangeChange('systemSettings', 'loanTermsInMonths', 'max', Number(e.target.value))}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Email Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Email Notifications</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailSettings.enableEmailNotifications}
                onChange={(e) => handleSettingChange('emailSettings', 'enableEmailNotifications', e.target.checked)}
              />
              Enable Email Notifications
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailSettings.notifyOnNewApplication}
                onChange={(e) => handleSettingChange('emailSettings', 'notifyOnNewApplication', e.target.checked)}
              />
              Notify on New Loan Application
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailSettings.notifyOnLoanApproval}
                onChange={(e) => handleSettingChange('emailSettings', 'notifyOnLoanApproval', e.target.checked)}
              />
              Notify on Loan Approval
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailSettings.notifyOnPaymentDue}
                onChange={(e) => handleSettingChange('emailSettings', 'notifyOnPaymentDue', e.target.checked)}
              />
              Notify on Payment Due
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailSettings.notifyOnLatePayment}
                onChange={(e) => handleSettingChange('emailSettings', 'notifyOnLatePayment', e.target.checked)}
              />
              Notify on Late Payment
            </label>
          </div>
        </div>

        {/* Security Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Security Settings</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Minimum Password Length</label>
            <input
              type="number"
              style={styles.input}
              value={settings.securitySettings.passwordMinLength}
              onChange={(e) => handleSettingChange('securitySettings', 'passwordMinLength', Number(e.target.value))}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.securitySettings.requireSpecialChars}
                onChange={(e) => handleSettingChange('securitySettings', 'requireSpecialChars', e.target.checked)}
              />
              Require Special Characters in Password
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.securitySettings.requireNumbers}
                onChange={(e) => handleSettingChange('securitySettings', 'requireNumbers', e.target.checked)}
              />
              Require Numbers in Password
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Session Timeout (minutes)</label>
            <input
              type="number"
              style={styles.input}
              value={settings.securitySettings.sessionTimeoutMinutes}
              onChange={(e) => handleSettingChange('securitySettings', 'sessionTimeoutMinutes', Number(e.target.value))}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Maximum Login Attempts</label>
            <input
              type="number"
              style={styles.input}
              value={settings.securitySettings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('securitySettings', 'maxLoginAttempts', Number(e.target.value))}
            />
          </div>
        </div>

        {/* System Maintenance Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>System Maintenance</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.systemSettings.allowNewRegistrations}
                onChange={(e) => handleSettingChange('systemSettings', 'allowNewRegistrations', e.target.checked)}
              />
              Allow New User Registrations
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.systemSettings.maintenanceMode}
                onChange={(e) => handleSettingChange('systemSettings', 'maintenanceMode', e.target.checked)}
              />
              Enable Maintenance Mode
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default AdminSettingsPage; 