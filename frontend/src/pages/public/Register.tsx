import { useState } from 'react';
import { Button, Label, TextInput, Select, Alert } from 'flowbite-react';
import { User, Building2, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { apiUrl } from '../../utils/api';

type AccountType = 'personal' | 'business';

interface BusinessEntry {
  name: string;
  registrationNumber: string;
  type: string;
}

const BUSINESS_TYPES = [
  'Private Company (Pty Ltd)',
  'Public Company (Ltd)',
  'Close Corporation (CC)',
  'Sole Proprietor',
  'Partnership',
  'Trust',
  'Non-Profit Organisation',
  'Other',
];

export default function Register() {
  // Step 1: account type | Step 2: personal info | Step 3: businesses (if business) | Step 4: done
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [accountType, setAccountType] = useState<AccountType>('personal');

  // Personal fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Businesses
  const [businesses, setBusinesses] = useState<BusinessEntry[]>([
    { name: '', registrationNumber: '', type: 'Private Company (Pty Ltd)' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addBusiness = () =>
    setBusinesses([...businesses, { name: '', registrationNumber: '', type: 'Private Company (Pty Ltd)' }]);

  const removeBusiness = (i: number) =>
    setBusinesses(businesses.filter((_, idx) => idx !== i));

  const updateBusiness = (i: number, field: keyof BusinessEntry, value: string) => {
    const updated = [...businesses];
    updated[i][field] = value;
    setBusinesses(updated);
  };

  const handlePersonalNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (accountType === 'business') {
      setStep(3);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(apiUrl('/api/register/'), {
        account_type: accountType,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        businesses: accountType === 'business' ? businesses : [],
      });
      setStep(4);
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : data?.detail ||
            data?.email?.[0] ||
            data?.password?.[0] ||
            JSON.stringify(data) ||
            'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-icbp-gray-50 px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-dark.jpg"
            alt="ICBP Logo"
            className="h-14 mx-auto mb-4 rounded-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join ICBP and manage all your tax & compliance needs</p>
        </div>

        {/* Step indicators */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, ...(accountType === 'business' ? [3] : [])].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {s < (accountType === 'business' ? 3 : 2) && (
                  <div className={`w-8 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <Alert color="failure" className="mb-6">{error}</Alert>}

          {/* ─── STEP 1: Account Type ─── */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-6">What type of account do you need?</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Personal */}
                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all
                    ${accountType === 'personal'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                >
                  <User size={32} />
                  <div className="text-center">
                    <p className="font-bold">Personal</p>
                    <p className="text-xs mt-1 opacity-75">Individual tax, estate, retirement services</p>
                  </div>
                </button>

                {/* Business */}
                <button
                  type="button"
                  onClick={() => setAccountType('business')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all
                    ${accountType === 'business'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                >
                  <Building2 size={32} />
                  <div className="text-center">
                    <p className="font-bold">Business</p>
                    <p className="text-xs mt-1 opacity-75">Companies, trusts, multiple entities under one profile</p>
                  </div>
                </button>
              </div>

              <Button color="blue" className="w-full" onClick={() => setStep(2)}>
                Continue →
              </Button>

              {/* Social sign-up */}
              <div className="mt-4">
                <SocialLoginButtons mode="signup" />
              </div>
            </div>
          )}

          {/* ─── STEP 2: Personal Details ─── */}
          {step === 2 && (
            <form onSubmit={handlePersonalNext} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block"><Label htmlFor="firstName">First Name</Label></div>
                  <TextInput id="firstName" name="firstName" placeholder="John" value={firstName}
                    onChange={e => setFirstName(e.target.value)} required autoFocus />
                </div>
                <div>
                  <div className="mb-2 block"><Label htmlFor="lastName">Last Name</Label></div>
                  <TextInput id="lastName" name="lastName" placeholder="Doe" value={lastName}
                    onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>

              <div>
                <div className="mb-2 block"><Label htmlFor="regEmail">Email Address</Label></div>
                <TextInput id="regEmail" name="email" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div>
                <div className="mb-2 block"><Label htmlFor="regPassword">Password</Label></div>
                <TextInput id="regPassword" name="password" type="password" placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <div>
                <div className="mb-2 block"><Label htmlFor="confirmPassword">Confirm Password</Label></div>
                <TextInput id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>

              <div className="flex gap-3 pt-2">
                <Button color="light" onClick={() => setStep(1)} className="flex-1">← Back</Button>
                <Button type="submit" color="blue" disabled={loading} className="flex-1">
                  {accountType === 'business' ? 'Next: Add Businesses →' : (
                    loading
                      ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating…</span>
                      : 'Create Account'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* ─── STEP 3: Businesses ─── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Add your businesses</h2>
              <p className="text-sm text-gray-500 mb-6">You can add one or more businesses under your account. More can be added after sign-up.</p>

              <div className="space-y-6">
                {businesses.map((biz, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-5 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-gray-700 flex items-center gap-2">
                        <Building2 size={16} /> Business {i + 1}
                      </span>
                      {businesses.length > 1 && (
                        <button type="button" onClick={() => removeBusiness(i)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 block"><Label htmlFor={`bizName-${i}`}>Business / Entity Name *</Label></div>
                        <TextInput id={`bizName-${i}`} name={`bizName-${i}`} placeholder="Acme (Pty) Ltd"
                          value={biz.name} onChange={e => updateBusiness(i, 'name', e.target.value)} required />
                      </div>
                      <div>
                        <div className="mb-1 block">
                          <Label htmlFor={`bizReg-${i}`}>Registration / Tax Number <span className="text-gray-400">(optional)</span></Label>
                        </div>
                        <TextInput id={`bizReg-${i}`} name={`bizReg-${i}`} placeholder="e.g. 2023/123456/07"
                          value={biz.registrationNumber} onChange={e => updateBusiness(i, 'registrationNumber', e.target.value)} />
                      </div>
                      <div>
                        <div className="mb-1 block"><Label htmlFor={`bizType-${i}`}>Entity Type</Label></div>
                        <Select id={`bizType-${i}`} name={`bizType-${i}`} value={biz.type}
                          onChange={e => updateBusiness(i, 'type', e.target.value)}>
                          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addBusiness}
                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Plus size={16} /> Add another business
              </button>

              <div className="flex gap-3 mt-6">
                <Button color="light" onClick={() => setStep(2)} className="flex-1">← Back</Button>
                <Button color="blue" disabled={loading} className="flex-1"
                  onClick={() => {
                    if (businesses.some(b => !b.name.trim())) {
                      setError('Please enter a name for each business.');
                      return;
                    }
                    setError('');
                    handleSubmit();
                  }}>
                  {loading
                    ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating…</span>
                    : 'Create Account'}
                </Button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Success ─── */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account created!</h2>
              <p className="text-gray-500 mb-6">
                Welcome, {firstName}! Your account has been set up.
                {accountType === 'business' && ` ${businesses.length} business${businesses.length > 1 ? 'es have' : ' has'} been registered under your profile.`}
              </p>
              <Button color="blue" className="w-full" onClick={() => { window.location.href = '/login'; }}>
                Sign In Now
              </Button>
            </div>
          )}
        </div>

        {step !== 4 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">Sign in</a>
          </p>
        )}
        <p className="text-center text-xs text-gray-400 mt-3">
          © 2026 International Company Business Partners
        </p>
      </div>
    </div>
  );
}
