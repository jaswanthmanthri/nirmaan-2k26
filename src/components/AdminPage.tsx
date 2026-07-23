import { useEffect, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  Filter,
  KeyRound,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type PaymentStatus = 'pending' | 'verified' | 'rejected';

type Participant = {
  id: string;
  role: 'lead' | 'member';
  full_name: string;
  email: string;
  whatsapp: string;
  gender: string;
  college: string;
  stream: string;
  year: string;
  created_at: string;
};

type Registration = {
  id: string;
  team_name: string;
  plan: 'duo' | 'trio' | 'squad';
  team_size: number;
  price: number;
  transaction_id: string;
  screenshot_path: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  participants: Participant[];
};

type AdminResponse = {
  registrations?: Registration[];
  signedUrl?: string;
  registration?: Pick<Registration, 'id' | 'payment_status' | 'updated_at'>;
  error?: string;
};

const statusLabels: Record<PaymentStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
};

const statusStyles: Record<PaymentStatus, string> = {
  pending: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
  verified: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
  rejected: 'border-red-400/35 bg-red-400/10 text-red-300',
};

const statusIcons = {
  pending: AlertCircle,
  verified: CheckCircle2,
  rejected: XCircle,
};

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('nirmaan-admin-token') || '');
  const [tokenInput, setTokenInput] = useState(token);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState('');

  const selected = registrations.find((item) => item.id === selectedId) || registrations[0];

  const filtered = registrations.filter((registration) => {
    const haystack = [
      registration.team_name,
      registration.plan,
      registration.transaction_id,
      registration.payment_status,
      ...registration.participants.flatMap((participant) => [
        participant.full_name,
        participant.email,
        participant.whatsapp,
        participant.college,
        participant.stream,
        participant.year,
      ]),
    ].join(' ').toLowerCase();

    const matchesSearch = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || registration.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = registrations.reduce(
    (acc, registration) => {
      acc.teams += 1;
      acc.participants += registration.participants.length;
      acc[registration.payment_status] += 1;
      if (registration.payment_status === 'verified') acc.verifiedRevenue += registration.price;
      if (registration.payment_status === 'pending') acc.pendingRevenue += registration.price;
      return acc;
    },
    { teams: 0, participants: 0, pending: 0, verified: 0, rejected: 0, verifiedRevenue: 0, pendingRevenue: 0 },
  );

  useEffect(() => {
    if (token) {
      void loadRegistrations(token);
    }
  }, []);

  const callAdmin = async (body: Record<string, unknown>, activeToken = token) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.');
    }

    const { data, error: fnError } = await supabase.functions.invoke<AdminResponse>('admin-registrations', {
      body,
      headers: { 'x-admin-token': activeToken },
    });

    if (fnError) {
      throw new Error(await getFunctionErrorMessage(fnError));
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data || {};
  };

  const loadRegistrations = async (activeToken = token) => {
    setLoading(true);
    setError('');
    try {
      const data = await callAdmin({ action: 'list' }, activeToken);
      const next = data.registrations || [];
      setRegistrations(next);
      setSelectedId((current) => current || next[0]?.id || '');
      setToken(activeToken);
      sessionStorage.setItem('nirmaan-admin-token', activeToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load registrations.');
      if (String(err).includes('Unauthorized')) {
        sessionStorage.removeItem('nirmaan-admin-token');
        setToken('');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (registrationId: string, status: PaymentStatus) => {
    setUpdatingId(registrationId);
    setError('');
    try {
      const data = await callAdmin({ action: 'updateStatus', registrationId, status });
      setRegistrations((current) =>
        current.map((item) =>
          item.id === registrationId && data.registration
            ? { ...item, payment_status: data.registration.payment_status, updated_at: data.registration.updated_at }
            : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update payment status.');
    } finally {
      setUpdatingId('');
    }
  };

  const viewScreenshot = async (registration: Registration) => {
    setScreenshotLoading(true);
    setScreenshotUrl('');
    setError('');
    try {
      const data = await callAdmin({ action: 'screenshotUrl', screenshotPath: registration.screenshot_path });
      setScreenshotUrl(data.signedUrl || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create screenshot link.');
    } finally {
      setScreenshotLoading(false);
    }
  };

  const exportCsv = () => {
    const rows = filtered.flatMap((registration) =>
      sortParticipants(registration.participants).map((participant) => ({
        team_name: registration.team_name,
        plan: registration.plan,
        team_size: registration.team_size,
        price: registration.price,
        payment_status: registration.payment_status,
        transaction_id: registration.transaction_id,
        registered_at: formatDate(registration.created_at),
        participant_role: participant.role,
        participant_name: participant.full_name,
        participant_email: participant.email,
        participant_whatsapp: participant.whatsapp,
        participant_gender: participant.gender,
        participant_college: participant.college,
        participant_stream: participant.stream,
        participant_year: participant.year,
        screenshot_path: registration.screenshot_path,
      })),
    );

    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nirmaan-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div className="min-h-screen px-4 pt-28 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-orange-500/20 bg-slate-950/80 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10">
              <ShieldCheck className="h-6 w-6 text-orange-300" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">Organizer Access</p>
              <h1 className="text-2xl font-black text-white">Admin Console</h1>
            </div>
          </div>

          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            Admin Token
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-slate-900/80 px-4 py-3">
            <KeyRound className="h-4 w-4 text-blue-300" />
            <input
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && tokenInput.trim()) void loadRegistrations(tokenInput.trim());
              }}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600"
              placeholder="Enter organizer token"
            />
          </div>

          {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}

          <button
            type="button"
            onClick={() => tokenInput.trim() && loadRegistrations(tokenInput.trim())}
            disabled={!tokenInput.trim() || loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-28 pb-14 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5">
              <ShieldCheck className="h-4 w-4 text-orange-300" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">NIRMAAN Control Room</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Registration Admin</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Review teams, verify payments, inspect proof screenshots, and export organizer-ready data.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <IconButton label="Refresh" onClick={() => loadRegistrations()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </IconButton>
            <IconButton label="Export CSV" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Lock"
              onClick={() => {
                sessionStorage.removeItem('nirmaan-admin-token');
                setToken('');
                setTokenInput('');
              }}
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Teams" value={totals.teams} icon={Users} accent="text-blue-300" />
          <StatCard label="Participants" value={totals.participants} icon={ClipboardCheck} accent="text-cyan-300" />
          <StatCard label="Pending" value={totals.pending} icon={AlertCircle} accent="text-amber-300" />
          <StatCard label="Verified" value={totals.verified} icon={CheckCircle2} accent="text-emerald-300" />
          <StatCard label="Verified Rs." value={totals.verifiedRevenue} icon={ShieldCheck} accent="text-orange-300" />
        </section>

        <section className="mb-5 grid gap-3 rounded-2xl border border-blue-500/15 bg-slate-950/70 p-4 backdrop-blur-xl lg:grid-cols-[1fr_auto_auto]">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/80 px-4 py-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600"
              placeholder="Search team, lead, email, phone, college, transaction..."
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/80 px-4 py-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | PaymentStatus)}
              className="bg-transparent text-sm font-bold text-white outline-none"
            >
              <option className="bg-slate-950" value="all">All Status</option>
              <option className="bg-slate-950" value="pending">Pending</option>
              <option className="bg-slate-950" value="verified">Verified</option>
              <option className="bg-slate-950" value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-orange-200">
            {filtered.length} shown
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/75 backdrop-blur-xl">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[880px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/80">
                  <tr className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((registration) => {
                    const lead = getLead(registration);
                    return (
                      <tr
                        key={registration.id}
                        className={`border-b border-slate-900/80 transition hover:bg-slate-900/70 ${selected?.id === registration.id ? 'bg-blue-500/5' : ''}`}
                      >
                        <td className="px-4 py-4">
                          <button type="button" onClick={() => setSelectedId(registration.id)} className="text-left">
                            <div className="font-bold text-white">{registration.team_name}</div>
                            <div className="mt-1 font-mono text-[11px] text-slate-500">{registration.transaction_id}</div>
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-slate-200">{lead?.full_name || 'No lead'}</div>
                          <div className="mt-1 text-xs text-slate-500">{lead?.email}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-bold capitalize text-slate-200">{registration.plan}</div>
                          <div className="mt-1 text-xs text-slate-500">{registration.team_size} members / Rs. {registration.price}</div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={registration.payment_status} />
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-400">{formatDate(registration.created_at)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title="View screenshot"
                              onClick={() => viewScreenshot(registration)}
                              className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-2 text-blue-200 transition hover:bg-blue-400/20"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <StatusSelect
                              status={registration.payment_status}
                              disabled={updatingId === registration.id}
                              onChange={(status) => updateStatus(registration.id, status)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden">
              {filtered.map((registration) => {
                const lead = getLead(registration);
                return (
                  <button
                    key={registration.id}
                    type="button"
                    onClick={() => setSelectedId(registration.id)}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-white">{registration.team_name}</div>
                        <div className="mt-1 text-xs text-slate-500">{lead?.full_name} / {lead?.email}</div>
                      </div>
                      <StatusBadge status={registration.payment_status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{registration.team_size} members</span>
                      <span>Rs. {registration.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">No registrations match the current filters.</div>
            )}
          </section>

          <aside className="rounded-2xl border border-orange-500/15 bg-slate-950/80 p-5 backdrop-blur-xl">
            {selected ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">Team Detail</p>
                    <h2 className="mt-1 text-2xl font-black text-white">{selected.team_name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(selected.created_at)}</p>
                  </div>
                  <StatusBadge status={selected.payment_status} />
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <InfoTile label="Plan" value={`${selected.plan} / ${selected.team_size}`} />
                  <InfoTile label="Amount" value={`Rs. ${selected.price}`} />
                  <InfoTile label="Transaction" value={selected.transaction_id} wide />
                </div>

                <div className="mb-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => viewScreenshot(selected)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-400/25 bg-blue-400/10 px-4 py-3 text-sm font-bold text-blue-100 transition hover:bg-blue-400/20"
                  >
                    {screenshotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                    View Screenshot
                  </button>
                  <StatusSelect
                    status={selected.payment_status}
                    disabled={updatingId === selected.id}
                    onChange={(status) => updateStatus(selected.id, status)}
                  />
                </div>

                <div className="space-y-3">
                  {sortParticipants(selected.participants).map((participant) => (
                    <div key={participant.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="font-bold text-white">{participant.full_name}</div>
                        <span className="rounded-full border border-slate-700 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-slate-400">
                          {participant.role}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-400">
                        <p>{participant.email}</p>
                        <p>{participant.whatsapp}</p>
                        <p>{participant.college}</p>
                        <p>{participant.stream} / {participant.year}</p>
                        <p>{participant.gender}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">Select a registration to inspect details.</div>
            )}
          </aside>
        </div>
      </div>

      {screenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">Payment Screenshot</span>
              <button
                type="button"
                onClick={() => setScreenshotUrl('')}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[82vh] overflow-auto bg-slate-900 p-4">
              <img src={screenshotUrl} alt="Payment screenshot" className="mx-auto max-h-[78vh] rounded-lg object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/75 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/80 text-slate-200 transition hover:border-orange-400/40 hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const Icon = statusIcons[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase ${statusStyles[status]}`}>
      <Icon className="h-3 w-3" />
      {statusLabels[status]}
    </span>
  );
}

function StatusSelect({
  status,
  disabled,
  onChange,
}: {
  status: PaymentStatus;
  disabled?: boolean;
  onChange: (status: PaymentStatus) => void;
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as PaymentStatus)}
      className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs font-bold text-slate-100 outline-none transition hover:border-orange-400/50 disabled:opacity-50"
      title="Change payment status"
    >
      <option value="pending">Pending</option>
      <option value="verified">Verified</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}

function InfoTile({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/70 p-3 ${wide ? 'col-span-2' : ''}`}>
      <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="break-words text-sm font-bold text-slate-100">{value}</div>
    </div>
  );
}

function getLead(registration: Registration) {
  return registration.participants.find((participant) => participant.role === 'lead');
}

function sortParticipants(participants: Participant[]) {
  return [...participants].sort((a, b) => {
    if (a.role !== b.role) return a.role === 'lead' ? -1 : 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((header) => {
        const value = String(row[header] ?? '');
        return `"${value.replace(/"/g, '""')}"`;
      }).join(','),
    ),
  ];
  return lines.join('\n');
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
      // Keep the fallback below.
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return 'Admin request failed.';
}
