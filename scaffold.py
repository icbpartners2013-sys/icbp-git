import os

# Define the routes
client_personal = [
    ('IncomeTax', 'income-tax'), ('ProvisionalTax', 'provisional-tax'), ('WealthEstate', 'wealth-estate'),
    ('TrustAdmin', 'trust-admin'), ('ExpatTax', 'expat-tax'), ('Retirement', 'retirement'),
    ('DebtManagement', 'debt-management'), ('DeceasedEstate', 'deceased-estate')
]

client_business = [
    ('Bookkeeping', 'bookkeeping'), ('Audit', 'audit'), ('IndependentReview', 'independent-review'),
    ('CorporateTax', 'corporate-tax'), ('VatGst', 'vat-gst'), ('Payroll', 'payroll'),
    ('ManagementReporting', 'management-reporting'), ('CompanySecretarial', 'company-secretarial'),
    ('Bbbee', 'bbbee'), ('BusinessRescue', 'business-rescue'), ('Coida', 'coida')
]

client_cipc = [
    ('CompanyRegistration', 'registration'), ('AnnualReturns', 'annual-returns'), ('NameReservation', 'name-reservation'),
    ('ShelfCompany', 'shelf-company'), ('Reinstatement', 'reinstatement'), ('Deregistration', 'deregistration'),
    ('DirectorAmendments', 'director-amendments'), ('DirectorDetails', 'director-details'), ('OfficerChanges', 'officer-changes'),
    ('PublicOfficer', 'public-officer'), ('BeneficialOwnership', 'beneficial-ownership'), ('ComplianceChecklist', 'compliance-checklist'),
    ('MoiAmendments', 'moi-amendments'), ('Fas', 'fas'), ('AddressChanges', 'address-changes'),
    ('SecuritiesRegister', 'securities-register'), ('ShareCertificates', 'share-certificates'), ('ShareTransfers', 'share-transfers'),
    ('Trademark', 'trademark'), ('Patent', 'patent')
]

client_features = [
    ('Documents', 'documents'), ('Signatures', 'signatures'), ('Messages', 'messages'),
    ('Billing', 'billing'), ('Reminders', 'reminders'), ('MobileScanner', 'mobile-scanner'), ('Tasks', 'tasks')
]

staff_features = [
    ('TimeTracking', 'time-tracking'), ('Expenses', 'expenses'), ('Directory', 'directory'),
    ('Cpe', 'cpe'), ('KnowledgeBase', 'knowledge-base'), ('Leave', 'leave'),
    ('Workflow', 'workflow'), ('Dms', 'dms'), ('Communications', 'communications'),
    ('SoftwareIntegration', 'software-integration'), ('Analytics', 'analytics'), ('ESignatures', 'e-signatures'),
    ('ProjectOversight', 'project-oversight'), ('ResourceAllocation', 'resource-allocation'), ('Budget', 'budget'),
    ('Wip', 'wip'), ('ReviewQueue', 'review-queue'), ('Onboarding', 'onboarding'),
    ('Financials', 'financials'), ('AgedReceivables', 'aged-receivables'), ('Utilization', 'utilization'),
    ('WriteOffs', 'write-offs'), ('StrategicPlanning', 'strategic-planning'), ('Provisioning', 'provisioning'),
    ('SecurityLogs', 'security-logs'), ('PayrollProcessing', 'payroll-processing'), ('Performance', 'performance'),
    ('ApplicantTracking', 'applicant-tracking')
]

base_dir = "frontend/src/pages"

def create_component(folder, name):
    full_dir = os.path.join(base_dir, folder)
    os.makedirs(full_dir, exist_ok=True)
    filepath = os.path.join(full_dir, f"{name}.tsx")
    if not os.path.exists(filepath):
        with open(filepath, 'w') as f:
            f.write(f'''export default function {name}() {{
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{name}</h1>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <p className="text-gray-600">This module is under construction.</p>
      </div>
    </div>
  );
}}
''')

# Create components
for name, _ in client_personal: create_component('client/personal', name)
for name, _ in client_business: create_component('client/business', name)
for name, _ in client_cipc: create_component('client/cipc', name)
for name, _ in client_features: create_component('client/features', name)
for name, _ in staff_features: create_component('staff/features', name)

# Generate route imports and elements
imports = []
routes = []

def add_routes(group, folder, prefix):
    for name, path in group:
        imports.append(f"import {name} from './pages/{folder}/{name}';")
        routes.append(f"          <Route path=\"/{prefix}/{path}\" element={{<RequireAuth><{name} /></RequireAuth>}} />")

add_routes(client_personal, 'client/personal', 'client/personal')
add_routes(client_business, 'client/business', 'client/business')
add_routes(client_cipc, 'client/cipc', 'client/cipc')
add_routes(client_features, 'client/features', 'client')
add_routes(staff_features, 'staff/features', 'staff')

print("\n".join(imports))
print("\n--- ROUTES ---\n")
print("\n".join(routes))


