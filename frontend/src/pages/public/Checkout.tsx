import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, process payment here
    navigate('/onboarding/forms');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-icbp-dark text-white py-6 px-8">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-gray-300 text-sm mt-1">Complete your purchase to begin onboarding.</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">Selected Service</p>
              <p className="text-lg font-bold text-icbp-blue-800">{productId ? productId.replace('-', ' ').toUpperCase() : 'Selected Plan'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Total</p>
              <p className="text-xl font-bold text-gray-800">$0.00</p>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="**** **** **** ****" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="***" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition mt-6 shadow-md">
              Complete Payment & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
