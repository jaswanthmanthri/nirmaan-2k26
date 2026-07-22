import { useState, useRef, FormEvent } from 'react';
import { Users, Check, CreditCard, Download, X, Loader2, CheckCircle2, Utensils, Gift, GraduationCap, Award, Flame, Film } from 'lucide-react';

// === CONFIG ===
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY';
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
// === END CONFIG ===

const TEAM_OPTIONS = [
  { size: 2, price: 699, label: '2 Members' },
  { size: 3, price: 999, label: '3 Members' },
  { size: 4, price: 1249, label: '4 Members' },
];

const INCLUSIONS = [
  { icon: Utensils, label: 'Free Meals', desc: 'Lunch, Dinner, Breakfast, Lunch' },
  { icon: Gift, label: 'Swag Kits', desc: 'Exclusive NIRMAAN merchandise' },
  { icon: GraduationCap, label: 'Mentorship', desc: 'Expert guidance throughout' },
  { icon: Award, label: 'Certificates', desc: 'Participation & merit certs' },
  { icon: Flame, label: 'Campfire Night', desc: 'Unwind after hours of coding' },
  { icon: Film, label: 'Movie Night', desc: 'Relax with a screening' },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

interface ReceiptData {
  teamName: string;
  leadName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  teamSize: number;
  domain: string;
  amount: number;
  transactionId: string;
  members: { name: string; email: string }[];
  date: string;
}

export default function Registration() {
  const [teamSize, setTeamSize] = useState(2);
  const [price, setPrice] = useState(699);
  const [members, setMembers] = useState<{ name: string; email: string }[]>([
    { name: '', email: '' },
    { name: '', email: '' },
  ]);
  const [form, setForm] = useState({
    teamName: '',
    leadName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    domain: 'AI/ML',
  });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const selectTeam = (size: number, p: number) => {
    setTeamSize(size);
    setPrice(p);
    setMembers((prev) => {
      const next = [...prev];
      while (next.length < size) next.push({ name: '', email: '' });
      return next.slice(0, size);
    });
  };

  const updateMember = (i: number, field: 'name' | 'email', value: string) => {
    setMembers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const validate = (): boolean => {
    if (!form.teamName.trim()) return setError('Team name is required'), false;
    if (!form.leadName.trim()) return setError('Team lead name is required'), false;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Valid lead email required'), false;
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) return setError('Valid 10-digit phone required'), false;
    if (!form.college.trim()) return setError('College name is required'), false;
    if (!form.department.trim()) return setError('Department is required'), false;
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) return setError(`Member ${i + 1} name is required`), false;
      if (!/^\S+@\S+\.\S+$/.test(members[i].email)) return setError(`Member ${i + 1} email is invalid`), false;
    }
    setError('');
    return true;
  };

  const startPayment = async (transactionId: string) => {
    await loadRazorpay();
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: 'INR',
      name: 'NIRMAAN 2K26',
      description: `Team of ${teamSize} Registration`,
      prefill: { name: form.leadName, email: form.email, contact: form.phone },
      theme: { color: '#2563EB' },
      handler: (response: any) => {
        const data: ReceiptData = {
          ...form,
          teamSize,
          domain: form.domain,
          amount: price,
          transactionId: response.razorpay_payment_id || transactionId,
          members,
          date: new Date().toLocaleString('en-IN'),
        };
        setReceipt(data);
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setError('Payment was cancelled. Please try again.');
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setSubmitting(false);
      setError('Payment failed. Please retry.');
    });
    rzp.open();
  };

  const submitToGoogleSheet = async (transactionId: string) => {
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          teamSize,
          amount: price,
          transactionId,
          members: JSON.stringify(members),
          date: new Date().toISOString(),
        }),
      });
    } catch {
      // no-cors mode swallows errors; entry is best-effort
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const tempTxnId = `NRMN${Date.now()}`;
    await submitToGoogleSheet(tempTxnId);
    await startPayment(tempTxnId);
  };

  const downloadReceipt = () => {
    if (!receipt) return;
    const lines = [
      'NIRMAAN 2K26 — Registration Receipt',
      '=====================================',
      `Team Name: ${receipt.teamName}`,
      `Team Lead: ${receipt.leadName}`,
      `Email: ${receipt.email}`,
      `Phone: ${receipt.phone}`,
      `College: ${receipt.college}`,
      `Department: ${receipt.department}`,
      `Domain: ${receipt.domain}`,
      `Team Size: ${receipt.teamSize}`,
      `Amount Paid: ₹${receipt.amount}`,
      `Transaction ID: ${receipt.transactionId}`,
      `Date: ${receipt.date}`,
      '',
      'Team Members:',
      ...receipt.members.map((m, i) => `  ${i + 1}. ${m.name} — ${m.email}`),
      '',
      'Inclusions: Meals, Swag Kit, Mentorship, Certificate, Campfire & Movie Night',
      '',
      'Thank you for registering for NIRMAAN 2K26!',
      'ANITS — Department of CSE (Data Science)',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NIRMAAN_Receipt_${receipt.teamName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="register" className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
            Register Your Team
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Dynamic Pricing Calculator
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose your team size, fill in the details, and pay securely via Razorpay.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Pricing + Inclusions */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Select Team Size
              </h3>
              <div className="space-y-3">
                {TEAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => selectTeam(opt.size, opt.price)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      teamSize === opt.size
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          teamSize === opt.size ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                        }`}
                      >
                        {teamSize === opt.size && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{opt.label}</div>
                        <div className="text-xs text-slate-500">₹{opt.price} total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-blue-600">₹{opt.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-amber-50 border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-600">Total Payable</span>
                <span className="text-3xl font-black text-slate-900">₹{price}</span>
              </div>
              <div className="text-xs text-slate-500">Inclusive of all meals, swag & mentorship</div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">What's Included</h3>
              <div className="grid grid-cols-2 gap-3">
                {INCLUSIONS.map((inc) => {
                  const Icon = inc.icon;
                  return (
                    <div key={inc.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600 mb-1.5" />
                      <div className="text-xs font-bold text-slate-800">{inc.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{inc.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3" ref={formRef}>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Team Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Team Name" value={form.teamName} onChange={(v) => setForm({ ...form, teamName: v })} placeholder="The Innovators" />
                <Field label="Team Lead Name" value={form.leadName} onChange={(v) => setForm({ ...form, leadName: v })} placeholder="John Doe" />
                <Field label="Lead Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="lead@example.com" />
                <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="9876543210" />
                <Field label="College Name" value={form.college} onChange={(v) => setForm({ ...form, college: v })} placeholder="ANITS" />
                <Field label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} placeholder="CSE - Data Science" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Problem Domain</label>
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  {['AI/ML', 'Cyber Security', 'Blockchain', 'IoT', 'FinTech', 'AgriTech', 'MedTech', 'Smart Mobility', 'Open Innovation'].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">Team Members ({teamSize})</h4>
                <div className="space-y-3">
                  {members.map((m, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <input
                        type="text"
                        placeholder={`Member ${i + 1} Name`}
                        value={m.name}
                        onChange={(e) => updateMember(i, 'name', e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                      <input
                        type="email"
                        placeholder={`Member ${i + 1} Email`}
                        value={m.email}
                        onChange={(e) => updateMember(i, 'email', e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide uppercase transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay ₹{price} & Register</>
                )}
              </button>

              <p className="text-xs text-center text-slate-400">
                Secure payment via Razorpay. Your data is submitted to our records automatically.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative max-w-md w-full p-8 rounded-3xl bg-white shadow-2xl animate-[popIn_0.4s_ease]">
            <button
              onClick={() => setReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Registration Confirmed!</h3>
              <p className="text-sm text-slate-500 mt-1">Your team is all set for NIRMAAN 2K26.</p>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <Row label="Team" value={receipt.teamName} />
              <Row label="Team Lead" value={receipt.leadName} />
              <Row label="Team Size" value={`${receipt.teamSize} members`} />
              <Row label="Domain" value={receipt.domain} />
              <Row label="Amount Paid" value={`₹${receipt.amount}`} />
              <Row label="Transaction ID" value={receipt.transactionId} mono />
            </div>

            <button
              onClick={downloadReceipt}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
