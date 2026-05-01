import { Button } from 'flowbite-react';

function Hero() {
  return (
    <div className="bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-60" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Modern Accounting &<br />
          <span className="text-blue-400">Business Partner</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          We provide comprehensive tax, audit, and advisory services to individuals and businesses across South Africa.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button color="blue" size="lg" href="/shop">View Our Services</Button>
          <Button color="light" size="lg">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, iconBg, iconText, title, description }: {
  icon: string; iconBg: string; iconText: string; title: string; description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className={`w-12 h-12 ${iconBg} ${iconText} rounded-xl flex items-center justify-center mb-5 text-2xl`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

const features = [
  {
    icon: '📊', iconBg: 'bg-blue-100', iconText: 'text-blue-600',
    title: 'Tax & Compliance',
    description: 'Expert handling of corporate tax, VAT, PAYE, and personal income tax returns ensuring full compliance.',
  },
  {
    icon: '🏢', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600',
    title: 'CIPC Services',
    description: 'Seamless company registrations, director changes, and annual returns managed through our portal.',
  },
  {
    icon: '💼', iconBg: 'bg-purple-100', iconText: 'text-purple-600',
    title: 'Audit & Review',
    description: 'Independent statutory audits and reviews to give your stakeholders complete confidence in your financials.',
  },
  {
    icon: '📁', iconBg: 'bg-amber-100', iconText: 'text-amber-600',
    title: 'Bookkeeping',
    description: 'Accurate bookkeeping and financial reporting to keep your business on track and investor-ready.',
  },
  {
    icon: '👥', iconBg: 'bg-pink-100', iconText: 'text-pink-600',
    title: 'Payroll',
    description: 'End-to-end payroll processing, PAYE submissions, and employee tax certificates managed for you.',
  },
  {
    icon: '🛡️', iconBg: 'bg-sky-100', iconText: 'text-sky-600',
    title: 'B-BBEE Advisory',
    description: 'Strategic B-BBEE compliance support and verification services to enhance your company\'s rating.',
  },
];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Features */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything you need to grow</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              One platform for all your accounting, tax, and compliance needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => <FeatureItem key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Join hundreds of businesses that trust ICBP with their financial compliance and growth.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button href="/register" color="light" size="lg">Create an Account</Button>
          <Button href="/shop" color="blue" size="lg" className="bg-white/10 hover:bg-white/20 border border-white/30">
            Browse Services
          </Button>
        </div>
      </section>
    </div>
  );
}
