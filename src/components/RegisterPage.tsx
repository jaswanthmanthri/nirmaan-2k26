import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, ClipboardCheck, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, ChevronRight, Upload, X, Loader2,
  Sparkles, Trophy, Zap, FileText, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

// ─── CONFIG ───────────────────────────────────────────────
// Payment Details (Replace with real values when ready)
const PAYMENT_INFO = {
  upiId: 'nirmaan2k26@upi',
  scannerName: 'NIRMAAN 2K26 - ANITS',
  bankName: 'State Bank of India',
  accountNo: 'XXXX XXXX XXXX 1234',
  ifsc: 'SBIN0001234',
};
// ─── END CONFIG ───────────────────────────────────────────

const TEAM_OPTIONS = [
  {
    key: 'duo' as const,
    size: 2,
    price: 699,
    label: 'Duo',
    tagline: '2 Members',
    perHead: '₹349.50/head',
    icon: Users,
    color: '#3B82F6',
  },
  {
    key: 'trio' as const,
    size: 3,
    price: 999,
    label: 'Trio',
    tagline: '3 Members',
    perHead: '₹333/head',
    icon: UserPlus,
    color: '#F97316',
    popular: true,
  },
  {
    key: 'squad' as const,
    size: 4,
    price: 1249,
    label: 'Squad',
    tagline: '4 Members',
    perHead: '₹312.25/head',
    icon: Trophy,
    color: '#8B5CF6',
  },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const STEP_META = [
  { label: 'Team Info', icon: Users },
  { label: 'Team Size', icon: Zap },
  { label: 'Members', icon: UserPlus },
  { label: 'Review', icon: ClipboardCheck },
  { label: 'Payment', icon: CreditCard },
];

interface MemberInfo {
  fullName: string;
  email: string;
  whatsapp: string;
  gender: string;
  college: string;
  collegeLocation: string;
  state: string;
  stream: string;
  year: string;
}

const emptyMember = (): MemberInfo => ({
  fullName: '',
  email: '',
  whatsapp: '',
  gender: '',
  college: '',
  collegeLocation: '',
  state: '',
  stream: '',
  year: '',
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

type FieldStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

type FieldAvailability = {
  status: FieldStatus;
  message: string;
};

type AvailabilityState = {
  teamName: FieldAvailability;
  leadEmail: FieldAvailability;
  leadPhone: FieldAvailability;
  transactionId: FieldAvailability;
  memberEmails: FieldAvailability[];
  memberPhones: FieldAvailability[];
};

const emptyAvailability = (memberCount: number): AvailabilityState => ({
  teamName: { status: 'idle', message: 'Enter a team name to check availability.' },
  leadEmail: { status: 'idle', message: 'Enter a valid email to check availability.' },
  leadPhone: { status: 'idle', message: 'Enter a valid phone number to check availability.' },
  transactionId: { status: 'idle', message: 'Enter a transaction ID to check availability.' },
  memberEmails: Array.from({ length: memberCount }, () => ({
    status: 'idle',
    message: 'Enter a valid email to check availability.',
  })),
  memberPhones: Array.from({ length: memberCount }, () => ({
    status: 'idle',
    message: 'Enter a valid phone number to check availability.',
  })),
});

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read payment screenshot.'));
    reader.readAsDataURL(file);
  });

export default function RegisterPage() {
  const [hasAgreedToGuidelines, setHasAgreedToGuidelines] = useState(false);
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [lead, setLead] = useState<MemberInfo>(emptyMember());
  const [selectedPlan, setSelectedPlan] = useState<'duo' | 'trio' | 'squad'>('duo');
  const [members, setMembers] = useState<MemberInfo[]>([emptyMember()]);
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityState>(() => emptyAvailability(1));
  const containerRef = useRef<HTMLDivElement>(null);

  const plan = TEAM_OPTIONS.find(o => o.key === selectedPlan)!;

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  // Sync member slots with selected plan (excluding lead, so plan.size - 1 members)
  useEffect(() => {
    const neededMembers = plan.size - 1;
    setMembers(prev => {
      const next = [...prev];
      while (next.length < neededMembers) next.push(emptyMember());
      return next.slice(0, neededMembers);
    });
  }, [selectedPlan, plan.size]);

  useEffect(() => {
    setAvailability((current) => emptyAvailability(members.length));
  }, [members.length]);

  useEffect(() => {
    const teamNameValue = teamName.trim();
    const leadEmailValue = normalizeEmail(lead.email);
    const leadPhoneValue = normalizePhone(lead.whatsapp);
    const transactionValue = transactionId.trim();
    const memberEmails = members.map((member) => normalizeEmail(member.email));
    const memberPhones = members.map((member) => normalizePhone(member.whatsapp));
    const anyInput = teamNameValue || leadEmailValue || leadPhoneValue || transactionValue || memberEmails.some(Boolean) || memberPhones.some(Boolean);

    if (!anyInput) {
      setAvailability(emptyAvailability(members.length));
      return;
    }

    const timer = window.setTimeout(async () => {
      if (!isSupabaseConfigured) return;

      const nextAvailability = emptyAvailability(members.length);
      const checks = {
        teamName: teamNameValue.length >= 3,
        leadEmail: /^\S+@\S+\.\S+$/.test(leadEmailValue),
        leadPhone: /^\d{10}$/.test(leadPhoneValue),
        transactionId: transactionValue.length >= 4,
        memberEmails: memberEmails.map((email) => /^\S+@\S+\.\S+$/.test(email)),
        memberPhones: memberPhones.map((phone) => /^\d{10}$/.test(phone)),
      };

      if (checks.teamName) nextAvailability.teamName = { status: 'checking', message: 'Checking team name...' };
      else if (teamNameValue) nextAvailability.teamName = { status: 'idle', message: 'Team name must be at least 3 characters.' };

      if (checks.leadEmail) nextAvailability.leadEmail = { status: 'checking', message: 'Checking email...' };
      else if (lead.email.trim()) nextAvailability.leadEmail = { status: 'idle', message: 'Enter a valid email to check availability.' };

      if (checks.leadPhone) nextAvailability.leadPhone = { status: 'checking', message: 'Checking phone number...' };
      else if (lead.whatsapp.trim()) nextAvailability.leadPhone = { status: 'idle', message: 'Enter a valid phone number to check availability.' };

      if (checks.transactionId) nextAvailability.transactionId = { status: 'checking', message: 'Checking transaction ID...' };
      else if (transactionValue) nextAvailability.transactionId = { status: 'idle', message: 'Transaction ID must be at least 4 characters.' };

      nextAvailability.memberEmails = memberEmails.map((email, idx) => {
        if (!email) return { status: 'idle', message: 'Enter a valid email to check availability.' };
        if (!checks.memberEmails[idx]) return { status: 'idle', message: 'Enter a valid email to check availability.' };
        return { status: 'checking', message: 'Checking email...' };
      });

      nextAvailability.memberPhones = memberPhones.map((phone, idx) => {
        if (!phone) return { status: 'idle', message: 'Enter a valid phone number to check availability.' };
        if (!checks.memberPhones[idx]) return { status: 'idle', message: 'Enter a valid phone number to check availability.' };
        return { status: 'checking', message: 'Checking phone number...' };
      });

      setAvailability(nextAvailability);

      try {
        const { data, error } = await supabase.functions.invoke<{
          teamNameTaken?: boolean;
          transactionIdTaken?: boolean;
          takenEmails?: string[];
          takenPhones?: string[];
          error?: string;
        }>('submit-registration', {
          body: {
            action: 'validate',
            teamName: checks.teamName ? teamNameValue : undefined,
            transactionId: checks.transactionId ? transactionValue : undefined,
            leadEmail: checks.leadEmail ? leadEmailValue : undefined,
            leadWhatsapp: checks.leadPhone ? leadPhoneValue : undefined,
            memberEmails: memberEmails.filter((email, idx) => checks.memberEmails[idx] && email),
            memberWhatsapps: memberPhones.filter((phone, idx) => checks.memberPhones[idx] && phone),
          },
        });

        if (error) {
          throw new Error(await getFunctionErrorMessage(error));
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (!data) return;

        const takenEmails = new Set((data.takenEmails || []).map(normalizeEmail));
        const takenPhones = new Set((data.takenPhones || []).map(normalizePhone));
        setAvailability({
          teamName: checks.teamName
            ? {
                status: data.teamNameTaken ? 'taken' : 'available',
                message: data.teamNameTaken ? 'Team name already exists.' : 'Team name is available.',
              }
            : nextAvailability.teamName,
          leadEmail: checks.leadEmail
            ? {
                status: takenEmails.has(leadEmailValue) ? 'taken' : 'available',
                message: takenEmails.has(leadEmailValue) ? 'Email already exists.' : 'Email is available.',
              }
            : nextAvailability.leadEmail,
          leadPhone: checks.leadPhone
            ? {
                status: takenPhones.has(leadPhoneValue) ? 'taken' : 'available',
                message: takenPhones.has(leadPhoneValue) ? 'Phone number already exists.' : 'Phone number is available.',
              }
            : nextAvailability.leadPhone,
          transactionId: checks.transactionId
            ? {
                status: data.transactionIdTaken ? 'taken' : 'available',
                message: data.transactionIdTaken ? 'Transaction ID already exists.' : 'Transaction ID is available.',
              }
            : nextAvailability.transactionId,
          memberEmails: memberEmails.map((email, idx) => {
            if (!checks.memberEmails[idx] || !email) {
              return nextAvailability.memberEmails[idx] || { status: 'idle', message: 'Enter a valid email to check availability.' };
            }
            return {
              status: takenEmails.has(email) ? 'taken' : 'available',
              message: takenEmails.has(email) ? 'Email already exists.' : 'Email is available.',
            };
          }),
          memberPhones: memberPhones.map((phone, idx) => {
            if (!checks.memberPhones[idx] || !phone) {
              return nextAvailability.memberPhones[idx] || { status: 'idle', message: 'Enter a valid phone number to check availability.' };
            }
            return {
              status: takenPhones.has(phone) ? 'taken' : 'available',
              message: takenPhones.has(phone) ? 'Phone number already exists.' : 'Phone number is available.',
            };
          }),
        });
      } catch {
        setAvailability((current) => ({
          teamName: checks.teamName ? { status: 'error', message: 'Could not check team name right now.' } : current.teamName,
          leadEmail: checks.leadEmail ? { status: 'error', message: 'Could not check email right now.' } : current.leadEmail,
          leadPhone: checks.leadPhone ? { status: 'error', message: 'Could not check phone number right now.' } : current.leadPhone,
          transactionId: checks.transactionId ? { status: 'error', message: 'Could not check transaction ID right now.' } : current.transactionId,
          memberEmails: memberEmails.map((email, idx) => {
            if (!checks.memberEmails[idx] || !email) return current.memberEmails[idx] || { status: 'idle', message: 'Enter a valid email to check availability.' };
            return { status: 'error', message: 'Could not check email right now.' };
          }),
          memberPhones: memberPhones.map((phone, idx) => {
            if (!checks.memberPhones[idx] || !phone) return current.memberPhones[idx] || { status: 'idle', message: 'Enter a valid phone number to check availability.' };
            return { status: 'error', message: 'Could not check phone number right now.' };
          }),
        }));
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [teamName, lead.email, lead.whatsapp, transactionId, members, selectedPlan]);

  // ─── VALIDATION ─────────────────────────────────────────
  const validateStep1 = (): string[] => {
    const errs: string[] = [];
    if (!teamName.trim()) errs.push('Team name is required');
    if (!lead.fullName.trim()) errs.push('Team lead full name is required');
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) errs.push('Valid team lead email is required');
    if (!/^\d{10}$/.test(lead.whatsapp.replace(/\D/g, ''))) errs.push('Valid 10-digit WhatsApp number is required');
    if (!lead.gender) errs.push('Please select gender');
    if (!lead.college.trim()) errs.push('College name is required');
    if (!lead.collegeLocation.trim()) errs.push('College location is required');
    if (!lead.state.trim()) errs.push('State is required');
    if (!lead.stream.trim()) errs.push('Stream is required');
    if (!lead.year) errs.push('Year is required');
    return errs;
  };

  const validateStep3 = (): string[] => {
    const errs: string[] = [];
    const emails = [normalizeEmail(lead.email)];
    const phones = [normalizePhone(lead.whatsapp)];
    members.forEach((m, i) => {
      const num = i + 2;
      if (!m.fullName.trim()) errs.push(`Member ${num}: Full name is required`);
      if (!/^\S+@\S+\.\S+$/.test(m.email)) errs.push(`Member ${num}: Valid email is required`);
      emails.push(normalizeEmail(m.email));
      phones.push(normalizePhone(m.whatsapp));
      if (!/^\d{10}$/.test(m.whatsapp.replace(/\D/g, ''))) errs.push(`Member ${num}: Valid 10-digit WhatsApp number required`);
      if (!m.gender) errs.push(`Member ${num}: Select gender`);
      if (!m.college.trim()) errs.push(`Member ${num}: College name is required`);
      if (!m.collegeLocation.trim()) errs.push(`Member ${num}: College location is required`);
      if (!m.state.trim()) errs.push(`Member ${num}: State is required`);
      if (!m.stream.trim()) errs.push(`Member ${num}: Stream is required`);
      if (!m.year) errs.push(`Member ${num}: Year is required`);
    });
    if (new Set(emails).size !== emails.length) errs.push('Each participant must use a different email address');
    if (new Set(phones).size !== phones.length) errs.push('Each participant must use a different WhatsApp number');
    return errs;
  };

  const validateStep5 = (): string[] => {
    const errs: string[] = [];
    if (!transactionId.trim()) errs.push('Transaction ID is required');
    if (!screenshotFile) errs.push('Please upload a screenshot of the payment');
    if (screenshotFile && screenshotFile.size > 5 * 1024 * 1024) errs.push('Payment screenshot must be less than 5MB');
    if (screenshotFile && !['image/png', 'image/jpeg', 'image/webp'].includes(screenshotFile.type)) {
      errs.push('Payment screenshot must be PNG, JPG, JPEG, or WEBP');
    }
    return errs;
  };

  // ─── NAVIGATION ─────────────────────────────────────────
  const goNext = () => {
    let errs: string[] = [];
    if (step === 1) errs = validateStep1();
    if (step === 3) errs = validateStep3();
    if (step === 5) errs = validateStep5();
    setErrors(errs);
    if (errs.length > 0) return;
    if (step < 5) setStep(step + 1);
    else handleSubmit();
  };

  const goBack = () => {
    setErrors([]);
    if (step > 1) setStep(step - 1);
  };

  const jumpToStep = (s: number) => {
    setErrors([]);
    setStep(s);
  };

  // ─── FILE UPLOAD ────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview('');
  };

  // ─── SUBMIT REGISTRATION ─────────────────────────────────
  const handleSubmit = async () => {
    const errs = [...validateStep1(), ...validateStep3(), ...validateStep5()];
    setErrors(errs);
    if (errs.length > 0) return;
    setSubmitting(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Registration backend is not configured yet.');
      }

      if (!screenshotFile) {
        throw new Error('Please upload a screenshot of the payment');
      }

      const { data, error } = await supabase.functions.invoke<{ error?: string; registrationId?: string }>('submit-registration', {
          body: {
            teamName,
            plan: selectedPlan,
            teamSize: plan.size,
            price: plan.price,
          lead,
          members,
          transactionId,
          screenshot: {
            fileName: screenshotFile.name,
            contentType: screenshotFile.type,
            base64: await fileToBase64(screenshotFile),
          },
        },
      });

      if (error) {
        throw new Error(await getFunctionErrorMessage(error));
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSubmitting(false);
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitting(false);
      setErrors([err instanceof Error ? err.message : 'Something went wrong. Please try again.']);
    }
  };

  // ─── MEMBER FIELD UPDATE HELPER ─────────────────────────
  const updateMember = (idx: number, field: keyof MemberInfo, value: string) => {
    setMembers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // ─── RENDER SUBMISSION SUCCESS ─────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
        <div
          className="max-w-xl w-full p-8 md:p-10 rounded-3xl text-center space-y-6"
          style={{
            background: 'rgba(8,12,24,0.92)',
            border: '1px solid rgba(16,185,129,0.35)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(16,185,129,0.15)',
            animation: 'popCenterCard 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}
        >
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Registration Submitted!</h2>
            <p className="text-slate-300 text-sm md:text-base">
              Your team <span className="text-orange-400 font-bold">{teamName}</span> has been successfully registered for NIRMAAN 2K26.
            </p>
            <p className="text-slate-500 text-xs font-mono mt-1">
              Transaction UTR / ID: <span className="text-blue-400 font-bold">{transactionId}</span>
            </p>
          </div>

          {/* Catchy Quotation Banner */}
          <div className="p-5 rounded-2xl text-center border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(59,130,246,0.08) 100%)',
              borderColor: 'rgba(249,115,22,0.3)',
            }}
          >
            <p className="text-sm md:text-base italic font-semibold text-slate-200 leading-relaxed font-sans">
              "Greatness begins with a single line of code. Get ready to transform your ideas into reality!"
            </p>
            <div className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-widest mt-2">
              — See you at NIRMAAN 2K26 🚀
            </div>
          </div>

          {/* Contact & NOC Reminder Notice Box */}
          <div className="p-4 md:p-5 rounded-2xl text-left space-y-3"
            style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(249,115,22,0.25)' }}>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Next Steps & Important Reminders</span>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              📞 <strong className="text-white">We will be in contact with your team lead shortly</strong> via WhatsApp & Email with your official entry passes and event schedule.
            </p>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs text-amber-300/90 font-mono leading-relaxed flex items-start gap-2">
                <span className="text-amber-400 text-base leading-none">⚠️</span>
                <span>
                  <strong className="text-white uppercase">NOC Requirement:</strong> Please ensure all team members carry their valid <strong className="text-white">College ID cards</strong> and a signed <strong className="text-white">No Objection Certificate (NOC)</strong> from your institution on event day.
                </span>
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-sm text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #EA580C, #F97316)',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              boxShadow: '0 0 30px rgba(249,115,22,0.35)',
            }}
          >
            Back to Home Page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 px-4 md:px-6 relative">
      {/* ─── PRE-REGISTRATION GUIDELINES & NOC MODAL ─── */}
      {!hasAgreedToGuidelines && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{ background: 'rgba(2,8,23,0.92)', backdropFilter: 'blur(20px)' }}>
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(13,21,38,0.98) 0%, rgba(8,12,24,0.98) 100%)',
              border: '1px solid rgba(249,115,22,0.4)',
              boxShadow: '0 0 60px rgba(249,115,22,0.25)',
              animation: 'popCenterCard 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            <div>
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-orange-500/20">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Registration Guidelines & Rules
                  </h3>
                  <p className="text-xs text-orange-400 font-mono font-semibold uppercase tracking-wider">
                    NIRMAAN 2K26 — Essential Requirements
                  </p>
                </div>
              </div>

              {/* NOC Highlight Warning Box */}
              <div className="mb-6 p-4 rounded-2xl flex items-start gap-3"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)' }}>
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs font-mono text-slate-200 leading-relaxed">
                  <strong className="text-amber-400 uppercase tracking-wider block mb-1">Mandatory NOC Certificate Notice:</strong>
                  All participating team members must bring an official <strong className="text-white">No Objection Certificate (NOC)</strong> signed by their College Principal / HOD on the event day along with original <strong className="text-white">College ID Cards</strong>.
                </div>
              </div>

              {/* Guidelines List */}
              <div className="space-y-3 mb-6 text-xs md:text-sm font-mono text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-orange-400 font-bold text-base leading-none">01</span>
                  <div>
                    <strong className="text-white">Team Composition:</strong> Teams can consist of 2, 3, or 4 members (Duo, Trio, or Squad). Multi-college teams are permitted.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-orange-400 font-bold text-base leading-none">02</span>
                  <div>
                    <strong className="text-white">24-Hour Non-Stop Hackathon:</strong> Participants must remain present at ANITS campus for the entire 24-hour duration of the hackathon.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-orange-400 font-bold text-base leading-none">03</span>
                  <div>
                    <strong className="text-white">Bring Your Own Equipment (BYOD):</strong> Teams must carry their own laptops, chargers, hardware components, and extension power boards.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-orange-400 font-bold text-base leading-none">04</span>
                  <div>
                    <strong className="text-white">Included Perks:</strong> Meals, refreshments, high-speed WiFi, swag kit, late-night movie screening, and campfire activities are included.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-orange-400 font-bold text-base leading-none">05</span>
                  <div>
                    <strong className="text-white">Code of Conduct:</strong> Plagiarism or unethical behavior will result in immediate disqualification without refund.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-slate-400 text-center sm:text-left">
                By clicking proceed, you confirm agreement to all rules.
              </div>
              <button
                type="button"
                onClick={() => setHasAgreedToGuidelines(true)}
                className="w-full sm:w-auto px-8 py-3.5 font-bold text-xs md:text-sm text-white uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  boxShadow: '0 0 25px rgba(249,115,22,0.4)',
                }}
              >
                I Agree & Proceed to Register <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 30%, rgba(249,115,22,0.06) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.06) 0%, transparent 55%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-xs font-mono tracking-[0.25em] uppercase">Team Registration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FB923C 50%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Register for NIRMAAN 2K26
          </h1>
          <p className="text-slate-400 text-sm font-mono">Complete all steps to secure your spot.</p>
        </div>

        {/* ─── STEP PROGRESS BAR ─────────────────────────── */}
        <div className="flex items-center justify-center gap-0 mb-12 px-2">
          {STEP_META.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isComplete = step > stepNum;
            const Icon = s.icon;
            return (
              <div key={stepNum} className="flex items-center">
                <button
                  onClick={() => { if (isComplete) jumpToStep(stepNum); }}
                  className="flex flex-col items-center gap-1.5 transition-all duration-300 group"
                  style={{ cursor: isComplete ? 'pointer' : 'default' }}
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isComplete
                        ? 'linear-gradient(135deg, #EA580C, #F97316)'
                        : isActive
                          ? 'rgba(249,115,22,0.15)'
                          : 'rgba(13,21,38,0.7)',
                      border: isActive
                        ? '2px solid #F97316'
                        : isComplete
                          ? '2px solid #F97316'
                          : '1px solid rgba(59,130,246,0.15)',
                      boxShadow: isActive
                        ? '0 0 20px rgba(249,115,22,0.3)'
                        : isComplete
                          ? '0 0 15px rgba(249,115,22,0.2)'
                          : 'none',
                    }}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5" style={{ color: isActive ? '#F97316' : '#475569' }} />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold font-mono tracking-wide hidden md:block ${isActive ? 'text-orange-400' : isComplete ? 'text-orange-500/70' : 'text-slate-600'}`}>
                    {s.label}
                  </span>
                </button>
                {i < STEP_META.length - 1 && (
                  <div
                    className="w-8 md:w-16 h-0.5 mx-1 rounded-full transition-all duration-500"
                    style={{
                      background: step > stepNum
                        ? 'linear-gradient(90deg, #F97316, #EA580C)'
                        : 'rgba(59,130,246,0.12)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ─── FORM CARD ─────────────────────────────────── */}
        <div
          className="rounded-3xl p-6 md:p-10 transition-all duration-300"
          style={{
            background: 'rgba(8,12,24,0.85)',
            border: '1px solid rgba(249,115,22,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5)',
          }}
        >
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {errors.map((err, i) => (
                <p key={i} className="text-red-400 text-xs font-mono flex items-center gap-2">
                  <span className="text-red-500">✗</span> {err}
                </p>
              ))}
            </div>
          )}

          {/* ═══════ STEP 1: Team Info & Lead Details ═══════ */}
          {step === 1 && (
            <div className="animate-[popCenterCard_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <StepHeader number={1} title="Team & Lead Information" subtitle="Enter your team name and team lead's details." />
              <div className="space-y-5">
                <FormField
                  label="Team Name"
                  value={teamName}
                  onChange={setTeamName}
                  placeholder="ENTER TEAM NAME"
                  status={availability.teamName.status}
                  statusText={availability.teamName.message}
                />
                <div className="h-px" style={{ background: 'rgba(59,130,246,0.1)' }} />
                <p className="text-xs text-orange-400/80 font-mono font-bold uppercase tracking-wider">Team Lead Details</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField label="Full Name" value={lead.fullName} onChange={v => setLead({ ...lead, fullName: v })} placeholder="ENTER FULL NAME" />
                  <FormField
                    label="Email"
                    type="email"
                    value={lead.email}
                    onChange={v => setLead({ ...lead, email: v })}
                    placeholder="ENTER EMAIL"
                    status={availability.leadEmail.status}
                    statusText={availability.leadEmail.message}
                  />
                  <FormField
                    label="WhatsApp No."
                    type="tel"
                    value={lead.whatsapp}
                    onChange={v => setLead({ ...lead, whatsapp: v })}
                    placeholder="ENTER WHATSAPP NUMBER"
                    status={availability.leadPhone.status}
                    statusText={availability.leadPhone.message}
                  />
                  <FormSelect label="Gender" value={lead.gender} onChange={v => setLead({ ...lead, gender: v })} options={GENDER_OPTIONS} placeholder="Select gender" />
                  <FormField label="College Name" value={lead.college} onChange={v => setLead({ ...lead, college: v })} placeholder="ENTER COLLEGE NAME" />
                  <FormField label="College Location" value={lead.collegeLocation} onChange={v => setLead({ ...lead, collegeLocation: v })} placeholder="ENTER COLLEGE LOCATION" />
                  <FormField label="State" value={lead.state} onChange={v => setLead({ ...lead, state: v })} placeholder="ENTER STATE" />
                  <FormField label="Stream" value={lead.stream} onChange={v => setLead({ ...lead, stream: v })} placeholder="ENTER STREAM" />
                  <FormSelect label="Year" value={lead.year} onChange={v => setLead({ ...lead, year: v })} options={YEAR_OPTIONS} placeholder="Select year" />
                </div>
              </div>
            </div>
          )}

          {/* ═══════ STEP 2: Team Size Selection ═══════ */}
          {step === 2 && (
            <div className="animate-[popCenterCard_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <StepHeader number={2} title="Choose Your Team Size" subtitle="Bigger team, better discount per head!" />
              <div className="grid md:grid-cols-3 gap-4">
                {TEAM_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = selectedPlan === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSelectedPlan(opt.key)}
                      className="relative p-6 rounded-2xl text-left transition-all duration-300 group"
                      style={{
                        background: isSelected
                          ? 'rgba(249,115,22,0.08)'
                          : 'rgba(13,21,38,0.6)',
                        border: isSelected
                          ? `2px solid ${opt.color}`
                          : '1px solid rgba(59,130,246,0.12)',
                        boxShadow: isSelected
                          ? `0 0 25px ${opt.color}33`
                          : 'none',
                        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      {opt.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black font-mono uppercase tracking-wider text-white"
                          style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>
                          Most Popular
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all"
                        style={{
                          background: `${opt.color}15`,
                          border: `1px solid ${isSelected ? `${opt.color}55` : 'rgba(59,130,246,0.12)'}`,
                        }}>
                        <Icon className="w-6 h-6" style={{ color: opt.color }} />
                      </div>
                      <div className="text-xl font-black text-white mb-0.5">{opt.label}</div>
                      <div className="text-xs text-slate-400 font-mono mb-3">{opt.tagline}</div>
                      <div className="text-3xl font-black mb-1" style={{ color: opt.color }}>₹{opt.price}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{opt.perHead}</div>

                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-6 h-6" style={{ color: opt.color }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 font-mono">
                  💡 Includes: Free Meals, Swag Kit, Mentorship, Certificates, Campfire & Movie Night
                </p>
              </div>
            </div>
          )}

          {/* ═══════ STEP 3: Team Member Details ═══════ */}
          {step === 3 && (
            <div className="animate-[popCenterCard_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <StepHeader
                number={3}
                title="Team Member Details"
                subtitle={`Enter details for your ${members.length} additional team member${members.length > 1 ? 's' : ''}.`}
              />
              <div className="space-y-6">
                {members.map((m, idx) => (
                  <div key={idx} className="p-5 rounded-2xl space-y-4"
                    style={{ background: 'rgba(13,21,38,0.5)', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <p className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                      Member {idx + 2}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Full Name" value={m.fullName} onChange={v => updateMember(idx, 'fullName', v)} placeholder="ENTER FULL NAME" />
                      <FormField
                        label="Email"
                        type="email"
                        value={m.email}
                        onChange={v => updateMember(idx, 'email', v)}
                        placeholder="ENTER EMAIL"
                        status={availability.memberEmails[idx]?.status}
                        statusText={availability.memberEmails[idx]?.message}
                      />
                      <FormField
                        label="WhatsApp No."
                        type="tel"
                        value={m.whatsapp}
                        onChange={v => updateMember(idx, 'whatsapp', v)}
                        placeholder="ENTER WHATSAPP NUMBER"
                        status={availability.memberPhones[idx]?.status}
                        statusText={availability.memberPhones[idx]?.message}
                      />
                      <FormSelect label="Gender" value={m.gender} onChange={v => updateMember(idx, 'gender', v)} options={GENDER_OPTIONS} placeholder="Select gender" />
                      <FormField label="College Name" value={m.college} onChange={v => updateMember(idx, 'college', v)} placeholder="ENTER COLLEGE NAME" />
                      <FormField label="College Location" value={m.collegeLocation} onChange={v => updateMember(idx, 'collegeLocation', v)} placeholder="ENTER COLLEGE LOCATION" />
                      <FormField label="State" value={m.state} onChange={v => updateMember(idx, 'state', v)} placeholder="ENTER STATE" />
                      <FormField label="Stream" value={m.stream} onChange={v => updateMember(idx, 'stream', v)} placeholder="ENTER STREAM" />
                      <FormSelect label="Year" value={m.year} onChange={v => updateMember(idx, 'year', v)} options={YEAR_OPTIONS} placeholder="Select year" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ STEP 4: Review ═══════ */}
          {step === 4 && (
            <div className="animate-[popCenterCard_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <StepHeader number={4} title="Review Your Registration" subtitle="Please verify all details before proceeding to payment." />

              {/* Team Info Review */}
              <ReviewSection title="Team Info" onEdit={() => jumpToStep(1)}>
                <ReviewRow label="Team Name" value={teamName} />
              </ReviewSection>

              {/* Lead Info Review */}
              <ReviewSection title="Team Lead" onEdit={() => jumpToStep(1)}>
                <ReviewRow label="Full Name" value={lead.fullName} />
                <ReviewRow label="Email" value={lead.email} />
                <ReviewRow label="WhatsApp" value={lead.whatsapp} />
                <ReviewRow label="Gender" value={lead.gender} />
                <ReviewRow label="College" value={lead.college} />
                <ReviewRow label="College Location" value={lead.collegeLocation} />
                <ReviewRow label="State" value={lead.state} />
                <ReviewRow label="Stream" value={lead.stream} />
                <ReviewRow label="Year" value={lead.year} />
              </ReviewSection>

              {/* Plan Review */}
              <ReviewSection title="Selected Plan" onEdit={() => jumpToStep(2)}>
                <ReviewRow label="Plan" value={`${plan.label} (${plan.tagline})`} />
                <ReviewRow label="Price" value={`₹${plan.price}`} highlight />
              </ReviewSection>

              {/* Member Reviews */}
              {members.map((m, idx) => (
                <ReviewSection key={idx} title={`Member ${idx + 2}`} onEdit={() => jumpToStep(3)}>
                  <ReviewRow label="Full Name" value={m.fullName} />
                  <ReviewRow label="Email" value={m.email} />
                  <ReviewRow label="WhatsApp" value={m.whatsapp} />
                  <ReviewRow label="Gender" value={m.gender} />
                  <ReviewRow label="College" value={m.college} />
                  <ReviewRow label="College Location" value={m.collegeLocation} />
                  <ReviewRow label="State" value={m.state} />
                  <ReviewRow label="Stream" value={m.stream} />
                  <ReviewRow label="Year" value={m.year} />
                </ReviewSection>
              ))}

              {/* Price Summary */}
              <div className="mt-6 p-5 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(59,130,246,0.06) 100%)',
                border: '1px solid rgba(249,115,22,0.2)',
              }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-300">Total Amount</span>
                  <span className="text-3xl font-black text-orange-400">₹{plan.price}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Inclusive of meals, swag kit, mentorship, certificates, campfire & movie night
                </p>
              </div>
            </div>
          )}

          {/* ═══════ STEP 5: Payment ═══════ */}
          {step === 5 && (
            <div className="animate-[popCenterCard_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <StepHeader number={5} title="Payment" subtitle={`Pay ₹${plan.price} and upload the transaction proof.`} />

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Payment Info */}
                <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(59,130,246,0.12)' }}>
                  <p className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-3">Payment Details</p>
                  <PaymentRow label="UPI ID" value={PAYMENT_INFO.upiId} mono />
                  <PaymentRow label="Name" value={PAYMENT_INFO.scannerName} />
                  <PaymentRow label="Bank" value={PAYMENT_INFO.bankName} />
                  <PaymentRow label="Account No." value={PAYMENT_INFO.accountNo} mono />
                  <PaymentRow label="IFSC" value={PAYMENT_INFO.ifsc} mono />
                  <div className="pt-3">
                    <div className="text-2xl font-black text-orange-400 text-center">₹{plan.price}</div>
                    <p className="text-[10px] text-slate-500 font-mono text-center mt-0.5">Amount to pay</p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="p-5 rounded-2xl flex flex-col items-center justify-center" style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(59,130,246,0.12)' }}>
                  <p className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-4">Scan & Pay</p>
                  <div className="w-48 h-48 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(249,115,22,0.3)' }}>
                    <div className="text-center">
                      <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-[10px] text-slate-500 font-mono">QR Code</p>
                      <p className="text-[9px] text-slate-600 font-mono">Will be placed here</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">UPI: {PAYMENT_INFO.upiId}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <FormField
                  label="Transaction ID / UTR Number"
                  value={transactionId}
                  onChange={setTransactionId}
                  placeholder="ENTER TRANSACTION ID"
                  status={availability.transactionId.status}
                  statusText={availability.transactionId.message}
                />

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 font-mono uppercase tracking-wider">
                    Upload Payment Screenshot
                  </label>
                  {!screenshotPreview ? (
                    <label
                      className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl cursor-pointer transition-all hover:border-orange-400/40 group"
                      style={{
                        background: 'rgba(13,21,38,0.5)',
                        border: '2px dashed rgba(59,130,246,0.2)',
                      }}
                    >
                      <Upload className="w-8 h-8 text-slate-600 group-hover:text-orange-400 transition-colors" />
                      <p className="text-xs text-slate-500 font-mono group-hover:text-slate-400 transition-colors">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono">PNG, JPG, JPEG (Max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative p-4 rounded-2xl" style={{ background: 'rgba(13,21,38,0.5)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors"
                        style={{ background: 'rgba(239,68,68,0.15)' }}
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full max-h-60 object-contain rounded-xl"
                      />
                      <p className="text-[10px] text-emerald-400 font-mono mt-2 text-center">
                        ✓ {screenshotFile?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── NAVIGATION BUTTONS ──────────────────────── */}
          <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-400 hover:text-white rounded-xl transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={goNext}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #EA580C, #F97316)',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                boxShadow: '0 0 25px rgba(249,115,22,0.3)',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : step === 5 ? (
                <>
                  Submit Registration <CheckCircle2 className="w-4 h-4" />
                </>
              ) : step === 4 ? (
                <>
                  Proceed to Payment <CreditCard className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────

function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="text-xs font-mono font-bold text-orange-500/60 uppercase tracking-widest">Step {number} of 5</span>
      <h2 className="text-xl md:text-2xl font-black text-white mt-1 mb-1">{title}</h2>
      <p className="text-xs text-slate-500 font-mono">{subtitle}</p>
    </div>
  );
}

function FormField({
  label, value, onChange, placeholder, type = 'text', status, statusText,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; status?: FieldStatus; statusText?: string;
}) {
  const statusClasses: Record<FieldStatus, string> = {
    idle: 'text-slate-500',
    checking: 'text-blue-300',
    available: 'text-emerald-300',
    taken: 'text-red-300',
    error: 'text-amber-300',
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none transition-all"
        style={{
          background: 'rgba(13,21,38,0.7)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(249,115,22,0.4)'; e.target.style.boxShadow = '0 0 15px rgba(249,115,22,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(59,130,246,0.15)'; e.target.style.boxShadow = 'none'; }}
      />
      {statusText && (
        <p className={`mt-1.5 text-[11px] font-mono ${statusClasses[status || 'idle']}`}>
          {statusText}
        </p>
      )}
    </div>
  );
}

function FormSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white focus:outline-none transition-all appearance-none"
        style={{
          background: 'rgba(13,21,38,0.7)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(249,115,22,0.4)'; e.target.style.boxShadow = '0 0 15px rgba(249,115,22,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(59,130,246,0.15)'; e.target.style.boxShadow = 'none'; }}
      >
        {placeholder && <option value="" className="bg-slate-900">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-4 p-4 rounded-2xl" style={{ background: 'rgba(13,21,38,0.5)', border: '1px solid rgba(59,130,246,0.1)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">{title}</span>
        <button
          type="button"
          onClick={onEdit}
          className="text-[10px] font-bold font-mono text-orange-400 hover:text-orange-300 uppercase tracking-wider transition-colors"
        >
          Edit →
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-slate-500 font-mono">{label}</span>
      <span className={`text-xs font-bold font-mono ${highlight ? 'text-orange-400 text-base' : 'text-slate-200'}`}>{value}</span>
    </div>
  );
}

function PaymentRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs font-bold text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

async function getFunctionErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === 'object' &&
    'context' in error &&
    error.context instanceof Response
  ) {
    try {
      const body = await error.context.clone().json();
      if (typeof body?.error === 'string') return body.error;
    } catch {
      // Fall through to the generic Supabase function error below.
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return 'Registration failed. Please try again.';
}
