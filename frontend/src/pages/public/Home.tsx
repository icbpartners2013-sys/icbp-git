import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-icbp-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-icbp-blue-600 to-purple-600 mix-blend-multiply" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6">
              Modern Accounting & <br />
              <span className="text-icbp-blue-400">Business Partner</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              We provide comprehensive tax, audit, and advisory services for businesses and high-net-worth individuals globally.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/shop" className="bg-icbp-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-icbp-blue-500 transition shadow-lg">
                View Our Services
              </Link>
              <Link to="/contact" className="bg-white text-icbp-dark px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-20 bg-icbp-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">Everything you need to grow</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-icbp-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Tax & Compliance</h3>
              <p className="text-gray-600">Expert handling of corporate tax, VAT, PAYE, and personal income tax returns ensuring full compliance.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">🏢</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">CIPC Services</h3>
              <p className="text-gray-600">Seamless company registrations, director changes, and annual returns managed through our portal.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-2xl">💼</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Audit & Review</h3>
              <p className="text-gray-600">Independent statutory audits and reviews to give your stakeholders complete confidence in your financials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
