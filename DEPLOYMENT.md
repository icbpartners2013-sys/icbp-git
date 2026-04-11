# ICBP Client Portal - Login/Register & KYC Dashboard

## Overview

This application provides a complete authentication system with a comprehensive KYC (Know Your Customer) profile dashboard for ICBP clients.

## Features

### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Password hashing with bcryptjs
- 7-day token expiration

### KYC Profile Dashboard
After logging in, users are taken to their profile dashboard where they can complete:

1. **Personal Information (Core KYC)**
   - Full Names, ID/Passport Number, Nationality
   - Marital Status, Physical Address, Occupation
   - Income Tax Number

2. **Business Information**
   - Registered Name, Trading Name, Company Registration
   - VAT, PAYE, UIF, SDL Numbers
   - Annual Turnover, PI Score, Number of Employees
   - Nature of Business, Director Changes

3. **Tax Services**
   - SARS eFiling Username
   - Income Sources (Local and Foreign)
   - Directors/Shareholders
   - Document uploads: IRP5/IT3(a), IT3(b), Medical Aid, Retirement Annuity
   - Business documents: Trial Balance, General Ledger, Financials, Asset Register

4. **CIPC Compliance**
   - Beneficial Ownership Declaration
   - Power of Attorney (Mandate)
   - Annual Financial Statements

5. **Payroll Services**
   - Employee count, Pay frequency, Working hours
   - Existing payroll software
   - Document uploads: Employee List, UIF/PAYE references, Payroll reports

6. **Accounting Advisory & IT**
   - Preferred software (Xero, QuickBooks, Sage)
   - Pain points, Bank accounts, Credit cards
   - Document uploads: Bank statements, Software subscriptions

7. **Tax Transformation & ESG**
   - Current tax workflow (Manual/Automated/Hybrid)
   - Global footprint, Carbon footprint metrics
   - Board diversity details
   - Document uploads: Tax policies, Compliance records, Sustainability reports

8. **Banking Details**
   - Bank Name, Account Holder, Account Number, Branch Code
   - Bank statement for SARS verification

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Deploying to Render

### Backend Deployment

1. Push your code to GitHub

2. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Set Root Directory to `backend`
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`

3. Add Environment Variables in Render:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `PORT`: 5000 (default)

4. Deploy the service

### Frontend Deployment

1. Update `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-backend-service.onrender.com/api
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

3. Deploy the `frontend/build` folder to your hosting service (Netlify, Vercel, or Render Static Site)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile/update` - Update profile information
- `POST /api/profile/upload` - Upload document
- `DELETE /api/profile/document/:docType` - Remove document
- `GET /api/profile/documents` - List uploaded documents

### Legacy Onboarding
- `POST /api/onboard` - Submit onboarding form

## File Upload Specifications

- **Max file size**: 10MB
- **Allowed formats**: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX, CSV
- Files are stored in the `backend/uploads` directory

## Security Notes

1. **JWT Secret**: Change the default JWT_SECRET in production
2. **MongoDB**: Keep your MongoDB connection string secure
3. **CORS**: Currently configured to allow all origins - restrict in production
4. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary) for production

## Troubleshooting

### MongoDB Connection Issues
If you see "Could not connect to MongoDB":
1. Verify your MongoDB Atlas connection string
2. Check that your IP is whitelisted in MongoDB Atlas
3. Ensure network connectivity

### 404 Errors on API
If you see 404 errors:
1. Verify the API URL in `frontend/.env` matches your backend URL
2. Ensure the backend server is running
3. Check that routes are properly registered in `server.js`

### CORS Errors
If you see CORS errors:
1. Ensure the backend CORS configuration allows your frontend URL
2. Check that the frontend is sending requests to the correct URL

## Project Structure

```
icbp-git/
├── backend/
│   ├── models/
│   │   ├── Client.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   └── profileRoutes.js
│   ├── uploads/          # Uploaded files stored here
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Login.css
    │   │   ├── Register.js
    │   │   └── ProfileDashboard.js
    │   │   └── ProfileDashboard.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── .env
    └── package.json