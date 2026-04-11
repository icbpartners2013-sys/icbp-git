const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      // Personal Information (Core KYC)
      personalInfo: {
        fullName: String,
        idPassportNumber: String,
        nationality: String,
        maritalStatus: {
          type: String,
          enum: ["Single", "Married", "Divorced", "Widowed", ""],
          default: "",
        },
        physicalAddress: String,
        occupation: String,
        incomeTaxNumber: String,
      },
      // Business Information
      businessInfo: {
        registeredName: String,
        tradingName: String,
        companyRegistrationNumber: String,
        vatNumber: String,
        payeNumber: String,
        uifNumber: String,
        sdlNumber: String,
        physicalPostalAddress: String,
        natureOfBusiness: String,
        annualTurnover: String,
        piScore: String,
        numberOfEmployees: Number,
        directorChanges: String,
      },
      // Service-Specific Information
      services: {
        taxServices: {
          sarsEfilingUsername: String,
          incomeSources: String,
          directorsShareholders: String,
        },
        cipcCompliance: {
          beneficialOwnershipDeclaration: Boolean,
          powerOfAttorney: Boolean,
          latestAFS: Boolean,
        },
        payrollServices: {
          totalEmployees: Number,
          payFrequency: {
            type: String,
            enum: ["Weekly", "Fortnightly", "Monthly", ""],
            default: "",
          },
          standardWorkingHours: String,
          existingPayrollSoftware: String,
        },
        accountingAdvisory: {
          preferredSoftware: [String],
          currentPainPoints: String,
          numberOfBankAccounts: Number,
          numberOfCreditCards: Number,
        },
        taxTransformation: {
          currentTaxWorkflow: {
            type: String,
            enum: ["Manual", "Automated", "Hybrid", ""],
            default: "",
          },
          globalFootprint: String,
          carbonFootprintMetrics: String,
          boardDiversity: String,
        },
      },
      // Banking Details
      bankingDetails: {
        bankName: String,
        accountHolder: String,
        accountNumber: String,
        branchCode: String,
      },
    },
    // Document Uploads
    documents: {
      // Personal Documents
      certifiedIDPassport: String,
      proofOfResidence: String,
      // Business Documents
      cipcRegistration: String,
      vatPayeRegistration: String,
      proofOfBusinessAddress: String,
      // Tax Service Documents
      irp5IT3a: [String],
      it3b: [String],
      medicalAidCertificates: [String],
      retirementAnnuityCertificates: [String],
      trialBalance: String,
      generalLedger: String,
      priorYearFinancials: String,
      fixedAssetRegister: String,
      // CIPC Documents
      beneficialOwnershipDeclarationDoc: String,
      powerOfAttorneyDoc: String,
      annualFinancialStatements: String,
      // Payroll Documents
      employeeList: String,
      uifPayeReference: String,
      payrollReports: [String],
      // Accounting Documents
      bankStatements: [String],
      softwareSubscriptions: String,
      // Tax Transformation Documents
      taxPolicyDocuments: [String],
      complianceRecords: [String],
      sustainabilityReports: [String],
      // Banking Documents
      bankStatementVerification: String,
    },
    // Account status
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);