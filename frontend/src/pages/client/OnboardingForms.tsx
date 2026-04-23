import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingForms() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientType: 'business',
    companyName: '',
    registrationNumber: '',
    industry: '',
    directors: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    contactEmail: '',
    contactPhone: '',
    servicesNeeded: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, servicesNeeded: [...prev.servicesNeeded, value] };
      } else {
        return { ...prev, servicesNeeded: prev.servicesNeeded.filter(s => s !== value) };
      }
    });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API Call to save client brief details here
    console.log("Submitting Onboarding Data:", formData);
    navigate('/client/dashboard');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-icbp-dark text-white py-8 px-10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to ICBP</h1>
            <p className="text-blue-200 mt-2 text-lg">Let's set up your client profile.</p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-icbp-blue-600 opacity-20 blur-3xl"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-50 px-10 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-icbp-blue-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>1</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-icbp-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-icbp-blue-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>2</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-icbp-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-icbp-blue-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>3</div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 px-1">
            <span>Basic Info</span>
            <span>Services</span>
            <span>Documents</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800">Tell us about yourself</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">I am registering as a:</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${formData.clientType === 'business' ? 'border-icbp-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setFormData({...formData, clientType: 'business'})}
                  >
                    <div className="font-bold text-gray-800">Business / Company</div>
                    <p className="text-xs text-gray-500 mt-1">(Pty) Ltd, CC, Trust, NPO</p>
                  </div>
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${formData.clientType === 'personal' ? 'border-icbp-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setFormData({...formData, clientType: 'personal'})}
                  >
                    <div className="font-bold text-gray-800">Individual / Sole Proprietor</div>
                    <p className="text-xs text-gray-500 mt-1">Personal Tax, Estates, Expat</p>
                  </div>
                </div>
              </div>

              {formData.clientType === 'business' ? (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registered Company Name *</label>
                      <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" placeholder="e.g. Acme Trading (Pty) Ltd" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration / CIPC Number</label>
                      <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" placeholder="e.g. 2020/123456/07" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Sector</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" placeholder="e.g. Retail, Tech, Manufacturing" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID / Passport Number</label>
                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email *</label>
                  <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone Number *</label>
                  <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Services Needed */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800">What services are you looking for?</h2>
              <p className="text-gray-500 mb-4">Select all that apply. We will customize your dashboard accordingly.</p>
              
              <div className="space-y-3">
                {[
                  { id: 'tax', label: 'Tax & Compliance (Income Tax, VAT, PAYE)', icon: '📊' },
                  { id: 'accounting', label: 'Accounting & Bookkeeping', icon: '📓' },
                  { id: 'audit', label: 'Statutory Audit / Independent Review', icon: '🔍' },
                  { id: 'cipc', label: 'CIPC / Company Secretarial', icon: '🏢' },
                  { id: 'advisory', label: 'Business Advisory & Restructuring', icon: '💡' },
                ].map(service => (
                  <label key={service.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.servicesNeeded.includes(service.id) ? 'border-icbp-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="checkbox" 
                      value={service.id} 
                      checked={formData.servicesNeeded.includes(service.id)} 
                      onChange={handleServiceChange}
                      className="h-5 w-5 text-icbp-blue-600 rounded border-gray-300 focus:ring-icbp-blue-500"
                    />
                    <span className="ml-4 text-xl">{service.icon}</span>
                    <span className="ml-3 font-medium text-gray-800">{service.label}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes / Specific Requirements</label>
                <textarea rows={3} className="w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" placeholder="E.g. Need urgent help with overdue tax returns..."></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800">Upload KYC Documents</h2>
              <p className="text-gray-500 mb-6">To finalize your account setup, please provide your FICA / KYC documents. You can also skip this and upload them later in your portal.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-icbp-blue-400 transition cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-100 text-icbp-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">ID / Passport</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">Clear copy of Director/Owner ID</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-icbp-blue-400 transition cursor-pointer group">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">Proof of Address</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">Utility bill not older than 3 months</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={handleBack} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Back</button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="bg-icbp-blue-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-icbp-blue-700 transition ml-auto">Next Step</button>
            ) : (
              <button type="submit" className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-green-700 transition ml-auto">Complete Setup & Enter Portal</button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
