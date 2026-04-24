import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Public Pages
import Login from './pages/public/Login';
import Shop from './pages/public/Shop';
import Checkout from './pages/public/Checkout';
import Home from './pages/public/Home';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import OnboardingForms from './pages/client/OnboardingForms';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';

// --- AUTO GENERATED ROUTES ---
import IncomeTax from './pages/client/personal/IncomeTax';
import ProvisionalTax from './pages/client/personal/ProvisionalTax';
import WealthEstate from './pages/client/personal/WealthEstate';
import TrustAdmin from './pages/client/personal/TrustAdmin';
import ExpatTax from './pages/client/personal/ExpatTax';
import Retirement from './pages/client/personal/Retirement';
import DebtManagement from './pages/client/personal/DebtManagement';
import DeceasedEstate from './pages/client/personal/DeceasedEstate';
import Bookkeeping from './pages/client/business/Bookkeeping';
import Audit from './pages/client/business/Audit';
import IndependentReview from './pages/client/business/IndependentReview';
import CorporateTax from './pages/client/business/CorporateTax';
import VatGst from './pages/client/business/VatGst';
import Payroll from './pages/client/business/Payroll';
import ManagementReporting from './pages/client/business/ManagementReporting';
import CompanySecretarial from './pages/client/business/CompanySecretarial';
import Bbbee from './pages/client/business/Bbbee';
import BusinessRescue from './pages/client/business/BusinessRescue';
import Coida from './pages/client/business/Coida';
import CompanyRegistration from './pages/client/cipc/CompanyRegistration';
import AnnualReturns from './pages/client/cipc/AnnualReturns';
import NameReservation from './pages/client/cipc/NameReservation';
import ShelfCompany from './pages/client/cipc/ShelfCompany';
import Reinstatement from './pages/client/cipc/Reinstatement';
import Deregistration from './pages/client/cipc/Deregistration';
import DirectorAmendments from './pages/client/cipc/DirectorAmendments';
import DirectorDetails from './pages/client/cipc/DirectorDetails';
import OfficerChanges from './pages/client/cipc/OfficerChanges';
import PublicOfficer from './pages/client/cipc/PublicOfficer';
import BeneficialOwnership from './pages/client/cipc/BeneficialOwnership';
import ComplianceChecklist from './pages/client/cipc/ComplianceChecklist';
import MoiAmendments from './pages/client/cipc/MoiAmendments';
import Fas from './pages/client/cipc/Fas';
import AddressChanges from './pages/client/cipc/AddressChanges';
import SecuritiesRegister from './pages/client/cipc/SecuritiesRegister';
import ShareCertificates from './pages/client/cipc/ShareCertificates';
import ShareTransfers from './pages/client/cipc/ShareTransfers';
import Trademark from './pages/client/cipc/Trademark';
import Patent from './pages/client/cipc/Patent';
import Documents from './pages/client/features/Documents';
import Signatures from './pages/client/features/Signatures';
import Messages from './pages/client/features/Messages';
import Billing from './pages/client/features/Billing';
import Reminders from './pages/client/features/Reminders';
import MobileScanner from './pages/client/features/MobileScanner';
import Tasks from './pages/client/features/Tasks';
import TimeTracking from './pages/staff/features/TimeTracking';
import Expenses from './pages/staff/features/Expenses';
import Directory from './pages/staff/features/Directory';
import Cpe from './pages/staff/features/Cpe';
import KnowledgeBase from './pages/staff/features/KnowledgeBase';
import Leave from './pages/staff/features/Leave';
import Workflow from './pages/staff/features/Workflow';
import Dms from './pages/staff/features/Dms';
import Communications from './pages/staff/features/Communications';
import SoftwareIntegration from './pages/staff/features/SoftwareIntegration';
import Analytics from './pages/staff/features/Analytics';
import ESignatures from './pages/staff/features/ESignatures';
import ProjectOversight from './pages/staff/features/ProjectOversight';
import ResourceAllocation from './pages/staff/features/ResourceAllocation';
import Budget from './pages/staff/features/Budget';
import Wip from './pages/staff/features/Wip';
import ReviewQueue from './pages/staff/features/ReviewQueue';
import Onboarding from './pages/staff/features/Onboarding';
import Financials from './pages/staff/features/Financials';
import AgedReceivables from './pages/staff/features/AgedReceivables';
import Utilization from './pages/staff/features/Utilization';
import WriteOffs from './pages/staff/features/WriteOffs';
import StrategicPlanning from './pages/staff/features/StrategicPlanning';
import Provisioning from './pages/staff/features/Provisioning';
import SecurityLogs from './pages/staff/features/SecurityLogs';
import PayrollProcessing from './pages/staff/features/PayrollProcessing';
import Performance from './pages/staff/features/Performance';
import ApplicantTracking from './pages/staff/features/ApplicantTracking';
import ProductsManagement from './pages/staff/features/ProductsManagement';

