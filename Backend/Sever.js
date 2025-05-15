// --- Required Modules ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/creditbureau', {

}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Models ---
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'lender', 'borrower'], default: 'borrower' },
  // Additional borrower details
  phone: String,
  address: String,
  netSalary: Number,
  employer: String,
  occupation: String,
  employmentStatus: String,
  employerAddress: String,
  employerPhone: String,
  dateOfBirth: Date,
  nationalId: String
});
const User = mongoose.model('User', userSchema);

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  try {
    console.log('Debug - Headers:', req.headers);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Debug - No valid auth header:', authHeader);
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Debug - Token:', token);
    
    if (!token) {
      console.log('Debug - No token after split');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      console.log('Debug - Decoded token:', decoded);
      
      if (!decoded || !decoded.id || !decoded.role) {
        console.log('Debug - Invalid token payload:', decoded);
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role.toLowerCase()
      };
      
      console.log('Debug - User set in request:', req.user);
      next();
    } catch (err) {
      console.error('Debug - Token verification error:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw err;
    }
  } catch (err) {
    console.error('Debug - General error in verifyToken:', err);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

const loanSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  purpose: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  durationMonths: { type: Number }, // Not required initially
  interestRate: { type: Number }, // Not required initially
  monthlyPayment: { type: Number }, // Calculated during approval
  totalAmount: { type: Number }, // Calculated during approval

  // Extended Fields
  email: String,
  birthDate: Date,
  nationalId: String,
  address: String,
  phone: String,
  annualIncome: Number,
  employer: String,
  occupation: String,
  grossMonthly: Number,
  downPayment: Number,
});
const Loan = mongoose.model('Loan', loanSchema);

const creditRecordSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  loanAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  status: { type: String, enum: ["approved", "rejected", "paid"], required: true }
});
const CreditRecord = mongoose.model('CreditRecord', creditRecordSchema);

const transactionSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// --- Middleware ---
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" }); // More specific error

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" }); // More specific error
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized: Invalid token" }); // More specific error
    }
  };
};

