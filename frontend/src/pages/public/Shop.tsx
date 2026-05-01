import { Button, Card, Badge } from 'flowbite-react';

const services = [
  { id: 1, name: 'Personal Tax Return (ITR12)', price: 'R1,200', category: 'Tax', description: 'Complete income tax return preparation and submission to SARS.' },
  { id: 2, name: 'Company Registration (PTY Ltd)', price: 'R2,500', category: 'CIPC', description: 'Full CIPC company registration including MOI and share certificates.' },
  { id: 3, name: 'Monthly Bookkeeping', price: 'From R1,800/mo', category: 'Bookkeeping', description: 'Full monthly bookkeeping, bank reconciliation, and management reports.' },
  { id: 4, name: 'VAT Registration & Returns', price: 'R800', category: 'Tax', description: 'SARS VAT vendor registration and ongoing VAT201 submissions.' },
  { id: 5, name: 'Payroll Processing', price: 'From R650/mo', category: 'Payroll', description: 'Monthly payroll, payslips, EMP201 and EMP501 submissions.' },
  { id: 6, name: 'Annual Returns (CIPC)', price: 'R450', category: 'CIPC', description: 'CIPC annual return filing to keep your company compliant.' },
];

const categoryColors: Record<string, string> = {
  Tax: 'blue', CIPC: 'purple', Bookkeeping: 'green', Payroll: 'yellow',
};

export default function Shop() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Service Shop</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Choose the services your business needs. All pricing is transparent and fixed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card key={service.id} className="flex flex-col h-full hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <Badge color={categoryColors[service.category] || 'gray'}>{service.category}</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-500 text-sm flex-1 mb-4">{service.description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <span className="text-xl font-bold text-blue-600">{service.price}</span>
              <Button color="blue" size="sm" href="/checkout">Select</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