export default function App() {
  const [token] = useState<string | null>(localStorage.getItem('access_token'));

  // A simple auth guard wrapper
  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<MainLayout />}>
          
          {/* Public / Semi-Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Client Routes */}
          <Route path="/client/dashboard" element={<RequireAuth><ClientDashboard /></RequireAuth>} />
          <Route path="/onboarding/forms" element={<RequireAuth><OnboardingForms /></RequireAuth>} />
          
          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={<RequireAuth><StaffDashboard /></RequireAuth>} />
          
          {/* AUTO GENERATED CLIENT ROUTES */}
          <Route path="/client/personal/income-tax" element={<RequireAuth><IncomeTax /></RequireAuth>} />
          <Route path="/client/personal/provisional-tax" element={<RequireAuth><ProvisionalTax /></RequireAuth>} />
          <Route path="/client/personal/wealth-estate" element={<RequireAuth><WealthEstate /></RequireAuth>} />
          <Route path="/client/personal/trust-admin" element={<RequireAuth><TrustAdmin /></RequireAuth>} />
          <Route path="/client/personal/expat-tax" element={<RequireAuth><ExpatTax /></RequireAuth>} />
          <Route path="/client/personal/retirement" element={<RequireAuth><Retirement /></RequireAuth>} />
          <Route path="/client/personal/debt-management" element={<RequireAuth><DebtManagement /></RequireAuth>} />
          <Route path="/client/personal/deceased-estate" element={<RequireAuth><DeceasedEstate /></RequireAuth>} />
          <Route path="/client/business/bookkeeping" element={<RequireAuth><Bookkeeping /></RequireAuth>} />
          <Route path="/client/business/audit" element={<RequireAuth><Audit /></RequireAuth>} />
          <Route path="/client/business/independent-review" element={<RequireAuth><IndependentReview /></RequireAuth>} />
          <Route path="/client/business/corporate-tax" element={<RequireAuth><CorporateTax /></RequireAuth>} />
          <Route path="/client/business/vat-gst" element={<RequireAuth><VatGst /></RequireAuth>} />
          <Route path="/client/business/payroll" element={<RequireAuth><Payroll /></RequireAuth>} />
          <Route path="/client/business/management-reporting" element={<RequireAuth><ManagementReporting /></RequireAuth>} />
          <Route path="/client/business/company-secretarial" element={<RequireAuth><CompanySecretarial /></RequireAuth>} />
          <Route path="/client/business/bbbee" element={<RequireAuth><Bbbee /></RequireAuth>} />
          <Route path="/client/business/business-rescue" element={<RequireAuth><BusinessRescue /></RequireAuth>} />
          <Route path="/client/business/coida" element={<RequireAuth><Coida /></RequireAuth>} />
          <Route path="/client/cipc/registration" element={<RequireAuth><CompanyRegistration /></RequireAuth>} />
          <Route path="/client/cipc/annual-returns" element={<RequireAuth><AnnualReturns /></RequireAuth>} />
          <Route path="/client/cipc/name-reservation" element={<RequireAuth><NameReservation /></RequireAuth>} />
          <Route path="/client/cipc/shelf-company" element={<RequireAuth><ShelfCompany /></RequireAuth>} />
          <Route path="/client/cipc/reinstatement" element={<RequireAuth><Reinstatement /></RequireAuth>} />
          <Route path="/client/cipc/deregistration" element={<RequireAuth><Deregistration /></RequireAuth>} />
          <Route path="/client/cipc/director-amendments" element={<RequireAuth><DirectorAmendments /></RequireAuth>} />
          <Route path="/client/cipc/director-details" element={<RequireAuth><DirectorDetails /></RequireAuth>} />
          <Route path="/client/cipc/officer-changes" element={<RequireAuth><OfficerChanges /></RequireAuth>} />
          <Route path="/client/cipc/public-officer" element={<RequireAuth><PublicOfficer /></RequireAuth>} />
          <Route path="/client/cipc/beneficial-ownership" element={<RequireAuth><BeneficialOwnership /></RequireAuth>} />
          <Route path="/client/cipc/compliance-checklist" element={<RequireAuth><ComplianceChecklist /></RequireAuth>} />
          <Route path="/client/cipc/moi-amendments" element={<RequireAuth><MoiAmendments /></RequireAuth>} />
          <Route path="/client/cipc/fas" element={<RequireAuth><Fas /></RequireAuth>} />
          <Route path="/client/cipc/address-changes" element={<RequireAuth><AddressChanges /></RequireAuth>} />
          <Route path="/client/cipc/securities-register" element={<RequireAuth><SecuritiesRegister /></RequireAuth>} />
          <Route path="/client/cipc/share-certificates" element={<RequireAuth><ShareCertificates /></RequireAuth>} />
          <Route path="/client/cipc/share-transfers" element={<RequireAuth><ShareTransfers /></RequireAuth>} />
          <Route path="/client/cipc/trademark" element={<RequireAuth><Trademark /></RequireAuth>} />
          <Route path="/client/cipc/patent" element={<RequireAuth><Patent /></RequireAuth>} />
          <Route path="/client/documents" element={<RequireAuth><Documents /></RequireAuth>} />
          <Route path="/client/signatures" element={<RequireAuth><Signatures /></RequireAuth>} />
          <Route path="/client/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/client/billing" element={<RequireAuth><Billing /></RequireAuth>} />
          <Route path="/client/reminders" element={<RequireAuth><Reminders /></RequireAuth>} />
          <Route path="/client/mobile-scanner" element={<RequireAuth><MobileScanner /></RequireAuth>} />
          <Route path="/client/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
          
          {/* AUTO GENERATED STAFF ROUTES */}
          <Route path="/staff/products" element={<RequireAuth><ProductsManagement /></RequireAuth>} />
          <Route path="/staff/time-tracking" element={<RequireAuth><TimeTracking /></RequireAuth>} />
          <Route path="/staff/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
          <Route path="/staff/directory" element={<RequireAuth><Directory /></RequireAuth>} />
          <Route path="/staff/cpe" element={<RequireAuth><Cpe /></RequireAuth>} />
          <Route path="/staff/knowledge-base" element={<RequireAuth><KnowledgeBase /></RequireAuth>} />
          <Route path="/staff/leave" element={<RequireAuth><Leave /></RequireAuth>} />
          <Route path="/staff/workflow" element={<RequireAuth><Workflow /></RequireAuth>} />
          <Route path="/staff/dms" element={<RequireAuth><Dms /></RequireAuth>} />
          <Route path="/staff/communications" element={<RequireAuth><Communications /></RequireAuth>} />
          <Route path="/staff/software-integration" element={<RequireAuth><SoftwareIntegration /></RequireAuth>} />
          <Route path="/staff/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="/staff/e-signatures" element={<RequireAuth><ESignatures /></RequireAuth>} />
          <Route path="/staff/project-oversight" element={<RequireAuth><ProjectOversight /></RequireAuth>} />
          <Route path="/staff/resource-allocation" element={<RequireAuth><ResourceAllocation /></RequireAuth>} />
          <Route path="/staff/budget" element={<RequireAuth><Budget /></RequireAuth>} />
          <Route path="/staff/wip" element={<RequireAuth><Wip /></RequireAuth>} />
          <Route path="/staff/review-queue" element={<RequireAuth><ReviewQueue /></RequireAuth>} />
          <Route path="/staff/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/staff/financials" element={<RequireAuth><Financials /></RequireAuth>} />
          <Route path="/staff/aged-receivables" element={<RequireAuth><AgedReceivables /></RequireAuth>} />
          <Route path="/staff/utilization" element={<RequireAuth><Utilization /></RequireAuth>} />
          <Route path="/staff/write-offs" element={<RequireAuth><WriteOffs /></RequireAuth>} />
          <Route path="/staff/strategic-planning" element={<RequireAuth><StrategicPlanning /></RequireAuth>} />
          <Route path="/staff/provisioning" element={<RequireAuth><Provisioning /></RequireAuth>} />
          <Route path="/staff/security-logs" element={<RequireAuth><SecurityLogs /></RequireAuth>} />
          <Route path="/staff/payroll-processing" element={<RequireAuth><PayrollProcessing /></RequireAuth>} />
          <Route path="/staff/performance" element={<RequireAuth><Performance /></RequireAuth>} />
          <Route path="/staff/applicant-tracking" element={<RequireAuth><ApplicantTracking /></RequireAuth>} />
        </Route>
      </Routes>
    </Router>
  );
}