// --- User Routes ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) { // Basic validation
    return res.status(400).json({ message: "Name, email, and password are required for registration." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err); // Log the error
    res.status(500).json({ message: 'Registration failed', error: err.message }); // Use 500 for server errors
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required for login." });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token with required user information
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      }, 
      process.env.JWT_SECRET || "secret123", 
      { expiresIn: '24h' }
    );

    // Send user info without sensitive data
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        email: user.email 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Update user profile endpoint - MOVED BEFORE USER ID ROUTES
app.put('/api/users/profile', authMiddleware(['admin', 'lender', 'borrower']), async (req, res) => {
  try {
    console.log('Debug - Profile update request received');
    console.log('Debug - User:', req.user);
    console.log('Debug - Request body:', req.body);

    const {
      name, phone, address, netSalary, employer,
      occupation, employmentStatus, employerAddress,
      employerPhone, dateOfBirth, nationalId
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (netSalary) updateData.netSalary = netSalary;
    if (employer) updateData.employer = employer;
    if (occupation) updateData.occupation = occupation;
    if (employmentStatus) updateData.employmentStatus = employmentStatus;
    if (employerAddress) updateData.employerAddress = employerAddress;
    if (employerPhone) updateData.employerPhone = employerPhone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (nationalId) updateData.nationalId = nationalId;

    console.log('Debug - Update data:', updateData);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    console.log('Debug - Updated user:', user);

    if (!user) {
      console.log('Debug - User not found');
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

app.get('/api/users/profile', authMiddleware(['admin', 'lender', 'borrower']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
});

app.get('/api/users', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't expose passwords
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

app.post('/api/users', authMiddleware(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields (name, email, password, role) are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    // Avoid sending password hash in the response
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    res.status(201).json({ message: 'User added successfully', user: userWithoutPassword });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ message: 'Failed to add user', error: err.message });
  }
});

app.put('/api/users/:id', authMiddleware(['admin']), async (req, res) => {
  const { name, email, role, password } = req.body;
  const updatedData = {};
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (role) updatedData.role = role;
  if (password) { // Handle password update separately
    updatedData.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-password'); // Don't expose password
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

app.delete('/api/users/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// --- Loan Routes ---
// Create a new loan application
app.post('/api/loans', authMiddleware(["borrower"]), async (req, res) => {
  try {
    const {
      amount, purpose, lenderId,
      email, birthDate, nationalId, address,
      phone, annualIncome, employer, occupation,
      grossMonthly, downPayment
    } = req.body;

    // Validate required fields
    if (!amount || !purpose || !lenderId) {
      return res.status(400).json({ message: 'Amount, purpose, and lender are required' });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Get user's net salary
    const user = await User.findById(req.user.id);
    if (!user.netSalary) {
      return res.status(400).json({ message: 'Please update your net salary in your profile before applying for a loan' });
    }

    // Calculate total monthly payments for existing active loans
    const existingLoans = await Loan.find({
      borrowerId: req.user.id,
      status: 'approved',
      $expr: { $gt: ['$amount', { $ifNull: ['$paidAmount', 0] }] }
    });

    const totalMonthlyPayments = existingLoans.reduce((total, loan) => {
      return total + (loan.monthlyPayment || 0);
    }, 0);

    // Calculate maximum allowed loan amount (net salary * 12)
    const maxLoanAmount = user.netSalary * 12;

    // Validate loan amount against net salary
    if (amount > maxLoanAmount) {
      return res.status(400).json({ 
        message: `Loan amount cannot exceed your yearly net salary. Maximum allowed: $${maxLoanAmount.toLocaleString()}`
      });
    }

    // Validate down payment if provided
    if (downPayment && (downPayment < 0 || downPayment >= amount)) {
      return res.status(400).json({ message: 'Down payment must be less than loan amount and not negative' });
    }

    const loan = new Loan({
      borrowerId: req.user.id,
      lenderId,
      amount: parseFloat(amount),
      purpose,
      email,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      nationalId,
      address,
      phone,
      annualIncome: annualIncome ? parseFloat(annualIncome) : undefined,
      employer,
      occupation,
      grossMonthly: grossMonthly ? parseFloat(grossMonthly) : undefined,
      downPayment: downPayment ? parseFloat(downPayment) : 0
    });

    await loan.save();
    res.status(201).json({ message: 'Loan application submitted successfully.' });
  } catch (err) {
    console.error('Loan application error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Endpoint to fetch loan history
app.get('/api/loans/history', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const userRole = req.user.role?.toLowerCase();

    if (!userRole) {
      return res.status(400).json({ message: 'User role not found' });
    }

    let filter = {};

    if (userRole === 'lender') {
      filter.lenderId = userId;
    } else if (userRole === 'borrower') {
      filter.borrowerId = userId;
    } else if (userRole === 'admin') {
      // Admin can see all loans, so no filter needed
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const loans = await Loan.find(filter)
      .populate('borrowerId', 'name')
      .populate('lenderId', 'name')
      .sort({ appliedAt: -1 });

    if (!loans) {
      return res.json([]);  // Return empty array if no loans found
    }

    res.json(loans);
  } catch (err) {
    console.error('Loan history error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all loans (for lenders)
app.get("/loans", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ lenderId: req.user.id })
      .populate("borrowerId", "name") // Only return name of borrower
      .sort({ appliedAt: -1 });

    res.json(loans);
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/loans', authMiddleware(['lender', 'borrower']), async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  let query = {};
  if (userRole === 'lender') {
    query = { lenderId: userId, status: 'pending' }; // Only show pending loans for lenders
  }

  try {
    const loans = await Loan.find(query).populate('borrowerId', 'name email');
    // Note: For admin, this will return all loans. If you only want pending for admin too, adjust the query.
    // If you want to return all loans for admin, the initial logic was fine.

    if (!loans || loans.length === 0) {
      // Consider returning an empty array and a 200 status if no loans are found,
      // as 404 usually means the endpoint itself wasn't found.
      return res.status(200).json([]); // Return empty array if no loans
    }
    res.json(loans);
  } catch (err) {
    console.error("Fetch loans error:", err);
    res.status(500).json({ message: "Failed to fetch loans", error: err.message });
  }
});

// Approve Loan Endpoint
app.put('/api/loans/:id/approve', authMiddleware(['lender']), async (req, res) => {
  try {
    const { interestRate, durationMonths } = req.body;

    if (!interestRate || !durationMonths) {
      return res.status(400).json({ message: 'Interest rate and duration are required' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Check lender authorization
    if (loan.lenderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not the lender for this loan" });
    }

    // Check if loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: `Loan is not pending. Current status: ${loan.status}` });
    }

    // Calculate monthly payment using the formula: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // Where: P = Principal, r = Monthly interest rate, n = Total number of months
    const principal = loan.amount - (loan.downPayment || 0);
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = parseInt(durationMonths);
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      // If interest rate is 0%, simple division
      monthlyPayment = principal / totalMonths;
    } else {
      // Standard loan payment formula
      monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalAmount = monthlyPayment * totalMonths;

    // Update loan with payment details
    loan.status = 'approved';
    loan.interestRate = parseFloat(interestRate);
    loan.durationMonths = totalMonths;
    loan.monthlyPayment = Math.round(monthlyPayment * 100) / 100; // Round to 2 decimal places
    loan.totalAmount = Math.round(totalAmount * 100) / 100; // Round to 2 decimal places
    await loan.save();

    // Create or update credit record
    const existingCreditRecord = await CreditRecord.findOne({
      borrowerId: loan.borrowerId,
      lenderId: loan.lenderId,
      status: 'approved'
    });

    if (existingCreditRecord) {
      existingCreditRecord.loanAmount = loan.amount;
      existingCreditRecord.balance = loan.totalAmount;
      await existingCreditRecord.save();
    } else {
      const creditRecord = new CreditRecord({
        borrowerId: loan.borrowerId,
        lenderId: loan.lenderId,
        loanAmount: loan.amount,
        balance: loan.totalAmount,
        status: 'approved'
      });
      await creditRecord.save();
    }

    res.json({ 
      message: 'Loan approved successfully',
      loan: {
        ...loan.toObject(),
        monthlyPayment: loan.monthlyPayment,
        totalAmount: loan.totalAmount
      }
    });
  } catch (err) {
    console.error("Loan approval error:", err);
    res.status(500).json({ message: "Failed to approve loan", error: err.message });
  }
});

// Reject Loan Endpoint
app.put('/api/loans/:id/reject', authMiddleware(['lender']), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Check lender authorization
    if (loan.lenderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not the lender for this loan" });
    }

    // Check if loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: `Loan is not pending. Current status: ${loan.status}` });
    }

    // Set status to rejected
    loan.status = 'rejected';
    await loan.save();

    // Optionally, create a credit record for rejected loans or skip
    // For now, just update status

    res.json({ message: 'Loan rejected', loan });
  } catch (err) {
    console.error("Reject loan error:", err);
    res.status(500).json({ message: "Failed to reject loan", error: err.message });
  }
});
app.post('/api/loans/pay/:id', authMiddleware(['borrower']), async (req, res) => { // Changed to POST for payments
  const { amountPaid } = req.body;

  if (amountPaid === undefined || amountPaid <= 0) {
    return res.status(400).json({ message: "Valid amount paid is required." });
  }

  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.borrowerId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized: You are not the borrower for this loan" });
    if (loan.status === 'paid') return res.status(400).json({ message: "Loan is already fully paid." });
     if (loan.status !== 'approved') return res.status(400).json({ message: "Loan must be approved to make payments." });


    const amountToPay = parseFloat(amountPaid);
    if (isNaN(amountToPay)) {
        return res.status(400).json({ message: "Invalid amount paid format." });
    }

    loan.paidAmount += amountToPay;
    let paymentStatusMessage = "Payment successful";

    if (loan.paidAmount >= loan.amount) {
      loan.status = "paid";
      loan.paidAmount = loan.amount; // Cap paidAmount at the total loan amount
      paymentStatusMessage = "Loan fully paid";

      // Update credit record status to 'paid'
      await CreditRecord.findOneAndUpdate(
        { borrowerId: loan.borrowerId, lenderId: loan.lenderId, status: 'approved' },
        { status: 'paid', balance: 0 } // Set balance to 0 when paid
      );

    } else {
        // Update credit record balance on partial payment
        await CreditRecord.findOneAndUpdate(
            { borrowerId: loan.borrowerId, lenderId: loan.lenderId, status: 'approved' },
            { $inc: { balance: -amountToPay } } // Decrease balance by the amount paid
        );
    }

    await loan.save();

    const payment = new Transaction({ loanId: loan._id, borrowerId: req.user.id, amount: amountToPay });
    await payment.save();


    res.json({ message: paymentStatusMessage, loan });
  } catch (err) {
    console.error("Process payment error:", err);
    res.status(500).json({ message: "Failed to process payment", error: err.message });
  }
});
// --- Payment Endpoint ---
app.put('/api/loans/pay/:loanId', authMiddleware(['borrower']), async (req, res) => {
  const loanId = req.params.loanId;
  const { amountPaid } = req.body;
  const userId = req.user.id; // The ID of the authenticated user (borrower)

  // Basic validation
  if (isNaN(amountPaid) || amountPaid <= 0) {
    return res.status(400).json({ message: "Invalid payment amount." });
  }

  try {
    // Find the loan by ID and ensure it belongs to the authenticated borrower
    const loan = await Loan.findOne({ _id: loanId, borrowerId: userId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found or does not belong to you." });
    }

    // Check if the loan is already fully paid
    if (loan.amount - (loan.paidAmount || 0) <= 0) {
      return res.status(400).json({ message: "This loan is already fully paid." });
    }

    // Calculate the new paid amount
    const newPaidAmount = (loan.paidAmount || 0) + amountPaid;

    // Prevent overpaying (optional, you might allow overpayment depending on business logic)
    const remainingAmount = loan.amount - (loan.paidAmount || 0);
    if (amountPaid > remainingAmount) {
        // You can adjust this logic based on whether you allow partial or full payments
        // For now, let's prevent paying more than the remaining amount
        return res.status(400).json({ message: `Payment amount exceeds the remaining balance (${remainingAmount}).` });
    }


    // Update the loan document
    loan.paidAmount = newPaidAmount;

    // Optionally, update the status if fully paid
    if (loan.amount - newPaidAmount <= 0) {
      loan.status = 'paid'; // Assuming 'paid' is a valid status
    }

    await loan.save();

    res.json({ message: "Payment recorded successfully.", updatedLoan: loan });

  } catch (err) {
    console.error("Payment processing error:", err);
    res.status(500).json({ message: "Failed to process payment.", error: err.message });
  }
});
// --- Credit History & Lender List ---
app.get('/api/credit-history', authMiddleware(['borrower']), async (req, res) => {
  try {
    const records = await CreditRecord.find({ borrowerId: req.user.id })
      .populate("lenderId", "name")
      .sort({ date: -1 });

    const formatted = records.map((rec) => ({
      _id: rec._id,
      date: rec.date,
      loanAmount: rec.loanAmount,
      balance: rec.balance,
      status: rec.status,
      lenderName: rec.lenderId?.name || "Unknown",
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Fetch credit history error:", err);
    res.status(500).json({ message: "Failed to fetch credit history", error: err.message });
  }
});

app.get('/api/lenders', authMiddleware(['borrower', 'admin', 'lender']), async (req, res) => { // Allow other roles to see lenders
  try {
    const lenders = await User.find({ role: 'lender' }).select('name email');
    res.json(lenders);
  } catch (err) {
    console.error("Fetch lenders error:", err);
    res.status(500).json({ message: "Failed to fetch lenders", error: err.message });
  }
});

// --- Reports ---
app.get('/api/reports/borrowers', authMiddleware(['admin', 'lender']), async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  try {
    const borrowers = await User.find({ role: 'borrower' });

    const report = await Promise.all(borrowers.map(async (borrower) => {
      let loanQuery = { borrowerId: borrower._id };

      // If lender, only include loans where they are the lender
      if (userRole === 'lender') {
        loanQuery.lenderId = userId;
      }

      const loans = await Loan.find(loanQuery).populate('lenderId', 'name email');

      // If lender and the borrower has no loans from this lender, don't include them in the report
      if (userRole === 'lender' && loans.length === 0) {
          return null; // Filter out later
      }


      return {
        borrowerId: borrower._id, // Include borrower ID
        borrowerName: borrower.name,
        borrowerEmail: borrower.email,
        loans: loans.map((loan) => ({
          loanId: loan._id, // Include loan ID
          amount: loan.amount,
          paidAmount: loan.paidAmount || 0,
          remaining: loan.amount - (loan.paidAmount || 0),
          status: loan.status, // Use the actual loan status
          purpose: loan.purpose,
          appliedAt: loan.appliedAt,
          lenderId: loan.lenderId?._id, // Include lender ID
          lenderName: loan.lenderId?.name || 'N/A',
          lenderEmail: loan.lenderId?.email || 'N/A'
        }))
      };
    }));

    // Filter out null entries if the user is a lender and the borrower has no loans from them
    const filteredReport = report.filter(item => item !== null);

    res.json(filteredReport);
  } catch (err) {
    console.error("Generate borrower report error:", err);
    res.status(500).json({ message: "Failed to generate borrower report", error: err.message });
  }
});

// New endpoint for lender reports
app.get('/api/reports/lenders', authMiddleware(['admin']), async (req, res) => {
  try {
    const lenders = await User.find({ role: 'lender' });

    const report = await Promise.all(lenders.map(async (lender) => {
      const loans = await Loan.find({ lenderId: lender._id }).populate('borrowerId', 'name email');

      const totalLoansAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
      const totalPaidAmount = loans.reduce((sum, loan) => sum + (loan.paidAmount || 0), 0);
      const totalRemainingAmount = loans.reduce((sum, loan) => sum + (loan.amount - (loan.paidAmount || 0)), 0);
      
      const loanStatuses = loans.reduce((acc, loan) => {
        acc[loan.status] = (acc[loan.status] || 0) + 1;
        return acc;
      }, {});

      return {
        lenderId: lender._id,
        lenderName: lender.name,
        lenderEmail: lender.email,
        totalLoans: loans.length,
        totalLoansAmount,
        totalPaidAmount,
        totalRemainingAmount,
        loanStatuses,
        loans: loans.map((loan) => ({
          loanId: loan._id,
          amount: loan.amount,
          paidAmount: loan.paidAmount || 0,
          remaining: loan.amount - (loan.paidAmount || 0),
          status: loan.status,
          purpose: loan.purpose,
          appliedAt: loan.appliedAt,
          borrowerId: loan.borrowerId?._id,
          borrowerName: loan.borrowerId?.name || 'N/A',
          borrowerEmail: loan.borrowerId?.email || 'N/A'
        }))
      };
    }));

    res.json(report);
  } catch (err) {
    console.error("Generate lender report error:", err);
    res.status(500).json({ message: "Failed to generate lender report", error: err.message });
  }
});

// Get borrower details with credit score
app.get('/api/borrowers/:id/details', authMiddleware(['lender', 'admin']), async (req, res) => {
  try {
    // Get borrower details
    const borrower = await User.findById(req.params.id).select('-password');
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    // Get all loans for this borrower
    const loans = await Loan.find({ borrowerId: req.params.id });

    // Calculate credit score
    let creditScore = 0;
    if (loans.length > 0) {
      const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
      const totalPaid = loans.reduce((acc, loan) => acc + (loan.paidAmount || 0), 0);
      const totalRemaining = loans.reduce((acc, loan) => acc + (loan.amount - (loan.paidAmount || 0)), 0);

      const paymentHistoryScore = Math.min(100, (totalPaid / totalAmount) * 100);
      const remainingDebtScore = Math.max(0, 100 - (totalRemaining / totalAmount) * 100);

      creditScore = Math.round((paymentHistoryScore + remainingDebtScore) / 2);
    }

    // Get loan history
    const loanHistory = await Loan.find({ borrowerId: req.params.id })
      .sort({ appliedAt: -1 })
      .limit(5); // Get last 5 loans

    res.json({
      borrower,
      creditScore,
      loanHistory,
      stats: {
        totalLoans: loans.length,
        activeLoans: loans.filter(loan => loan.status === 'approved' && loan.amount > (loan.paidAmount || 0)).length,
        completedLoans: loans.filter(loan => loan.amount <= (loan.paidAmount || 0)).length,
        rejectedLoans: loans.filter(loan => loan.status === 'rejected').length
      }
    });
  } catch (err) {
    console.error("Fetch borrower details error:", err);
    res.status(500).json({ message: "Failed to fetch borrower details", error: err.message });
  }
});

// Dashboard Statistics Endpoint
app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const userRole = req.user.role?.toLowerCase();

    if (!userRole) {
      return res.status(400).json({ message: 'User role not found' });
    }

    let filter = {};
    if (userRole === 'lender') {
      filter.lenderId = userId;
    } else if (userRole === 'borrower') {
      filter.borrowerId = userId;
    }
    // Admin can see all loans

    const loans = await Loan.find(filter);
    
    // Calculate statistics
    const stats = {
      totalLoans: loans.length,
      activeLoans: loans.filter(loan => 
        loan.status === 'approved' && loan.amount > (loan.paidAmount || 0)
      ).length,
      totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
    };

    // Add credit score for borrowers
    if (userRole === 'borrower' && loans.length > 0) {
      const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
      const totalPaid = loans.reduce((acc, loan) => acc + (loan.paidAmount || 0), 0);
      const totalRemaining = loans.reduce((acc, loan) => acc + (loan.amount - (loan.paidAmount || 0)), 0);

      const paymentHistoryScore = Math.min(100, (totalPaid / totalAmount) * 100);
      const remainingDebtScore = Math.max(0, 100 - (totalRemaining / totalAmount) * 100);

      stats.creditScore = Math.round((paymentHistoryScore + remainingDebtScore) / 2);
    }

    res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));