import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AddressAutocomplete from "./AddressAutocomplete";
import "./ProfileDashboard.css";

const ProfileDashboard = () => {
  const { user, logout, updateProfile, uploadDocument, fetchProfile, deleteDocument, toggleDarkMode } = useAuth();
  
  // All hooks must be at the top level, before any conditional returns
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileData, setProfileData] = useState({});
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState([
    'taxTimeline', 'complianceStatus', 'cashFlow', 'documentUpload', 'messagePreview', 'taxTip'
  ]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [entityType, setEntityType] = useState('personal');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownRef] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    // Step 2: Entity Info
    personalInfo: {
      fullName: '',
      idTaxRef: '',
      employmentStatus: '',
      incomeBracket: ''
    },
    businessInfo: {
      registeredName: '',
      cipcNumber: '',
      industry: '',
      turnover: '',
      financialYearEnd: ''
    },
    // Step 3: Services
    services: [],
    // Step 4: Service Deep Dive
    serviceDetails: {
      taxPersonal: {
        incomeStreams: [],
        residency: ''
      },
      taxBusiness: {
        taxTypes: [],
        vatNumber: ''
      },
      cipc: {
        requestNature: ''
      },
      payroll: {
        employeeCount: '',
        payCycle: '',
        statutoryChecklist: []
      },
      advisory: {
        strategicFocus: [],
        currentSoftware: ''
      },
      transformation: {
        automationGoal: '',
        primaryERP: ''
      }
    },
    // Step 5: Documents
    documents: {},
    // Step 6: Contact
    contact: {
      email: '',
      phone: '',
      meetingTool: '',
      dataConsent: false
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    const result = await fetchProfile();
    if (result.success) {
      setProfileData(result.data.profile || {});
      setDocuments(result.data.documents || {});
    }
    setLoading(false);
  };

  const handleInputChange = (section, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (arg1, arg2, arg3) => {
    if (arg1 === "address") {
      return;
    }
    setProfileData((prev) => ({
      ...prev,
      [arg1]: {
        ...(prev[arg1] || {}),
        [arg2]: arg3,
      },
    }));
  };

  const handleDeepNestedInputChange = (section, subsection, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [subsection]: {
          ...(prev[section]?.[subsection] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleAddressChange = (section, field, subfield, value) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: {
          ...(prev[section]?.[field] || {}),
          [subfield]: value,
        },
      },
    }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const data = { [section]: profileData[section] };
    const result = await updateProfile(null, data);

    setSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Saved successfully!" });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocuments((prev) => ({
      ...prev,
      [documentType]: file.name,
    }));
  };

  const handleDeleteDocument = (documentType) => {
    setDocuments((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };

  const showMessage = (type, text) => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    setMessage({ type, text });
    if (type === "success") {
      const timeout = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      setMessageTimeout(timeout);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Widget definitions
  const widgetDefinitions = [
    { id: 'taxTimeline', name: 'Tax Timeline', category: 'Tax & Compliance', size: 'medium' },
    { id: 'taxLiability', name: 'Tax Liability Gauge', category: 'Tax & Compliance', size: 'small' },
    { id: 'complianceStatus', name: 'Compliance Status', category: 'Tax & Compliance', size: 'small' },
    { id: 'cashFlow', name: 'Cash Flow Sparkline', category: 'Financial Snapshot', size: 'medium' },
    { id: 'topExpenses', name: 'Top Expenses', category: 'Financial Snapshot', size: 'small' },
    { id: 'accountsReceivable', name: 'Accounts Receivable/Payable', category: 'Financial Snapshot', size: 'medium' },
    { id: 'documentUpload', name: 'Document Upload Box', category: 'Document & Workflow', size: 'small' },
    { id: 'pendingSignatures', name: 'Pending Signatures', category: 'Document & Workflow', size: 'small' },
    { id: 'recentDownloads', name: 'Recent Downloads', category: 'Document & Workflow', size: 'small' },
    { id: 'messagePreview', name: 'Message Preview', category: 'Communication & Support', size: 'small' },
    { id: 'serviceProgress', name: 'Service Progress Tracker', category: 'Communication & Support', size: 'small' },
    { id: 'bookCall', name: 'Book a Call', category: 'Communication & Support', size: 'small' },
    { id: 'taxTip', name: 'Tax Tip of the Week', category: 'Educational', size: 'small' },
    { id: 'videoHub', name: 'Video Hub', category: 'Educational', size: 'small' },
  ];

  const toggleWidget = (widgetId) => {
    setSelectedWidgets((prev) => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const renderWidget = (widgetId) => {
    const widget = widgetDefinitions.find(w => w.id === widgetId);
    if (!widget) return null;

    const sizeClass = widget.size === 'large' ? 'widget-large' : widget.size === 'medium' ? 'widget-medium' : 'widget-small';

    switch(widgetId) {
      case 'taxTimeline':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📅 Tax Timeline</h4>
            </div>
            <div className="widget-content">
              <div className="timeline-item">
                <span className="timeline-date">15 Apr</span>
                <span className="timeline-event">VAT Return Q1</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">31 May</span>
                <span className="timeline-event">Provisional Tax</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">30 Jun</span>
                <span className="timeline-event">Annual Financials</span>
              </div>
            </div>
          </div>
        );
      case 'taxLiability':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>💰 Tax Liability</h4>
            </div>
            <div className="widget-content">
              <div className="gauge-container">
                <div className="gauge">
                  <div className="gauge-fill" style={{ width: '65%' }}></div>
                </div>
                <div className="gauge-labels">
                  <span>R45,000</span>
                  <span>Estimated: R69,000</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'complianceStatus':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>✅ Compliance Status</h4>
            </div>
            <div className="widget-content">
              <div className="traffic-light green">
                <span className="light"></span>
                <span>All Clear</span>
              </div>
              <p className="status-text">All filings up to date</p>
            </div>
          </div>
        );
      case 'cashFlow':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📊 Cash Flow</h4>
            </div>
            <div className="widget-content">
              <div className="sparkline">
                <div className="sparkline-bar" style={{ height: '40%' }}></div>
                <div className="sparkline-bar" style={{ height: '60%' }}></div>
                <div className="sparkline-bar" style={{ height: '45%' }}></div>
                <div className="sparkline-bar" style={{ height: '75%' }}></div>
                <div className="sparkline-bar" style={{ height: '55%' }}></div>
                <div className="sparkline-bar" style={{ height: '85%' }}></div>
              </div>
              <div className="sparkline-labels">
                <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              </div>
            </div>
          </div>
        );
      case 'topExpenses':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📈 Top Expenses</h4>
            </div>
            <div className="widget-content">
              <div className="expense-item">
                <span className="expense-label">Payroll</span>
                <span className="expense-value">45%</span>
              </div>
              <div className="expense-item">
                <span className="expense-label">Rent</span>
                <span className="expense-value">25%</span>
              </div>
              <div className="expense-item">
                <span className="expense-label">Marketing</span>
                <span className="expense-value">15%</span>
              </div>
              <div className="expense-item">
                <span className="expense-label">Other</span>
                <span className="expense-value">15%</span>
              </div>
            </div>
          </div>
        );
      case 'accountsReceivable':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>💳 A/R & A/P</h4>
            </div>
            <div className="widget-content">
              <div className="account-balance receivable">
                <span className="balance-label">Receivable</span>
                <span className="balance-value">R125,000</span>
              </div>
              <div className="account-balance payable">
                <span className="balance-label">Payable</span>
                <span className="balance-value">R78,000</span>
              </div>
            </div>
          </div>
        );
      case 'documentUpload':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📁 Quick Upload</h4>
            </div>
            <div className="widget-content">
              <div className="upload-dropzone">
                <div className="upload-icon">☁️</div>
                <p>Drop files here or click to browse</p>
                <input type="file" className="upload-input" />
              </div>
            </div>
          </div>
        );
      case 'pendingSignatures':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>✍️ Pending Signatures</h4>
            </div>
            <div className="widget-content">
              <div className="signature-item">
                <span>2024 Tax Return</span>
                <button className="action-btn">Sign</button>
              </div>
              <div className="signature-item">
                <span>Engagement Letter</span>
                <button className="action-btn">Sign</button>
              </div>
            </div>
          </div>
        );
      case 'recentDownloads':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📥 Recent Downloads</h4>
            </div>
            <div className="widget-content">
              <div className="download-item">
                <span>📄 Q1 2024 Financials</span>
              </div>
              <div className="download-item">
                <span>📄 2023 Tax Return</span>
              </div>
              <div className="download-item">
                <span>📄 VAT Certificate</span>
              </div>
            </div>
          </div>
        );
      case 'messagePreview':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>💬 Message Preview</h4>
            </div>
            <div className="widget-content">
              <div className="message-snippet">
                <div className="message-from">From: Sarah (Accountant)</div>
                <p className="message-text">Your 2024 tax return is ready for review. Please check the Documents tab...</p>
                <span className="message-time">2 hours ago</span>
              </div>
            </div>
          </div>
        );
      case 'serviceProgress':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📋 Service Progress</h4>
            </div>
            <div className="widget-content">
              <div className="progress-item">
                <span>Year-End Accounts</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span className="progress-text">75%</span>
              </div>
              <div className="progress-item">
                <span>Tax Return</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '90%' }}></div>
                </div>
                <span className="progress-text">90%</span>
              </div>
            </div>
          </div>
        );
      case 'bookCall':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>📞 Book a Call</h4>
            </div>
            <div className="widget-content">
              <button className="book-call-btn">
                Schedule Appointment
              </button>
              <p className="book-hint">Quick 15-min consultation</p>
            </div>
          </div>
        );
      case 'taxTip':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>💡 Tax Tip of the Week</h4>
            </div>
            <div className="widget-content">
              <div className="tip-content">
                <p>Did you know? You can claim home office expenses if you work from home regularly. Keep track of your utility bills and internet costs!</p>
              </div>
            </div>
          </div>
        );
      case 'videoHub':
        return (
          <div key={widgetId} className={`widget ${sizeClass}`}>
            <div className="widget-header">
              <h4>🎥 Video Hub</h4>
            </div>
            <div className="widget-content">
              <div className="video-thumbnail">
                <div className="play-icon">▶</div>
                <span>2024 Tax Changes Explained</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const calculateProgress = (tabId) => {
    const sections = {
      personal: profileData.personalInfo || {},
      business: profileData.businessInfo || {},
      taxServices: profileData.services?.taxServices || {},
      cipcCompliance: profileData.services?.cipcCompliance || {},
      payroll: profileData.services?.payrollServices || {},
      accounting: profileData.services?.accountingAdvisory || {},
      taxTransformation: profileData.services?.taxTransformation || {},
      banking: profileData.bankingDetails || {},
      documents: documents || {}
    };
    
    const section = sections[tabId];
    if (!section) return 0;
    
    const keys = Object.keys(section);
    if (keys.length === 0) return 0;
    
    const filledFields = keys.filter(key => {
      const value = section[key];
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v && v !== '');
      }
      return value && value !== '';
    });
    
    return Math.round((filledFields.length / keys.length) * 100);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "documents", label: "FileVault", icon: "📁" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "tasks", label: "Tasks", icon: "✅" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "onboarding", label: "Onboarding", icon: "🚀" },
    { id: "taxcalendar", label: "Tax Calendar", icon: "📅" },
    { id: "guidelines", label: "Guidelines", icon: "📖" },
  ];

  const serviceOptions = [
    { id: "taxServices", name: "Tax Services", color: "#02255A" },
    { id: "cipcCompliance", name: "CIPC Compliance", color: "#BF080D" },
    { id: "payrollServices", name: "Payroll Services", color: "#059669" },
    { id: "accountingAdvisory", name: "Accounting Advisory", color: "#D97706" },
    { id: "taxTransformation", name: "Tax Transformation", color: "#7C3AED" },
  ];

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => 
      prev.includes(serviceId) && prev.length > 1
        ? prev.filter(id => id !== serviceId)
        : [...prev.filter(id => id !== serviceId), serviceId]
    );
  };

  // Helper to update onboarding data
  const updateOnboardingData = (path, value) => {
    setOnboardingData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Get total steps based on selected services
  const getTotalSteps = () => {
    return 4 + selectedServices.length + 2; // Step 1 + Step 2 + Services + Step 3 + Step 4 + Step 5 + Step 6
  };

  // Calculate current step name for progress
  const getStepName = (step) => {
    if (step === 1) return 'Entity Type';
    if (step === 2) return 'Entity Info';
    if (step === 3) return 'Services';
    if (step > 3 && step <= 3 + selectedServices.length) {
      const serviceIndex = step - 4;
      return serviceOptions[serviceIndex]?.name || `Service ${serviceIndex + 1}`;
    }
    if (step === 4 + selectedServices.length) return 'Documents';
    if (step === 5 + selectedServices.length) return 'Contact';
    return '';
  };

  // Validate email format (work email)
  const isValidWorkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !email.includes('@gmail.com') && !email.includes('@yahoo.com') && !email.includes('@hotmail.com');
  };

  // Handle form submission
  const handleSubmitOnboarding = async () => {
    if (!onboardingData.contact.dataConsent) {
      showMessage('error', 'Please accept the data consent to proceed.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    showMessage('success', 'Your consultation request has been submitted successfully!');
  };

  // Options for form fields
  const employmentStatusOptions = ['Salaried', 'Sole Proprietor', 'Retired', 'HNW (High Net Worth)'];
  const incomeBracketOptions = ['< R500k', 'R500k - R1M', 'R1M - R5M', 'R5M - R10M', '> R10M'];
  const industryOptions = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Professional Services', 'Other'];
  const turnoverOptions = ['< R1M', 'R1M - R10M', 'R10M - R50M', 'R50M - R100M', '> R100M'];
  const financialYearEndOptions = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'];
  const incomeStreamOptions = ['Employment Income', 'Investment Income', 'Rental Income', 'Business Income', 'Capital Gains', 'Foreign Income', 'Other'];
  const residencyOptions = ['South African Tax Resident', 'Non-Resident', 'Dual Resident'];
  const taxTypeOptions = ['Corporate Income Tax', 'VAT', 'PAYE', 'Withholding Tax', 'Dividends Tax', 'Transfer Duty'];
  const cipcRequestOptions = ['New Company Registration', 'Annual Returns', 'Director Changes', 'Share Transfers', 'Name Change', 'Deregistration'];
  const employeeCountOptions = ['1-5', '6-20', '21-50', '51-100', '100+'];
  const payCycleOptions = ['Monthly', 'Weekly', 'Bi-weekly', 'Semi-monthly'];
  const statutoryOptions = ['UIF', 'SDL', 'PAYE', 'ETI'];
  const strategicFocusOptions = ['Financial Planning', 'Risk Management', 'Cost Optimization', 'Growth Strategy', 'Succession Planning'];
  const softwareOptions = ['QuickBooks', 'Xero', 'Sage', 'Pastel', 'Microsoft Dynamics', 'Other'];
  const automationGoalOptions = ['Process Automation', 'Data Integration', 'Reporting Automation', 'Compliance Automation'];
  const erpOptions = ['SAP', 'Oracle', 'Microsoft Dynamics', 'Sage', 'Other'];
  const meetingToolOptions = ['Zoom', 'Microsoft Teams', 'Google Meet', 'Phone Call', 'In-Person'];

  // Document requirements based on service and entity type
  const getDocumentRequirements = () => {
    const docs = [];
    
    // Common documents
    if (entityType === 'personal') {
      docs.push({ type: 'id_document', label: 'ID Document / Passport', hint: 'PDF, JPG, PNG (Max 5MB)' });
      docs.push({ type: 'proof_address', label: 'Proof of Address', hint: 'Utility bill, Bank statement (Max 5MB)' });
    } else {
      docs.push({ type: 'company_registration', label: 'Company Registration Documents', hint: 'CoR 14.3, CoR 21.4 (Max 5MB)' });
      docs.push({ type: 'bank_confirmation', label: 'Bank Confirmation Letter', hint: 'Recent bank statement (Max 5MB)' });
    }

    // Service-specific documents
    if (selectedServices.includes('taxServices')) {
      if (entityType === 'personal') {
        docs.push({ type: 'irp5', label: 'IRP5/IT3(a) Certificates', hint: 'All employment income certificates (Max 5MB)' });
        docs.push({ type: 'investment_income', label: 'Investment Income Statements', hint: 'IT3(b), IT3(c) (Max 5MB)' });
      } else {
        docs.push({ type: 'management_accounts', label: 'Management Accounts', hint: 'Latest management accounts (Max 5MB)' });
        docs.push({ type: 'vat_returns', label: 'VAT Returns', hint: 'Last 12 months VAT201 (Max 5MB)' });
      }
    }

    if (selectedServices.includes('accountingAdvisory')) {
      docs.push({ type: 'financial_statements', label: 'Financial Statements', hint: 'Latest AFS or management accounts (Max 5MB)' });
      docs.push({ type: 'budget_forecast', label: 'Budget/Forecast', hint: 'Current year budget (Max 5MB)' });
    }

    if (selectedServices.includes('payrollServices')) {
      docs.push({ type: 'payroll_register', label: 'Current Payroll Register', hint: 'Latest payroll report (Max 5MB)' });
      docs.push({ type: 'emp201', label: 'EMP201 Declarations', hint: 'Last 12 months (Max 5MB)' });
    }

    if (selectedServices.includes('cipcCompliance')) {
      docs.push({ type: 'cor14_3', label: 'CoR 14.3', hint: 'Company registration certificate (Max 5MB)' });
      docs.push({ type: 'cor21_4', label: 'CoR 21.4', hint: 'Share certificates (Max 5MB)' });
    }

    if (selectedServices.includes('taxTransformation')) {
      docs.push({ type: 'current_erp', label: 'Current ERP System Details', hint: 'System documentation (Max 5MB)' });
      docs.push({ type: 'process_map', label: 'Process Maps', hint: 'Current tax processes (Max 5MB)' });
    }

    return docs;
  };

  // Get step name for display
  const getCurrentStepTitle = () => {
    if (currentPage === 1) return 'Select Entity Type';
    if (currentPage === 2) return 'Entity Information';
    if (currentPage === 3) return 'Select Services';
    if (currentPage > 3 && currentPage <= 3 + selectedServices.length) {
      const serviceIndex = currentPage - 4;
      return `${serviceOptions[serviceIndex]?.name} Details`;
    }
    if (currentPage === 4 + selectedServices.length) return 'Document Uploads';
    if (currentPage === 5 + selectedServices.length) return 'Contact Information';
    return '';
  };

  // Render the onboarding form based on current page
  const renderOnboardingPage = () => {
    // Success state
    if (submitted) {
      return (
        <div className="onboarding-success">
          <div className="success-icon">✓</div>
          <h3>Request Submitted Successfully!</h3>
          <p>A partner will review your data and contact you within 24 business hours.</p>
          <button className="save-button" onClick={() => { setSubmitted(false); setCurrentPage(1); }}>
            Start New Request
          </button>
        </div>
      );
    }

    // Step 1: Entity Type
    if (currentPage === 1) {
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>📋 Select Entity Type</h3>
            <p className="section-description">Are you onboarding as an individual or a business entity?</p>
            <div className="entity-selection">
              <button
                className={`entity-option ${entityType === 'personal' ? 'selected' : ''}`}
                onClick={() => { setEntityType('personal'); setSelectedServices([]); }}
              >
                <div className="entity-checkbox">
                  {entityType === 'personal' && <span>✓</span>}
                </div>
                <div className="entity-details">
                  <span className="entity-name">Individual / Personal</span>
                  <span className="entity-description">For personal tax services and individual advisory</span>
                </div>
              </button>
              <button
                className={`entity-option ${entityType === 'business' ? 'selected' : ''}`}
                onClick={() => { setEntityType('business'); setSelectedServices([]); }}
              >
                <div className="entity-checkbox">
                  {entityType === 'business' && <span>✓</span>}
                </div>
                <div className="entity-details">
                  <span className="entity-name">Business / Entity</span>
                  <span className="entity-description">For company tax, CIPC, payroll and business advisory</span>
                </div>
              </button>
            </div>
          </div>

          <div className="onboarding-actions">
            <button 
              className="save-button"
              onClick={() => setCurrentPage(2)}
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    // Step 2: Entity Information
    if (currentPage === 2) {
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>📝 Entity Information</h3>
            <p className="section-description">Please provide details about the entity being onboarded.</p>
            
            {entityType === 'personal' ? (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={onboardingData.personalInfo.fullName}
                    onChange={(e) => updateOnboardingData('personalInfo.fullName', e.target.value)}
                    placeholder="Enter your full legal name"
                  />
                </div>
                <div className="form-group">
                  <label>ID Number / Tax Reference *</label>
                  <input
                    type="text"
                    value={onboardingData.personalInfo.idTaxRef}
                    onChange={(e) => updateOnboardingData('personalInfo.idTaxRef', e.target.value)}
                    placeholder="Enter ID number or tax reference"
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status *</label>
                  <select
                    value={onboardingData.personalInfo.employmentStatus}
                    onChange={(e) => updateOnboardingData('personalInfo.employmentStatus', e.target.value)}
                  >
                    <option value="">Select status</option>
                    {employmentStatusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Annual Income Bracket *</label>
                  <select
                    value={onboardingData.personalInfo.incomeBracket}
                    onChange={(e) => updateOnboardingData('personalInfo.incomeBracket', e.target.value)}
                  >
                    <option value="">Select income bracket</option>
                    {incomeBracketOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Registered Company Name *</label>
                  <input
                    type="text"
                    value={onboardingData.businessInfo.registeredName}
                    onChange={(e) => updateOnboardingData('businessInfo.registeredName', e.target.value)}
                    placeholder="Enter registered company name"
                  />
                </div>
                <div className="form-group">
                  <label>CIPC Registration Number *</label>
                  <input
                    type="text"
                    value={onboardingData.businessInfo.cipcNumber}
                    onChange={(e) => updateOnboardingData('businessInfo.cipcNumber', e.target.value)}
                    placeholder="e.g., 2024/123456/07"
                  />
                </div>
                <div className="form-group">
                  <label>Industry *</label>
                  <select
                    value={onboardingData.businessInfo.industry}
                    onChange={(e) => updateOnboardingData('businessInfo.industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {industryOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Annual Turnover *</label>
                  <select
                    value={onboardingData.businessInfo.turnover}
                    onChange={(e) => updateOnboardingData('businessInfo.turnover', e.target.value)}
                  >
                    <option value="">Select turnover range</option>
                    {turnoverOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Financial Year-End *</label>
                  <select
                    value={onboardingData.businessInfo.financialYearEnd}
                    onChange={(e) => updateOnboardingData('businessInfo.financialYearEnd', e.target.value)}
                  >
                    <option value="">Select month</option>
                    {financialYearEndOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="onboarding-actions">
            <button 
              className="secondary-button"
              onClick={() => setCurrentPage(1)}
            >
              Back
            </button>
            <button 
              className="save-button"
              onClick={() => setCurrentPage(3)}
              disabled={
                (entityType === 'personal' && (!onboardingData.personalInfo.fullName || !onboardingData.personalInfo.idTaxRef || !onboardingData.personalInfo.employmentStatus || !onboardingData.personalInfo.incomeBracket)) ||
                (entityType === 'business' && (!onboardingData.businessInfo.registeredName || !onboardingData.businessInfo.cipcNumber || !onboardingData.businessInfo.industry || !onboardingData.businessInfo.turnover || !onboardingData.businessInfo.financialYearEnd))
              }
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    // Step 3: Select Services
    if (currentPage === 3) {
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>🛠️ Select Services</h3>
            <p className="section-description">Choose the services you require. You can select multiple services.</p>
            <div className="services-selection">
              {serviceOptions
                .filter(service => {
                  // CIPC and Payroll are business only
                  if (entityType === 'personal' && (service.id === 'cipcCompliance' || service.id === 'payrollServices')) {
                    return false;
                  }
                  return true;
                })
                .map(service => (
                  <button
                    key={service.id}
                    className={`service-option ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                    style={{ 
                      '--service-color': service.color,
                      borderColor: selectedServices.includes(service.id) ? service.color : '#e0e0e0'
                    }}
                    onClick={() => {
                      setSelectedServices((prev) => 
                        prev.includes(service.id)
                          ? prev.filter(id => id !== service.id)
                          : [...prev, service.id]
                      );
                    }}
                  >
                    <div className="service-checkbox">
                      {selectedServices.includes(service.id) && <span>✓</span>}
                    </div>
                    <span className="service-name">{service.name}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="onboarding-actions">
            <button 
              className="secondary-button"
              onClick={() => setCurrentPage(2)}
            >
              Back
            </button>
            <button 
              className="save-button"
              onClick={() => setCurrentPage(4)}
              disabled={selectedServices.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    // Step 4: Service Deep Dive (dynamic based on selected services)
    const serviceIndex = currentPage - 4;
    if (currentPage > 3 && currentPage <= 3 + selectedServices.length) {
      const serviceId = selectedServices[serviceIndex];
      const service = serviceOptions.find(s => s.id === serviceId);
      
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>{service?.name} Details</h3>
            <p className="section-description">Please provide additional information for {service?.name.toLowerCase()}.</p>
            
            {serviceId === 'taxServices' && entityType === 'personal' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Income Streams (Select all that apply) *</label>
                  <div className="checkbox-group">
                    {incomeStreamOptions.map(opt => (
                      <label key={opt}>
                        <input
                          type="checkbox"
                          checked={onboardingData.serviceDetails.taxPersonal.incomeStreams.includes(opt)}
                          onChange={(e) => {
                            const current = [...onboardingData.serviceDetails.taxPersonal.incomeStreams];
                            if (e.target.checked) {
                              current.push(opt);
                            } else {
                              const idx = current.indexOf(opt);
                              if (idx > -1) current.splice(idx, 1);
                            }
                            updateOnboardingData('serviceDetails.taxPersonal.incomeStreams', current);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Tax Residency Status *</label>
                  <select
                    value={onboardingData.serviceDetails.taxPersonal.residency}
                    onChange={(e) => updateOnboardingData('serviceDetails.taxPersonal.residency', e.target.value)}
                  >
                    <option value="">Select residency status</option>
                    {residencyOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {serviceId === 'taxServices' && entityType === 'business' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tax Types Required (Select all that apply) *</label>
                  <div className="checkbox-group">
                    {taxTypeOptions.map(opt => (
                      <label key={opt}>
                        <input
                          type="checkbox"
                          checked={onboardingData.serviceDetails.taxBusiness.taxTypes.includes(opt)}
                          onChange={(e) => {
                            const current = [...onboardingData.serviceDetails.taxBusiness.taxTypes];
                            if (e.target.checked) {
                              current.push(opt);
                            } else {
                              const idx = current.indexOf(opt);
                              if (idx > -1) current.splice(idx, 1);
                            }
                            updateOnboardingData('serviceDetails.taxBusiness.taxTypes', current);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>VAT Registration Number</label>
                  <input
                    type="text"
                    value={onboardingData.serviceDetails.taxBusiness.vatNumber}
                    onChange={(e) => updateOnboardingData('serviceDetails.taxBusiness.vatNumber', e.target.value)}
                    placeholder="e.g., 4000123456"
                  />
                </div>
              </div>
            )}

            {serviceId === 'cipcCompliance' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nature of Request *</label>
                  <select
                    value={onboardingData.serviceDetails.cipc.requestNature}
                    onChange={(e) => updateOnboardingData('serviceDetails.cipc.requestNature', e.target.value)}
                  >
                    <option value="">Select request type</option>
                    {cipcRequestOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {serviceId === 'payrollServices' && (
              <div className="form-grid">
                <div className="form-group">
                  <label>Number of Employees *</label>
                  <select
                    value={onboardingData.serviceDetails.payroll.employeeCount}
                    onChange={(e) => updateOnboardingData('serviceDetails.payroll.employeeCount', e.target.value)}
                  >
                    <option value="">Select count</option>
                    {employeeCountOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pay Cycle *</label>
                  <select
                    value={onboardingData.serviceDetails.payroll.payCycle}
                    onChange={(e) => updateOnboardingData('serviceDetails.payroll.payCycle', e.target.value)}
                  >
                    <option value="">Select cycle</option>
                    {payCycleOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Statutory Requirements (Select all that apply) *</label>
                  <div className="checkbox-group">
                    {statutoryOptions.map(opt => (
                      <label key={opt}>
                        <input
                          type="checkbox"
                          checked={onboardingData.serviceDetails.payroll.statutoryChecklist.includes(opt)}
                          onChange={(e) => {
                            const current = [...onboardingData.serviceDetails.payroll.statutoryChecklist];
                            if (e.target.checked) {
                              current.push(opt);
                            } else {
                              const idx = current.indexOf(opt);
                              if (idx > -1) current.splice(idx, 1);
                            }
                            updateOnboardingData('serviceDetails.payroll.statutoryChecklist', current);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {serviceId === 'accountingAdvisory' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Strategic Focus Areas (Select all that apply) *</label>
                  <div className="checkbox-group">
                    {strategicFocusOptions.map(opt => (
                      <label key={opt}>
                        <input
                          type="checkbox"
                          checked={onboardingData.serviceDetails.advisory.strategicFocus.includes(opt)}
                          onChange={(e) => {
                            const current = [...onboardingData.serviceDetails.advisory.strategicFocus];
                            if (e.target.checked) {
                              current.push(opt);
                            } else {
                              const idx = current.indexOf(opt);
                              if (idx > -1) current.splice(idx, 1);
                            }
                            updateOnboardingData('serviceDetails.advisory.strategicFocus', current);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Current Accounting Software *</label>
                  <select
                    value={onboardingData.serviceDetails.advisory.currentSoftware}
                    onChange={(e) => updateOnboardingData('serviceDetails.advisory.currentSoftware', e.target.value)}
                  >
                    <option value="">Select software</option>
                    {softwareOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {serviceId === 'taxTransformation' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Automation Goals *</label>
                  <select
                    value={onboardingData.serviceDetails.transformation.automationGoal}
                    onChange={(e) => updateOnboardingData('serviceDetails.transformation.automationGoal', e.target.value)}
                  >
                    <option value="">Select primary goal</option>
                    {automationGoalOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Primary ERP System *</label>
                  <select
                    value={onboardingData.serviceDetails.transformation.primaryERP}
                    onChange={(e) => updateOnboardingData('serviceDetails.transformation.primaryERP', e.target.value)}
                  >
                    <option value="">Select ERP</option>
                    {erpOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="onboarding-actions">
            <button 
              className="secondary-button"
              onClick={() => currentPage === 4 ? setCurrentPage(3) : setCurrentPage(currentPage - 1)}
            >
              Back
            </button>
            <button 
              className="save-button"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {serviceIndex === selectedServices.length - 1 ? 'Continue to Documents' : 'Next Service'}
            </button>
          </div>
        </div>
      );
    }

    // Step 5: Document Uploads
    if (currentPage === 4 + selectedServices.length) {
      const docRequirements = getDocumentRequirements();
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>📄 Document Uploads</h3>
            <p className="section-description">Please upload the required documents. Drag and drop files or click to browse.</p>
            
            <div className="upload-section">
              {docRequirements.map(doc => (
                <div key={doc.type} className="upload-item">
                  <label>{doc.label}</label>
                  <div className="drag-drop-zone">
                    <div className="dropzone-content">
                      <div className="dropzone-icon">📁</div>
                      <p>Drag & drop file here or click to browse</p>
                      <input 
                        type="file" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            updateOnboardingData(`documents.${doc.type}`, file.name);
                          }
                        }}
                      />
                    </div>
                  </div>
                  {onboardingData.documents[doc.type] && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {onboardingData.documents[doc.type]}</span>
                      <button 
                        className="remove-doc-button"
                        onClick={() => updateOnboardingData(`documents.${doc.type}`, '')}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <span className="upload-hint">{doc.hint}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="onboarding-actions">
            <button 
              className="secondary-button"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Back
            </button>
            <button 
              className="save-button"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Continue to Contact
            </button>
          </div>
        </div>
      );
    }

    // Step 6: Contact Information
    if (currentPage === 5 + selectedServices.length) {
      return (
        <div className="onboarding-page">
          <div className="onboarding-section">
            <h3>📧 Contact Information</h3>
            <p className="section-description">Provide your contact details so we can reach you about your consultation.</p>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Work Email Address *</label>
                <input
                  type="email"
                  value={onboardingData.contact.email}
                  onChange={(e) => updateOnboardingData('contact.email', e.target.value)}
                  placeholder="your.name@company.com"
                />
                {onboardingData.contact.email && !isValidWorkEmail(onboardingData.contact.email) && (
                  <span className="field-error">Please enter a valid work email address</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={onboardingData.contact.phone}
                  onChange={(e) => updateOnboardingData('contact.phone', e.target.value)}
                  placeholder="+27 XX XXX XXXX"
                />
              </div>
              <div className="form-group full-width">
                <label>Preferred Meeting Tool *</label>
                <select
                  value={onboardingData.contact.meetingTool}
                  onChange={(e) => updateOnboardingData('contact.meetingTool', e.target.value)}
                >
                  <option value="">Select meeting tool</option>
                  {meetingToolOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={onboardingData.contact.dataConsent}
                    onChange={(e) => updateOnboardingData('contact.dataConsent', e.target.checked)}
                  />
                  <span>I consent to ICBP processing my personal data in accordance with the POPIA and privacy policy. *</span>
                </label>
              </div>
            </div>
          </div>

          <div className="onboarding-actions">
            <button 
              className="secondary-button"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Back
            </button>
            <button 
              className="save-button submit-button"
              onClick={handleSubmitOnboarding}
              disabled={
                isSubmitting ||
                !isValidWorkEmail(onboardingData.contact.email) ||
                !onboardingData.contact.phone ||
                !onboardingData.contact.meetingTool ||
                !onboardingData.contact.dataConsent
              }
            >
              {isSubmitting ? 'Submitting...' : 'Request Secure Consultation'}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ICBP Client Portal</h1>
          <div className="header-actions">
            <span className="user-email">{user?.email}</span>
            <div className="profile-dropdown" ref={dropdownRef}>
              <button 
                className="profile-button" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="profile-avatar">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">Account Settings</div>
                    <button className="dropdown-item">
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                      </svg>
                      Profile
                    </button>
                    <button className="dropdown-item">
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" fill="currentColor"/>
                        <path d="M12 19.5c-4.7 0-9 2.5-9 4v1h18v-1c0-1.5-4.3-4-9-4z" fill="currentColor"/>
                      </svg>
                      Security & MFA
                    </button>
                    <button className="dropdown-item">
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
                      </svg>
                      Notifications
                    </button>
                  </div>
                  
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">Entity Management</div>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setShowEntityModal(true);
                        setDropdownOpen(false);
                      }}
                    >
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Switch Accounts
                    </button>
                  </div>
                  
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">Billing</div>
                    <button className="dropdown-item">
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm0 12H5V7h14v10z" fill="currentColor"/>
                        <path d="M5 9h14v2H5zM5 13h10v2H5z" fill="currentColor"/>
                      </svg>
                      View Invoices
                    </button>
                  </div>
                  
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">UI Preferences</div>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        toggleDarkMode();
                        setDropdownOpen(false);
                      }}
                    >
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm7.07 3.07a1 1 0 00-1.41-1.41l-.7.71-.71-.7a1 1 0 10-1.42 1.42l.71.71-.71.71a1 1 0 101.42 1.42l.71-.71.71.71a1 1 0 101.41-1.41l-.7-.71.7-.71zM4.93 4.93a1 1 0 00-1.41 1.41l.7.71-.71.71a1 1 0 101.41 1.41l.71-.7.71.7a1 1 0 101.42-1.42l-.71-.71.71-.71a1 1 0 00-1.42-1.41l-.71.7-.7-.7zM12 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.28-4a1 1 0 011.41 0l.71.71.71-.71a1 1 0 111.41 1.41l-.7.71.7.71a1 1 0 11-1.41 1.41l-.71-.7-.71.71a1 1 0 11-1.41-1.41l.7-.71-.7-.71a1 1 0 010-1.41zM19 11a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" fill="currentColor"/>
                      </svg>
                      Toggle Dark Mode
                    </button>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M17 7l5 5m0 0l-5 5m5-5H9m-4 0h-.2a2 2 0 01-2-2V9a2 2 0 012-2H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="dashboard-content">
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          {activeTab === "dashboard" && (
            <div className="dashboard-tab">
              <div className="dashboard-header-section">
                <h2>Dashboard Overview</h2>
                <button 
                  className="widget-gallery-btn"
                  onClick={() => setShowWidgetGallery(!showWidgetGallery)}
                >
                  🎨 Widget Gallery
                </button>
              </div>

              {showWidgetGallery && (
                <div className="widget-gallery">
                  <h3>Customize Your Dashboard</h3>
                  <div className="widget-categories">
                    {['Tax & Compliance', 'Financial Snapshot', 'Document & Workflow', 'Communication & Support', 'Educational'].map(category => (
                      <div key={category} className="widget-category">
                        <h4>{category}</h4>
                        <div className="widget-options">
                          {widgetDefinitions.filter(w => w.category === category).map(widget => (
                            <label key={widget.id} className="widget-option">
                              <input
                                type="checkbox"
                                checked={selectedWidgets.includes(widget.id)}
                                onChange={() => toggleWidget(widget.id)}
                              />
                              <span>{widget.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="widget-grid">
                {selectedWidgets.map(widgetId => renderWidget(widgetId))}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="documents-tab">
              <h2>📁 FileVault - Secure Document Hub</h2>
              <div className="filevault-sections">
                <div className="filevault-section">
                  <h3>📤 Uploads</h3>
                  <p>Securely upload tax files, receipts, and invoices</p>
                  <div className="upload-zone">
                    <div className="upload-dropzone-large">
                      <div className="upload-icon">☁️</div>
                      <p>Drag & drop files here or click to browse</p>
                      <input type="file" multiple />
                    </div>
                  </div>
                </div>
                <div className="filevault-section">
                  <h3>📂 Shared Files</h3>
                  <p>Access completed paperwork, past tax filings, and financial reports</p>
                  <div className="shared-files-list">
                    <div className="file-item">
                      <span>📄 2023 Annual Financial Statements</span>
                      <span className="file-date">Mar 2024</span>
                    </div>
                    <div className="file-item">
                      <span>📄 2023 Tax Return (ITR14)</span>
                      <span className="file-date">Feb 2024</span>
                    </div>
                    <div className="file-item">
                      <span>📄 Q4 2023 VAT Return</span>
                      <span className="file-date">Jan 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="reports-tab">
              <h2>📈 Financial Reports</h2>
              <div className="reports-grid">
                <div className="report-card">
                  <h4>Profit & Loss Statement</h4>
                  <p>View income, expenses, and net profit</p>
                  <button className="report-btn">View Report</button>
                </div>
                <div className="report-card">
                  <h4>Balance Sheet</h4>
                  <p>Assets, liabilities, and equity overview</p>
                  <button className="report-btn">View Report</button>
                </div>
                <div className="report-card">
                  <h4>Cash Flow Statement</h4>
                  <p>Operating, investing, and financing cash flows</p>
                  <button className="report-btn">View Report</button>
                </div>
                <div className="report-card">
                  <h4>KPI Dashboard</h4>
                  <p>Key performance indicators and metrics</p>
                  <button className="report-btn">View Report</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="tasks-tab">
              <h2>✅ Task Center</h2>
              <div className="tasks-list">
                <div className="task-item urgent">
                  <div className="task-priority">🔴 Urgent</div>
                  <div className="task-content">
                    <h4>Submit Q1 2024 VAT Documents</h4>
                    <p>Upload all supporting documents for Q1 VAT return</p>
                    <span className="task-due">Due: 15 Apr 2024</span>
                  </div>
                  <button className="task-action">Upload</button>
                </div>
                <div className="task-item">
                  <div className="task-priority">🟡 Pending</div>
                  <div className="task-content">
                    <h4>Review 2024 Tax Return Draft</h4>
                    <p>Please review and approve the draft tax return</p>
                    <span className="task-due">Due: 30 Apr 2024</span>
                  </div>
                  <button className="task-action">Review</button>
                </div>
                <div className="task-item">
                  <div className="task-priority">🟢 In Progress</div>
                  <div className="task-content">
                    <h4>Update Banking Details</h4>
                    <p>Provide updated bank statement for verification</p>
                    <span className="task-due">Due: 15 May 2024</span>
                  </div>
                  <button className="task-action">Update</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="messages-tab">
              <h2>💬 Secure Messaging</h2>
              <div className="messages-layout">
                <div className="messages-list">
                  <div className="message-thread active">
                    <div className="thread-avatar">S</div>
                    <div className="thread-info">
                      <h4>Sarah (Accountant)</h4>
                      <p>Your 2024 tax return is ready...</p>
                    </div>
                    <span className="thread-time">2h ago</span>
                  </div>
                  <div className="message-thread">
                    <div className="thread-avatar">M</div>
                    <div className="thread-info">
                      <h4>Michael (Tax Specialist)</h4>
                      <p>VAT query resolved</p>
                    </div>
                    <span className="thread-time">1d ago</span>
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <h4>Sarah (Accountant)</h4>
                  </div>
                  <div className="messages-container">
                    <div className="message received">
                      <p>Hi there! Your 2024 tax return is ready for review. I've uploaded it to the Documents tab. Please take a look and let me know if you have any questions.</p>
                      <span className="message-time">2 hours ago</span>
                    </div>
                    <div className="message sent">
                      <p>Thank you Sarah! I'll review it today.</p>
                      <span className="message-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="message-input">
                    <input type="text" placeholder="Type your message..." />
                    <button className="send-btn">Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "onboarding" && (
            <div className="onboarding-tab">
              <h2>🚀 Onboarding Center</h2>
              
              {/* Page Progress Indicator */}
              <div className="onboarding-progress">
                {Array.from({ length: getTotalSteps() }, (_, i) => {
                  const step = i + 1;
                  const isActive = step <= currentPage;
                  const isCurrent = step === currentPage;
                  
                  return (
                    <div 
                      key={step} 
                      className={`progress-step ${isCurrent ? 'active' : ''} ${isActive ? 'completed' : ''}`}
                    >
                      {getStepName(step)}
                    </div>
                  );
                })}
              </div>

              {/* Render the appropriate onboarding page */}
              {renderOnboardingPage()}
            </div>
          )}

          {activeTab === "taxcalendar" && (
            <div className="taxcalendar-tab">
              <h2>📅 Tax Calendar</h2>
              <div className="calendar-layout">
                <div className="calendar-sidebar">
                  <h4>Upcoming Deadlines</h4>
                  <div className="calendar-events">
                    <div className="calendar-event urgent">
                      <div className="event-date">
                        <span className="event-day">15</span>
                        <span className="event-month">Apr</span>
                      </div>
                      <div className="event-info">
                        <h5>VAT Return Q1</h5>
                        <p>Submit VAT201 form</p>
                      </div>
                    </div>
                    <div className="calendar-event">
                      <div className="event-date">
                        <span className="event-day">31</span>
                        <span className="event-month">May</span>
                      </div>
                      <div className="event-info">
                        <h5>Provisional Tax</h5>
                        <p>First provisional payment</p>
                      </div>
                    </div>
                    <div className="calendar-event">
                      <div className="event-date">
                        <span className="event-day">30</span>
                        <span className="event-month">Jun</span>
                      </div>
                      <div className="event-info">
                        <h5>Annual Financials</h5>
                        <p>Submit AFS to CIPC</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="calendar-main">
                  <div className="calendar-grid">
                    <div className="calendar-header">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                    <div className="calendar-days">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 2;
                        const isToday = day === 11;
                        const hasEvent = [15, 31].includes(day);
                        return (
                          <div 
                            key={i} 
                            className={`calendar-day ${day <= 0 || day > 30 ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
                          >
                            {day > 0 && day <= 30 ? day : ''}
                            {hasEvent && <div className="event-dot"></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "guidelines" && (
            <div className="guidelines-tab">
              <h2>📖 Guidelines & Resources</h2>
              <div className="guidelines-grid">
                <div className="guideline-card">
                  <h4>📋 Accounting Guidelines</h4>
                  <p>Our internal policies and procedures for financial reporting</p>
                  <button className="guideline-btn">View Guidelines</button>
                </div>
                <div className="guideline-card">
                  <h4>📚 Tax Resources</h4>
                  <p>Educational materials and tax planning guides</p>
                  <button className="guideline-btn">View Resources</button>
                </div>
                <div className="guideline-card">
                  <h4>🎥 Video Tutorials</h4>
                  <p>How-to videos for using the portal and tax processes</p>
                  <button className="guideline-btn">Watch Videos</button>
                </div>
                <div className="guideline-card">
                  <h4>❓ FAQ</h4>
                  <p>Frequently asked questions and answers</p>
                  <button className="guideline-btn">View FAQ</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;