# Loan Management System - Setup Guide

This guide provides detailed instructions for setting up the Loan Management System on your local development environment.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Development Environment Setup](#development-environment-setup)
3. [Database Setup](#database-setup)
4. [Project Installation](#project-installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Initial Data Setup](#initial-data-setup)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Hardware Requirements
- Processor: Dual-core 2GHz or better
- RAM: 4GB minimum, 8GB recommended
- Storage: 1GB free space

### Software Requirements
- Operating System: Windows 10+, macOS 10.15+, or Linux
- Node.js: Version 14.x or higher
- MongoDB: Version 4.4 or higher
- Git: Latest version
- Web Browser: Chrome (recommended), Firefox, or Edge

## Development Environment Setup

### 1. Install Node.js
```bash
# Windows
1. Download Node.js installer from https://nodejs.org
2. Run the installer and follow the installation wizard

# macOS (using Homebrew)
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install MongoDB
```bash
# Windows
1. Download MongoDB installer from https://www.mongodb.com/try/download/community
2. Run the installer
3. Create directory: C:\data\db

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
```

### 3. Install Git
```bash
# Windows
Download and install from https://git-scm.com/download/win

# macOS
brew install git

# Linux
sudo apt-get install git
```

## Database Setup

1. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo service mongod start
```

2. Verify MongoDB is running:
```bash
mongo --eval "db.version()"
```

3. Create database and user:
```bash
mongo
> use creditbureau
> db.createUser({
    user: "loanadmin",
    pwd: "your_secure_password",
    roles: ["readWrite", "dbAdmin"]
})
```

## Project Installation

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

## Configuration

1. Backend Configuration (.env file):
```bash
cd Backend
cp .env.example .env
```

2. Edit the .env file with your settings:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/creditbureau
MONGO_USER=loanadmin
MONGO_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

3. Frontend Configuration:
```bash
cd ../credit-bureau
cp .env.example .env
```

4. Edit the frontend .env file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Running the Application

1. Start MongoDB (if not already running):
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

3. Start the frontend application (in a new terminal):
```bash
cd credit-bureau
npm start
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Initial Data Setup

1. Create admin user:
```bash
cd Backend
node scripts/create-admin.js
```

2. Import sample data (optional):
```bash
cd Backend
node scripts/import-sample-data.js
```

3. Default login credentials:
```
Admin:
- Email: tsholo@gmail.com
- Password: tsholo

Lender:
- Email: net@gmail.com
- Password: net

Borrower:
- Email: molapo@gmail.com
- Password: molapo
```

## Troubleshooting

### Common Issues and Solutions

1. MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongodb

# Restart MongoDB
sudo service mongod restart
```

2. Node.js Port Conflicts
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F
```

3. NPM Installation Errors
```bash
# Clear NPM cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

4. Frontend Build Issues
```bash
# Clear cache and rebuild
npm run clean
npm run build
```

### Getting Help

If you encounter any issues not covered in this guide:

1. Check the error logs:
```bash
# Backend logs
cd Backend
npm run logs

# Frontend logs
cd credit-bureau
npm run logs
```

2. Contact support:
- Email: mdandalazalumka@gmail.com
- Create an issue on GitHub
- Check the FAQ section in the documentation

### Development Tools

Recommended development tools:
- VS Code with extensions:
  - ESLint
  - Prettier
  - MongoDB for VS Code
- MongoDB Compass (GUI for MongoDB)
- Postman (API testing)

### Security Notes

1. Never commit .env files
2. Regularly update dependencies
3. Use strong passwords
4. Enable firewall rules
5. Keep MongoDB updated

For additional security measures and best practices, refer to the SECURITY.md file. 