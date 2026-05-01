import { useState } from 'react';
import { Button, Label, TextInput, Textarea, Card } from 'flowbite-react';
import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Received!</h2>
        <p className="text-gray-500 mb-6">
          Thank you! One of our consultants will contact you within 1 business day.
        </p>
        <Button color="blue" href="/">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Request a Service</h1>
      <p className="text-gray-500 mb-8">Fill in your details and we'll get back to you shortly.</p>

      <Card>
        <form
          className="space-y-5"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="firstName">First Name</Label></div>
              <TextInput id="firstName" placeholder="John" required />
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="lastName">Last Name</Label></div>
              <TextInput id="lastName" placeholder="Doe" required />
            </div>
          </div>
          <div>
            <div className="mb-2 block"><Label htmlFor="email">Email</Label></div>
            <TextInput id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div>
            <div className="mb-2 block"><Label htmlFor="phone">Phone Number</Label></div>
            <TextInput id="phone" type="tel" placeholder="+27 XX XXX XXXX" />
          </div>
          <div>
            <div className="mb-2 block"><Label htmlFor="service">Service Required</Label></div>
            <TextInput id="service" placeholder="e.g. Company Registration, Tax Return" required />
          </div>
          <div>
            <div className="mb-2 block"><Label htmlFor="message">Additional Notes</Label></div>
            <Textarea id="message" placeholder="Any additional information..." rows={4} />
          </div>
          <Button type="submit" color="blue" className="w-full">Submit Request</Button>
        </form>
      </Card>
    </div>
  );
}
