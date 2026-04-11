import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AddressAutocomplete from "./AddressAutocomplete";
import "./ProfileDashboard.css";

const ProfileDashboard = () => {
  const { user, logout, updateProfile, uploadDocument, fetchProfile, deleteDocument, toggleDarkMode } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState({});
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const dropdownRef = useRef(null);

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

  // For nested fields like personalInfo.fullName, businessInfo.registeredName
  // Also handles AddressAutocomplete which passes (field, subfield, value)
  const handleNestedInputChange = (arg1, arg2, arg3) => {
    // If arg1 is "address", it's from AddressAutocomplete (field, subfield, value)
    if (arg1 === "address") {
      // This is called from AddressAutocomplete with (field, subfield, value)
      // We need to handle this in the parent component's onChange
      return;
    }
    // Otherwise it's (section, field, value)
    setProfileData((prev) => ({
      ...prev,
      [arg1]: {
        ...(prev[arg1] || {}),
        [arg2]: arg3,
      },
    }));
  };

  // For deeply nested fields like services.taxServices.sarsEfilingUsername
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

  // Handler for AddressAutocomplete - takes (field, subfield, value)
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

    // Store the file name in state (will be uploaded on save)
    setDocuments((prev) => ({
      ...prev,
      [documentType]: file.name,
    }));
  };

  const handleDeleteDocument = (documentType) => {
    // Remove from local state (will be deleted from DB on save)
    setDocuments((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };

  const showMessage = (type, text) => {
    // Clear any existing timeout
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }

    setMessage({ type, text });

    // Auto-dismiss after 3 seconds for success messages
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Calculate progress for each tab
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
    { id: "personal", label: "Personal Information", group: "Profile" },
    { id: "business", label: "Business Information", group: "Profile" },
    { id: "taxServices", label: "Tax Services", group: "Services & Compliance" },
    { id: "cipcCompliance", label: "CIPC Compliance", group: "Services & Compliance" },
    { id: "payroll", label: "Payroll Services", group: "Services & Compliance" },
    { id: "accounting", label: "Accounting Advisory", group: "Services & Compliance" },
    { id: "taxTransformation", label: "Tax Transformation", group: "Services & Compliance" },
    { id: "banking", label: "Banking Details", group: "Profile" },
    { id: "documents", label: "Document Uploads", group: "File Center" },
  ];

  // Group tabs by category
  const tabGroups = {
    "Profile": tabs.filter(tab => tab.group === "Profile"),
    "Services & Compliance": tabs.filter(tab => tab.group === "Services & Compliance"),
    "File Center": tabs.filter(tab => tab.group === "File Center")
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
                <span className="profile-name">{user?.email}</span>
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

      <div className="dashboard-content">
        <nav className="tabs-nav">
          {Object.entries(tabGroups).map(([groupName, groupTabs]) => (
            <div key={groupName} className="tab-group">
              <div className="tab-group-label">{groupName}</div>
              <div className="tab-group-tabs">
                {groupTabs.map((tab) => {
                  const progress = calculateProgress(tab.id);
                  return (
                    <button
                      key={tab.id}
                      className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="tab-label">{tab.label}</span>
                      <div className="tab-progress">
                        <div 
                          className="tab-progress-bar" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="tab-progress-text">{progress}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <main className="tab-content">
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          {activeTab === "personal" && (
            <div className="form-section">
              <h2>Personal Information (Core KYC)</h2>
              <p className="section-description">
                Complete these fields to satisfy FICA and basic record-keeping
                requirements.
              </p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Names</label>
                  <input
                    type="text"
                    value={profileData.personalInfo?.fullName || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "fullName",
                        e.target.value
                      )
                    }
                    placeholder="Enter your full names"
                  />
                </div>
                <div className="form-group">
                  <label>ID/Passport Number</label>
                  <input
                    type="text"
                    value={profileData.personalInfo?.idPassportNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "idPassportNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter ID or Passport number"
                  />
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <input
                    type="text"
                    value={profileData.personalInfo?.nationality || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "nationality",
                        e.target.value
                      )
                    }
                    placeholder="Enter nationality"
                  />
                </div>
                <div className="form-group">
                  <label>Marital Status</label>
                  <select
                    value={profileData.personalInfo?.maritalStatus || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "maritalStatus",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Occupation</label>
                  <input
                    type="text"
                    value={profileData.personalInfo?.occupation || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "occupation",
                        e.target.value
                      )
                    }
                    placeholder="Enter occupation"
                  />
                </div>
                <div className="form-group">
                  <label>Income Tax Number</label>
                  <input
                    type="text"
                    value={profileData.personalInfo?.incomeTaxNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "incomeTaxNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter income tax number"
                  />
                </div>
              </div>

              {/* Address Autocomplete Component */}
              <AddressAutocomplete
                address={profileData.personalInfo?.address || {}}
                onChange={(subfield, field, value) =>
                  handleAddressChange("personalInfo", subfield, field, value)
                }
              />

              <button
                className="save-button"
                onClick={() => handleSave("personalInfo")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "business" && (
            <div className="form-section">
              <h2>Business Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Registered Name</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.registeredName || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "registeredName",
                        e.target.value
                      )
                    }
                    placeholder="Enter registered company name"
                  />
                </div>
                <div className="form-group">
                  <label>Trading Name</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.tradingName || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "tradingName",
                        e.target.value
                      )
                    }
                    placeholder="Enter trading name"
                  />
                </div>
                <div className="form-group">
                  <label>Company Registration Number</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.companyRegistrationNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "companyRegistrationNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter company registration number"
                  />
                </div>
                <div className="form-group">
                  <label>VAT Number</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.vatNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "vatNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter VAT number"
                  />
                </div>
                <div className="form-group">
                  <label>PAYE Number</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.payeNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "payeNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter PAYE number"
                  />
                </div>
                <div className="form-group">
                  <label>UIF Number</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.uifNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "uifNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter UIF number"
                  />
                </div>
                <div className="form-group">
                  <label>SDL Number</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.sdlNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "sdlNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter SDL number"
                  />
                </div>
                <div className="form-group">
                  <label>Annual Turnover</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.annualTurnover || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "annualTurnover",
                        e.target.value
                      )
                    }
                    placeholder="Enter annual turnover"
                  />
                </div>
                <div className="form-group">
                  <label>PI Score</label>
                  <input
                    type="text"
                    value={profileData.businessInfo?.piScore || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "piScore",
                        e.target.value
                      )
                    }
                    placeholder="Enter Public Interest Score"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Employees</label>
                  <input
                    type="number"
                    value={profileData.businessInfo?.numberOfEmployees || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "numberOfEmployees",
                        e.target.value
                      )
                    }
                    placeholder="Enter number of employees"
                  />
                </div>
              </div>

              {/* Business Address Autocomplete Component */}
              <AddressAutocomplete
                address={profileData.businessInfo?.address || {}}
                onChange={(subfield, field, value) =>
                  handleAddressChange("businessInfo", subfield, field, value)
                }
              />

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nature of Business</label>
                  <textarea
                    value={profileData.businessInfo?.natureOfBusiness || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "natureOfBusiness",
                        e.target.value
                      )
                    }
                    placeholder="Describe the nature of your business"
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Director Changes</label>
                  <textarea
                    value={profileData.businessInfo?.directorChanges || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessInfo",
                        "directorChanges",
                        e.target.value
                      )
                    }
                    placeholder="Details of any director changes"
                    rows={3}
                  />
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("businessInfo")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "taxServices" && (
            <div className="form-section">
              <h2>Tax Services Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>SARS eFiling Username</label>
                  <input
                    type="text"
                    value={profileData.services?.taxServices?.sarsEfilingUsername || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxServices",
                        "sarsEfilingUsername",
                        e.target.value
                      )
                    }
                    placeholder="Enter SARS eFiling username"
                  />
                </div>
                <div className="form-group full-width">
                  <label>List of Income Sources (Local and Foreign)</label>
                  <textarea
                    value={profileData.services?.taxServices?.incomeSources || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxServices",
                        "incomeSources",
                        e.target.value
                      )
                    }
                    placeholder="List all income sources"
                    rows={4}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Directors/Shareholders (for Business)</label>
                  <textarea
                    value={profileData.services?.taxServices?.directorsShareholders || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxServices",
                        "directorsShareholders",
                        e.target.value
                      )
                    }
                    placeholder="List all directors and shareholders"
                    rows={4}
                  />
                </div>
              </div>
              <h3>Document Uploads for Tax Services</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>IRP5/IT3(a) Certificates</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "irp5IT3a")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "irp5IT3a" && <span>Uploading...</span>}
                  {documents.irp5IT3a && typeof documents.irp5IT3a === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.irp5IT3a.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("irp5IT3a")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>IT3(b) Investment Income</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "it3b")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "it3b" && <span>Uploading...</span>}
                  {documents.it3b && typeof documents.it3b === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.it3b.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("it3b")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Medical Aid Tax Certificates</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "medicalAidCertificates")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "medicalAidCertificates" && <span>Uploading...</span>}
                  {documents.medicalAidCertificates && typeof documents.medicalAidCertificates === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.medicalAidCertificates.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("medicalAidCertificates")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Retirement Annuity Certificates</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "retirementAnnuityCertificates")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "retirementAnnuityCertificates" && <span>Uploading...</span>}
                  {documents.retirementAnnuityCertificates && typeof documents.retirementAnnuityCertificates === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.retirementAnnuityCertificates.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("retirementAnnuityCertificates")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Trial Balance</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "trialBalance")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "trialBalance" && <span>Uploading...</span>}
                  {documents.trialBalance && typeof documents.trialBalance === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.trialBalance.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("trialBalance")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>General Ledger</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "generalLedger")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "generalLedger" && <span>Uploading...</span>}
                  {documents.generalLedger && typeof documents.generalLedger === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.generalLedger.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("generalLedger")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Prior Year Signed Financials</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "priorYearFinancials")}
                    accept=".pdf,.doc,.docx"
                  />
                  {uploadingDoc === "priorYearFinancials" && <span>Uploading...</span>}
                  {documents.priorYearFinancials && typeof documents.priorYearFinancials === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.priorYearFinancials.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("priorYearFinancials")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Fixed Asset Register</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "fixedAssetRegister")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "fixedAssetRegister" && <span>Uploading...</span>}
                  {documents.fixedAssetRegister && typeof documents.fixedAssetRegister === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.fixedAssetRegister.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("fixedAssetRegister")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("services")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "cipcCompliance" && (
            <div className="form-section">
              <h2>CIPC Compliance & Secretarial</h2>
              <div className="form-grid">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={profileData.services?.cipcCompliance?.beneficialOwnershipDeclaration || false}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          "services",
                          "cipcCompliance",
                          "beneficialOwnershipDeclaration",
                          e.target.checked
                        )
                      }
                    />
                    Signed Beneficial Ownership Declaration
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={profileData.services?.cipcCompliance?.powerOfAttorney || false}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          "services",
                          "cipcCompliance",
                          "powerOfAttorney",
                          e.target.checked
                        )
                      }
                    />
                    Signed Power of Attorney (Mandate) for CIPC filings
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={profileData.services?.cipcCompliance?.latestAFS || false}
                      onChange={(e) =>
                        handleDeepNestedInputChange(
                          "services",
                          "cipcCompliance",
                          "latestAFS",
                          e.target.checked
                        )
                      }
                    />
                    Latest Annual Financial Statements (AFS) or FAS
                  </label>
                </div>
              </div>
              <h3>Document Uploads</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>Beneficial Ownership Declaration</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "beneficialOwnershipDeclarationDoc")}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  {uploadingDoc === "beneficialOwnershipDeclarationDoc" && <span>Uploading...</span>}
                  {documents.beneficialOwnershipDeclarationDoc && typeof documents.beneficialOwnershipDeclarationDoc === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.beneficialOwnershipDeclarationDoc.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("beneficialOwnershipDeclarationDoc")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Power of Attorney Document</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "powerOfAttorneyDoc")}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  {uploadingDoc === "powerOfAttorneyDoc" && <span>Uploading...</span>}
                  {documents.powerOfAttorneyDoc && typeof documents.powerOfAttorneyDoc === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.powerOfAttorneyDoc.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("powerOfAttorneyDoc")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Annual Financial Statements</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "annualFinancialStatements")}
                    accept=".pdf,.xls,.xlsx"
                  />
                  {uploadingDoc === "annualFinancialStatements" && <span>Uploading...</span>}
                  {documents.annualFinancialStatements && typeof documents.annualFinancialStatements === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.annualFinancialStatements.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("annualFinancialStatements")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("services")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "payroll" && (
            <div className="form-section">
              <h2>Payroll Services</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Total Number of Employees</label>
                  <input
                    type="number"
                    value={profileData.services?.payrollServices?.totalEmployees || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "payrollServices",
                        "totalEmployees",
                        e.target.value
                      )
                    }
                    placeholder="Enter total employees"
                  />
                </div>
                <div className="form-group">
                  <label>Pay Frequency</label>
                  <select
                    value={profileData.services?.payrollServices?.payFrequency || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "payrollServices",
                        "payFrequency",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select frequency</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Fortnightly">Fortnightly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Standard Working Hours</label>
                  <input
                    type="text"
                    value={profileData.services?.payrollServices?.standardWorkingHours || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "payrollServices",
                        "standardWorkingHours",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 40 hours/week"
                  />
                </div>
                <div className="form-group">
                  <label>Existing Payroll Software</label>
                  <input
                    type="text"
                    value={profileData.services?.payrollServices?.existingPayrollSoftware || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "payrollServices",
                        "existingPayrollSoftware",
                        e.target.value
                      )
                    }
                    placeholder="Enter current payroll software"
                  />
                </div>
              </div>
              <h3>Document Uploads</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>Current Employee List</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "employeeList")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "employeeList" && <span>Uploading...</span>}
                  {documents.employeeList && typeof documents.employeeList === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.employeeList.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("employeeList")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>UIF/PAYE Reference Documents</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "uifPayeReference")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "uifPayeReference" && <span>Uploading...</span>}
                  {documents.uifPayeReference && typeof documents.uifPayeReference === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.uifPayeReference.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("uifPayeReference")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Last 3 Months Payroll Reports</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "payrollReports")}
                    accept=".pdf,.xls,.xlsx"
                    multiple
                  />
                  {uploadingDoc === "payrollReports" && <span>Uploading...</span>}
                  {documents.payrollReports && typeof documents.payrollReports === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.payrollReports.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("payrollReports")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("services")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "accounting" && (
            <div className="form-section">
              <h2>Accounting Advisory & IT</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Preferred Accounting Software</label>
                  <select
                    value={profileData.services?.accountingAdvisory?.preferredSoftware?.[0] || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "accountingAdvisory",
                        "preferredSoftware",
                        e.target.value ? [e.target.value] : []
                      )
                    }
                  >
                    <option value="">Select software</option>
                    <option value="Xero">Xero</option>
                    <option value="QuickBooks">QuickBooks</option>
                    <option value="Sage">Sage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Bank Accounts</label>
                  <input
                    type="number"
                    value={profileData.services?.accountingAdvisory?.numberOfBankAccounts || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "accountingAdvisory",
                        "numberOfBankAccounts",
                        e.target.value
                      )
                    }
                    placeholder="Enter number of bank accounts"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Credit Cards</label>
                  <input
                    type="number"
                    value={profileData.services?.accountingAdvisory?.numberOfCreditCards || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "accountingAdvisory",
                        "numberOfCreditCards",
                        e.target.value
                      )
                    }
                    placeholder="Enter number of credit cards"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Current Pain Points</label>
                  <textarea
                    value={profileData.services?.accountingAdvisory?.currentPainPoints || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "accountingAdvisory",
                        "currentPainPoints",
                        e.target.value
                      )
                    }
                    placeholder="Describe your current accounting challenges"
                    rows={4}
                  />
                </div>
              </div>
              <h3>Document Uploads</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>Bank Statements (Last 6 Months)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "bankStatements")}
                    accept=".pdf,.xls,.xlsx,.csv"
                    multiple
                  />
                  {uploadingDoc === "bankStatements" && <span>Uploading...</span>}
                  {documents.bankStatements && typeof documents.bankStatements === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.bankStatements.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("bankStatements")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Software Subscriptions List</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "softwareSubscriptions")}
                    accept=".pdf,.doc,.docx"
                  />
                  {uploadingDoc === "softwareSubscriptions" && <span>Uploading...</span>}
                  {documents.softwareSubscriptions && typeof documents.softwareSubscriptions === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.softwareSubscriptions.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("softwareSubscriptions")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("services")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "taxTransformation" && (
            <div className="form-section">
              <h2>Tax Transformation & ESG</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Tax Workflow</label>
                  <select
                    value={profileData.services?.taxTransformation?.currentTaxWorkflow || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxTransformation",
                        "currentTaxWorkflow",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select workflow type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automated">Automated</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Global Footprint</label>
                  <input
                    type="text"
                    value={profileData.services?.taxTransformation?.globalFootprint || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxTransformation",
                        "globalFootprint",
                        e.target.value
                      )
                    }
                    placeholder="Describe global operations if applicable"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Carbon Footprint Metrics</label>
                  <textarea
                    value={profileData.services?.taxTransformation?.carbonFootprintMetrics || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxTransformation",
                        "carbonFootprintMetrics",
                        e.target.value
                      )
                    }
                    placeholder="Energy/fuel usage metrics"
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Board Diversity Details</label>
                  <textarea
                    value={profileData.services?.taxTransformation?.boardDiversity || ""}
                    onChange={(e) =>
                      handleDeepNestedInputChange(
                        "services",
                        "taxTransformation",
                        "boardDiversity",
                        e.target.value
                      )
                    }
                    placeholder="Board diversity information"
                    rows={3}
                  />
                </div>
              </div>
              <h3>Document Uploads</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>Tax Policy/Strategy Documents</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "taxPolicyDocuments")}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                  {uploadingDoc === "taxPolicyDocuments" && <span>Uploading...</span>}
                  {documents.taxPolicyDocuments && typeof documents.taxPolicyDocuments === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.taxPolicyDocuments.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("taxPolicyDocuments")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Historical Compliance Records</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "complianceRecords")}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                  {uploadingDoc === "complianceRecords" && <span>Uploading...</span>}
                  {documents.complianceRecords && typeof documents.complianceRecords === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.complianceRecords.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("complianceRecords")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Sustainability Reports</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "sustainabilityReports")}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                  {uploadingDoc === "sustainabilityReports" && <span>Uploading...</span>}
                  {documents.sustainabilityReports && typeof documents.sustainabilityReports === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.sustainabilityReports.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("sustainabilityReports")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("services")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "banking" && (
            <div className="form-section">
              <h2>Banking & Verification Details</h2>
              <p className="section-description">
                Required for ensuring SARS refunds and fee payments are handled
                correctly.
              </p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={profileData.bankingDetails?.bankName || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankingDetails",
                        "bankName",
                        e.target.value
                      )
                    }
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    value={profileData.bankingDetails?.accountHolder || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankingDetails",
                        "accountHolder",
                        e.target.value
                      )
                    }
                    placeholder="Enter account holder name"
                  />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={profileData.bankingDetails?.accountNumber || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankingDetails",
                        "accountNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter account number"
                  />
                </div>
                <div className="form-group">
                  <label>Branch Code</label>
                  <input
                    type="text"
                    value={profileData.bankingDetails?.branchCode || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "bankingDetails",
                        "branchCode",
                        e.target.value
                      )
                    }
                    placeholder="Enter branch code"
                  />
                </div>
              </div>
              <h3>Document Uploads</h3>
              <div className="upload-section">
                <div className="upload-item">
                  <label>Recent Bank Statement (for SARS verification)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "bankStatementVerification")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "bankStatementVerification" && <span>Uploading...</span>}
                  {documents.bankStatementVerification && typeof documents.bankStatementVerification === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.bankStatementVerification.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("bankStatementVerification")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("bankingDetails")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="form-section">
              <h2>Document Uploads - Personal & Business</h2>
              <div className="upload-section">
                <h3>Personal Documents</h3>
                <div className="upload-item">
                  <label>Certified ID/Passport</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "certifiedIDPassport")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "certifiedIDPassport" && <span>Uploading...</span>}
                  {documents.certifiedIDPassport && typeof documents.certifiedIDPassport === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.certifiedIDPassport.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("certifiedIDPassport")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Proof of Residence (less than 3 months old)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "proofOfResidence")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "proofOfResidence" && <span>Uploading...</span>}
                  {documents.proofOfResidence && typeof documents.proofOfResidence === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.proofOfResidence.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("proofOfResidence")}>✕ Remove</button>
                    </div>
                  )}
                </div>

                <h3>Business Documents</h3>
                <div className="upload-item">
                  <label>CIPC Registration (CoR14.3/CK1)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "cipcRegistration")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "cipcRegistration" && <span>Uploading...</span>}
                  {documents.cipcRegistration && typeof documents.cipcRegistration === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.cipcRegistration.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("cipcRegistration")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>VAT/PAYE Registration Letters</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "vatPayeRegistration")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "vatPayeRegistration" && <span>Uploading...</span>}
                  {documents.vatPayeRegistration && typeof documents.vatPayeRegistration === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.vatPayeRegistration.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("vatPayeRegistration")}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <div className="upload-item">
                  <label>Proof of Business Address</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "proofOfBusinessAddress")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "proofOfBusinessAddress" && <span>Uploading...</span>}
                  {documents.proofOfBusinessAddress && typeof documents.proofOfBusinessAddress === 'string' && (
                    <div className="uploaded-file-info">
                      <span className="uploaded-file-name">✓ {documents.proofOfBusinessAddress.split('/').pop()}</span>
                      <button className="remove-doc-button" onClick={() => handleDeleteDocument("proofOfBusinessAddress")}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleSave("documents")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileDashboard;