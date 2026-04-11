import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AddressAutocomplete from "./AddressAutocomplete";
import "./ProfileDashboard.css";

const ProfileDashboard = () => {
  const { user, logout, updateProfile, uploadDocument, fetchProfile, deleteDocument } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState({});
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);

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

  const handleNestedInputChange = (section, subsection, field, value) => {
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

  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(documentType);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);

    const result = await uploadDocument(formData, documentType);

    setUploadingDoc(null);
    if (result.success) {
      showMessage("success", "Document uploaded successfully!");
      loadProfileData();
      // Reset file input
      e.target.value = "";
    } else {
      showMessage("error", result.error);
    }
  };

  const handleDeleteDocument = async (documentType) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const result = await deleteDocument(documentType);
    if (result.success) {
      showMessage("success", "Document deleted successfully!");
      loadProfileData();
    } else {
      showMessage("error", result.error);
    }
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

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "business", label: "Business Information" },
    { id: "taxServices", label: "Tax Services" },
    { id: "cipcCompliance", label: "CIPC Compliance" },
    { id: "payroll", label: "Payroll Services" },
    { id: "accounting", label: "Accounting Advisory" },
    { id: "taxTransformation", label: "Tax Transformation" },
    { id: "banking", label: "Banking Details" },
    { id: "documents", label: "Document Uploads" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ICBP Client Portal</h1>
          <div className="header-actions">
            <span className="user-email">{user?.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
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
                onChange={(section, field, value) =>
                  handleNestedInputChange("personalInfo", "address", field, value)
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
                onChange={(section, field, value) =>
                  handleNestedInputChange("businessInfo", "address", field, value)
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                </div>
                <div className="upload-item">
                  <label>General Ledger</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "generalLedger")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "generalLedger" && <span>Uploading...</span>}
                </div>
                <div className="upload-item">
                  <label>Prior Year Signed Financials</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "priorYearFinancials")}
                    accept=".pdf,.doc,.docx"
                  />
                  {uploadingDoc === "priorYearFinancials" && <span>Uploading...</span>}
                </div>
                <div className="upload-item">
                  <label>Fixed Asset Register</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "fixedAssetRegister")}
                    accept=".pdf,.xls,.xlsx,.csv"
                  />
                  {uploadingDoc === "fixedAssetRegister" && <span>Uploading...</span>}
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
                        handleNestedInputChange(
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
                        handleNestedInputChange(
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
                        handleNestedInputChange(
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
                </div>
                <div className="upload-item">
                  <label>Power of Attorney Document</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "powerOfAttorneyDoc")}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  {uploadingDoc === "powerOfAttorneyDoc" && <span>Uploading...</span>}
                </div>
                <div className="upload-item">
                  <label>Annual Financial Statements</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "annualFinancialStatements")}
                    accept=".pdf,.xls,.xlsx"
                  />
                  {uploadingDoc === "annualFinancialStatements" && <span>Uploading...</span>}
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                </div>
                <div className="upload-item">
                  <label>UIF/PAYE Reference Documents</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "uifPayeReference")}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {uploadingDoc === "uifPayeReference" && <span>Uploading...</span>}
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                </div>
                <div className="upload-item">
                  <label>Software Subscriptions List</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "softwareSubscriptions")}
                    accept=".pdf,.doc,.docx"
                  />
                  {uploadingDoc === "softwareSubscriptions" && <span>Uploading...</span>}
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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
                      handleNestedInputChange(
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