import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Shop() {
  const navigate = useNavigate();

  const handleSelectProduct = (productId: string, price: string) => {
    navigate(`/checkout?product=${productId}&price=${price}`);
  };

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products dynamically from Django API
    fetch('http://localhost:8000/base/api/services/')
      .then(res => res.json())
      .then(data => setServices(data.filter((s: any) => s.is_active)))
      .catch(err => console.error("Failed to load products", err));
  }, []);

  const personalServices = services.filter((s: any) => s.category === 'Personal');
  const businessServices = services.filter((s: any) => s.category === 'Business');
  const cipcServices = services.filter((s: any) => s.category === 'CIPC');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Select a Service</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Services */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-blue-500 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-4">
            <span className="text-3xl">👤</span>
            <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
          </div>
          <div className="space-y-4 flex-1">
            {personalServices.length === 0 ? <p className="text-sm text-gray-500 italic">No products available.</p> : personalServices.map((srv: any) => (
              <div key={srv.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-bold text-gray-800">{srv.name}</h3>
                <p className="text-xs text-gray-600 mt-1 mb-3">{srv.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-lg text-green-600">${parseFloat(srv.price).toFixed(2)}</span>
                  <button onClick={() => handleSelectProduct(srv.name, srv.price)} className="bg-icbp-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-icbp-blue-700 transition">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Services */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-4">
            <span className="text-3xl">🏢</span>
            <h2 className="text-2xl font-bold text-gray-800">Business</h2>
          </div>
          <div className="space-y-4 flex-1">
            {businessServices.length === 0 ? <p className="text-sm text-gray-500 italic">No products available.</p> : businessServices.map((srv: any) => (
              <div key={srv.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-bold text-gray-800">{srv.name}</h3>
                <p className="text-xs text-gray-600 mt-1 mb-3">{srv.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-lg text-green-600">${parseFloat(srv.price).toFixed(2)}</span>
                  <button onClick={() => handleSelectProduct(srv.name, srv.price)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CIPC Services */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-purple-500 flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b pb-4">
            <span className="text-3xl">⚖️</span>
            <h2 className="text-2xl font-bold text-gray-800">CIPC / Secretarial</h2>
          </div>
          <div className="space-y-4 flex-1">
            {cipcServices.length === 0 ? <p className="text-sm text-gray-500 italic">No products available.</p> : cipcServices.map((srv: any) => (
              <div key={srv.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-bold text-gray-800">{srv.name}</h3>
                <p className="text-xs text-gray-600 mt-1 mb-3">{srv.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-lg text-green-600">${parseFloat(srv.price).toFixed(2)}</span>
                  <button onClick={() => handleSelectProduct(srv.name, srv.price)} className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
