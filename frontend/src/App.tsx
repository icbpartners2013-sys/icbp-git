import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import ClientLayout from './layouts/ClientLayout';
import StaffLayout from './layouts/StaffLayout';

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

// --- CLIENT: Personal Tax ---
import IncomeTax from './pages/client/personal/IncomeTax';
import ProvisionalTax from './pages/client/personal/ProvisionalTax';
import WealthEstate from './pages/client/personal/WealthEstate';
import TrustAdmin from './pages/client/personal/TrustAdmin';
import ExpatTax from './pages/client/personal/ExpatTax';
import Retirement from './pages/client/personal/Retirement';
import DebtManagement from './pages/client/personal/DebtManagement';
import DeceasedEstate from './pages/client/personal/DeceasedEstate';

// --- CLIENT: Business Services ---
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

// --- CLIENT: CIPC ---
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

// --- CLIENT: Features ---
import Documents from './pages/client/features/Documents';
import Signatures from './pages/client/features/Signatures';
import Messages from './pages/client/features/Messages';
import Billing from './pages/client/features/Billing';
import Reminders from './pages/client/features/Reminders';
import MobileScanner from './pages/client/features/MobileScanner';
import Tasks from './pages/client/features/Tasks';

// --- STAFF: Features ---
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

// Auth
import Register from './pages/public/Register';
import OAuthCallback from './pages/OAuthCallback';

export default function App() {
  const [token] = useState<string | null>(localStorage.getItem('access_token'));

  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* ── Auth (no layout) ───────────────────────────────────── */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* ── Main layout (top navbar + footer) — public pages only ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ── Client portal — no top navbar, sidebar only ─────────── */}
        <Route element={<RequireAuth><ClientLayout /></RequireAuth>}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/onboarding/forms" element={<OnboardingForms />} />

            {/* Personal Tax */}
            <Route path="/client/personal/income-tax" element={<IncomeTax />} />
            <Route path="/client/personal/provisional-tax" element={<ProvisionalTax />} />
            <Route path="/client/personal/wealth-estate" element={<WealthEstate />} />
            <Route path="/client/personal/trust-admin" element={<TrustAdmin />} />
            <Route path="/client/personal/expat-tax" element={<ExpatTax />} />
            <Route path="/client/personal/retirement" element={<Retirement />} />
            <Route path="/client/personal/debt-management" element={<DebtManagement />} />
            <Route path="/client/personal/deceased-estate" element={<DeceasedEstate />} />

            {/* Business Services */}
            <Route path="/client/business/bookkeeping" element={<Bookkeeping />} />
            <Route path="/client/business/audit" element={<Audit />} />
            <Route path="/client/business/independent-review" element={<IndependentReview />} />
            <Route path="/client/business/corporate-tax" element={<CorporateTax />} />
            <Route path="/client/business/vat-gst" element={<VatGst />} />
            <Route path="/client/business/payroll" element={<Payroll />} />
            <Route path="/client/business/management-reporting" element={<ManagementReporting />} />
            <Route path="/client/business/company-secretarial" element={<CompanySecretarial />} />
            <Route path="/client/business/bbbee" element={<Bbbee />} />
            <Route path="/client/business/business-rescue" element={<BusinessRescue />} />
            <Route path="/client/business/coida" element={<Coida />} />

            {/* CIPC Services */}
            <Route path="/client/cipc/registration" element={<CompanyRegistration />} />
            <Route path="/client/cipc/annual-returns" element={<AnnualReturns />} />
            <Route path="/client/cipc/name-reservation" element={<NameReservation />} />
            <Route path="/client/cipc/shelf-company" element={<ShelfCompany />} />
            <Route path="/client/cipc/reinstatement" element={<Reinstatement />} />
            <Route path="/client/cipc/deregistration" element={<Deregistration />} />
            <Route path="/client/cipc/director-amendments" element={<DirectorAmendments />} />
            <Route path="/client/cipc/director-details" element={<DirectorDetails />} />
            <Route path="/client/cipc/officer-changes" element={<OfficerChanges />} />
            <Route path="/client/cipc/public-officer" element={<PublicOfficer />} />
            <Route path="/client/cipc/beneficial-ownership" element={<BeneficialOwnership />} />
            <Route path="/client/cipc/compliance-checklist" element={<ComplianceChecklist />} />
            <Route path="/client/cipc/moi-amendments" element={<MoiAmendments />} />
            <Route path="/client/cipc/fas" element={<Fas />} />
            <Route path="/client/cipc/address-changes" element={<AddressChanges />} />
            <Route path="/client/cipc/securities-register" element={<SecuritiesRegister />} />
            <Route path="/client/cipc/share-certificates" element={<ShareCertificates />} />
            <Route path="/client/cipc/share-transfers" element={<ShareTransfers />} />
            <Route path="/client/cipc/trademark" element={<Trademark />} />
            <Route path="/client/cipc/patent" element={<Patent />} />

            {/* Client Features */}
            <Route path="/client/documents" element={<Documents />} />
            <Route path="/client/signatures" element={<Signatures />} />
            <Route path="/client/messages" element={<Messages />} />
            <Route path="/client/billing" element={<Billing />} />
            <Route path="/client/reminders" element={<Reminders />} />
            <Route path="/client/mobile-scanner" element={<MobileScanner />} />
            <Route path="/client/tasks" element={<Tasks />} />
          </Route>

          {/* ── Staff portal (sidebar = purple) ─────────────────── */}
          <Route element={<RequireAuth><StaffLayout /></RequireAuth>}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />

            {/* Practice Management */}
            <Route path="/staff/time-tracking" element={<TimeTracking />} />
            <Route path="/staff/expenses" element={<Expenses />} />
            <Route path="/staff/wip" element={<Wip />} />
            <Route path="/staff/write-offs" element={<WriteOffs />} />
            <Route path="/staff/budget" element={<Budget />} />
            <Route path="/staff/review-queue" element={<ReviewQueue />} />
            <Route path="/staff/workflow" element={<Workflow />} />
            <Route path="/staff/utilization" element={<Utilization />} />
            <Route path="/staff/aged-receivables" element={<AgedReceivables />} />

            {/* Client & Engagements */}
            <Route path="/staff/financials" element={<Financials />} />
            <Route path="/staff/project-oversight" element={<ProjectOversight />} />
            <Route path="/staff/provisioning" element={<Provisioning />} />
            <Route path="/staff/resource-allocation" element={<ResourceAllocation />} />
            <Route path="/staff/strategic-planning" element={<StrategicPlanning />} />

            {/* HR & People */}
            <Route path="/staff/directory" element={<Directory />} />
            <Route path="/staff/leave" element={<Leave />} />
            <Route path="/staff/performance" element={<Performance />} />
            <Route path="/staff/onboarding" element={<Onboarding />} />
            <Route path="/staff/applicant-tracking" element={<ApplicantTracking />} />
            <Route path="/staff/cpe" element={<Cpe />} />
            <Route path="/staff/payroll-processing" element={<PayrollProcessing />} />

            {/* Tools */}
            <Route path="/staff/dms" element={<Dms />} />
            <Route path="/staff/communications" element={<Communications />} />
            <Route path="/staff/e-signatures" element={<ESignatures />} />
            <Route path="/staff/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/staff/software-integration" element={<SoftwareIntegration />} />
            <Route path="/staff/analytics" element={<Analytics />} />
            <Route path="/staff/security-logs" element={<SecurityLogs />} />
            <Route path="/staff/products" element={<ProductsManagement />} />
          </Route>

      </Routes>
    </Router>
  );
}
