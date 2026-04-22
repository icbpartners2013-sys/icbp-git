import { useNavigate } from 'react-router-dom';

export default function OnboardingForms() {
  const navigate = useNavigate();

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    // Save onboarding data, then go to client dashboard
    navigate('/client/dashboard');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-icbp-blue-600 text-white py-6 px-8">
          <h1 className="text-2xl font-bold">Client Onboarding</h1>
          <p className="text-blue-100 text-sm mt-1">Please provide some details so we can set up your portal.</p>
        </div>
        
        <form onSubmit={handleComplete} className="p-8 space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">KYC / AML Uploads</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
              <p className="text-sm text-gray-500">Upload Directors' ID Documents & Proof of Address</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-icbp-dark text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-md">
            Submit & Enter Portal
          </button>
        </form>
      </div>
    </div>
  );
}
