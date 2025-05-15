# Loan Management System

A modern web-based loan management system that facilitates interactions between borrowers and lenders, with administrative oversight. The system features credit scoring, loan application processing, and comprehensive reporting.

## Features

### For Borrowers
- Apply for loans with detailed application forms
- Track loan application status
- View loan history and payment records
- Monitor credit score in real-time
- Make loan payments
- View personalized dashboard

### For Lenders
- Review loan applications
- Approve/reject loan requests
- Monitor active loans
- Access borrower credit reports
- View performance analytics
- Generate risk analysis reports

### For Administrators
- User management (create, update, delete users)
- System-wide reporting
- Configure system settings
- Monitor platform performance

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Modern UI with responsive design
- Chart.js for data visualization

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd loan_management
```

2. Install backend dependencies:
```bash
cd Backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../credit-bureau
npm install
```

4. Create a .env file in the Backend directory:
```env
MONGO_URI=mongodb://localhost:27017/creditbureau
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Running the Application

1. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo service mongod start
```

2. Start the backend server:
```bash
cd Backend
npm start
```

3. Start the frontend application:
```bash
cd ../credit-bureau
npm start
```

The application will be available at `http://localhost:3000`

## Default Users

The system comes with three default user types:

1. Admin:
   - Email: admin@example.com
   - Password: admin123

2. Lender:
   - Email: lender@example.com
   - Password: lender123

3. Borrower:
   - Email: borrower@example.com
   - Password: borrower123

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Loan Endpoints
- POST /api/loans - Create loan application
- GET /api/loans/history - Get loan history
- PUT /api/loans/:id/approve - Approve loan
- PUT /api/loans/:id/reject - Reject loan
- POST /api/loans/pay/:id - Make loan payment

### User Endpoints
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users - Get all users (admin only)
- POST /api/users - Create new user (admin only)
- PUT /api/users/:id - Update user (admin only)
- DELETE /api/users/:id - Delete user (admin only)

### Report Endpoints
- GET /api/reports/borrowers - Get borrowers report
- GET /api/reports/lenders - Get lenders report
- GET /api/dashboard/stats - Get dashboard statistics

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Input validation and sanitization
- Secure HTTP headers
- Rate limiting for API endpoints

## Credit Score Calculation

Credit scores are calculated based on:
1. Payment History (50%)
   - Ratio of total amount paid to total loan amount
2. Remaining Debt (50%)
   - Ratio of remaining debt to total loan amount

Score ranges:
- Excellent: 80-100
- Good: 60-79
- Fair: 40-59
- Poor: 0-39

## Default Rate Calculation

Default rate is calculated as:
```
defaultRate = (number of defaulted loans / total approved loans) * 100
```
A loan is considered defaulted if:
- Status is 'approved'
- Has unpaid balance
- Applied more than 30 days ago

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@loanmanagement.com or create an issue in the repository.
