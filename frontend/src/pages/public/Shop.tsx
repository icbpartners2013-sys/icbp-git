import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const navigate = useNavigate();

  const handleSelectProduct = (productId: string) => {
    // In a real app, you would add to cart or state
    navigate(`/checkout?product=${productId}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Select a Service</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Services */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-500 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Personal Accounting</h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">Income Tax Prep, Wealth & Estate Planning, Trust Administration.</p>
          <button onClick={() => handleSelectProduct('personal-tax')} className="w-full bg-icbp-blue-600 text-white py-2 rounded-lg font-medium hover:bg-icbp-blue-700 transition">Select Plan</button>
        </div>

        {/* Business Services */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-green-500 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Business Accounting</h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">Bookkeeping, Statutory Audit, Corporate Tax, Payroll.</p>
          <button onClick={() => handleSelectProduct('business-accounting')} className="w-full bg-icbp-blue-600 text-white py-2 rounded-lg font-medium hover:bg-icbp-blue-700 transition">Select Plan</button>
        </div>

        {/* CIPC Services */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-purple-500 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">CIPC Services</h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">Company Registration, Director Updates, Corporate Governance.</p>
          <button onClick={() => handleSelectProduct('cipc-reg')} className="w-full bg-icbp-blue-600 text-white py-2 rounded-lg font-medium hover:bg-icbp-blue-700 transition">Select Plan</button>
        </div>
      </div>
    </div>
  );
}
