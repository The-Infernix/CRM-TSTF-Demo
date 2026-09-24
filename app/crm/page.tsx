"use client";
import { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2, X, Search, Calendar, DollarSign, Building2 } from "lucide-react";
import {
  loadLeads, saveLeads, LEAD_STATUSES, seedIfEmpty, type Lead,
} from "@/lib/store";
import { scoreLead, STATUS_STYLE, SCORE_STYLE } from "@/lib/scoring";

const EMPTY: Lead = {
  id: "", company: "", industry: "Hospital", city: "", address: "",
  contactPerson: "", designation: "", phone: "", email: "",
  currentVendor: "", contractRenewalDate: "", estimatedGuardCount: 5,
  budgetConfirmed: false, status: "New", potentialRevenue: 0, leadScore: "Cold",
  painPoints: "Medium", createdAt: "", nextFollowUp: "",
};

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<Lead>(EMPTY);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    seedIfEmpty();
    setLeads(loadLeads());
  }, []);

  const filtered = leads.filter((l) => {
    const matchSearch = (l.company + l.contactPerson + l.city + (l.currentVendor || "")).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, createdAt: new Date().toISOString(), nextFollowUp: new Date(Date.now() + 3 * 86400000).toISOString() });
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({ ...EMPTY, ...lead });
    setShowModal(true);
  };

  const persist = (next: Lead[]) => {
    setLeads(next);
    saveLeads(next);
  };

  const handleSave = () => {
    if (!form.company) { alert("Company name is required"); return; }
    const lead: Lead = {
      ...form,
      id: editing?.id || Date.now().toString(),
      potentialRevenue: Number(form.potentialRevenue) || 0,
      estimatedGuardCount: Number(form.estimatedGuardCount) || 0,
      leadScore: scoreLead(form),
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    const next = editing ? leads.map((l) => (l.id === lead.id ? lead : l)) : [...leads, lead];
    persist(next);
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this lead?")) persist(leads.filter((l) => l.id !== id));
  };

  const handleStatus = (id: string, status: string) => {
    persist(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const upcoming = leads.filter((l) => l.status === "Negotiation" || l.status === "Proposal Sent").length;
  const pipeValue = leads.reduce((s, l) => s + (l.potentialRevenue || 0), 0);

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// CRM — Lead Records</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" /> CRM
          </h1>
          <p className="soc-sub">Full lead records — company, decision maker, vendor, renewal & value</p>
        </div>
        <div className="soc-actions">
          <button onClick={openNew} className="soc-btn soc-btn-primary">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="soc-kpis mb-6">
        <Drawer label="Total Leads" value={String(leads.length)} icon={<Users className="w-5 h-5" />} tone="cyan" />
        <Drawer label="In Negotiation / Proposal" value={String(upcoming)} icon={<Calendar className="w-5 h-5" />} tone="amber" />
        <Drawer label="Pipeline Value" value={`₹${(pipeValue / 100000).toFixed(1)}L`} icon={<DollarSign className="w-5 h-5" />} tone="green" />
        <Drawer label="Renewals Due (90d)" value={String(renewalsDue(leads))} icon={<Building2 className="w-5 h-5" />} tone="purple" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact, city or vendor..."
            className="soc-input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="soc-select sm:w-56 shrink-0"
        >
          <option value="all">All Statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="soc-table-wrap">
        <div className="soc-table-scroll">
        <table className="soc-table">
          <thead>
            <tr>
              <th className="soc-th">Company</th>
              <th className="soc-th">Contact</th>
              <th className="soc-th">Vendor / Renewal</th>
              <th className="soc-th">Expected</th>
              <th className="soc-th">Status</th>
              <th className="soc-th">Score</th>
              <th className="soc-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td className="soc-td">
                  <div className="font-medium text-slate-200">{lead.company}</div>
                  <div className="text-xs text-slate-500 font-mono">{lead.industry} • {lead.city}</div>
                </td>
                <td className="soc-td">
                  <div className="text-sm">{lead.contactPerson || "—"}</div>
                  <div className="text-xs text-slate-500 font-mono">{lead.phone}</div>
                </td>
                <td className="soc-td text-sm">
                  <div>{lead.currentVendor || "No current vendor"}</div>
                  {lead.contractRenewalDate && (
                    <div className="text-xs text-slate-500 font-mono">Renews {new Date(lead.contractRenewalDate).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="soc-td">
                  <div className="font-mono font-semibold text-slate-200">₹{((lead.potentialRevenue || 0) / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-slate-500">{lead.estimatedGuardCount || "—"} guards</div>
                </td>
                <td className="soc-td">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatus(lead.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-[11px] font-mono border outline-none bg-transparent ${STATUS_STYLE[lead.status] || STATUS_STYLE.New}`}
                  >
                    {LEAD_STATUSES.map((s) => <option key={s} className="text-slate-300">{s}</option>)}
                  </select>
                </td>
                <td className="soc-td">
                  <span className={`px-2 py-1 rounded-full text-[11px] font-mono border ${SCORE_STYLE[lead.leadScore] || SCORE_STYLE.Cold}`}>
                    {lead.leadScore}
                  </span>
                </td>
                <td className="soc-td">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(lead)} className="text-slate-500 hover:text-cyan-400"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(lead.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="soc-empty">No leads found. Click &quot;Add Lead&quot;.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-100">{editing ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Company Name *"><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="soc-input" placeholder="e.g., Apollo Hospitals" /></Field>
              <Field label="Industry">
                <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="soc-select">
                  <option>Hospital</option><option>Factory</option><option>IT Park</option><option>Apartment</option><option>Mall</option><option>Other</option>
                </select>
              </Field>
              <Field label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="soc-input" /></Field>
              <Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="soc-input" /></Field>
              <Field label="Contact Person"><input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="soc-input" /></Field>
              <Field label="Designation"><input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="soc-input" placeholder="e.g., Facility Head" /></Field>
              <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="soc-input" /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="soc-input" /></Field>
              <Field label="Current Vendor"><input value={form.currentVendor} onChange={(e) => setForm({ ...form, currentVendor: e.target.value })} className="soc-input" placeholder="Incumbent security agency" /></Field>
              <Field label="Contract Renewal Date"><input type="date" value={form.contractRenewalDate ? form.contractRenewalDate.split("T")[0] : ""} onChange={(e) => setForm({ ...form, contractRenewalDate: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="soc-input" /></Field>
              <Field label="Estimated Guard Count"><input type="number" value={form.estimatedGuardCount} onChange={(e) => setForm({ ...form, estimatedGuardCount: Number(e.target.value) })} className="soc-input" /></Field>
              <Field label="Potential Revenue (₹ / year)"><input type="number" value={form.potentialRevenue} onChange={(e) => setForm({ ...form, potentialRevenue: Number(e.target.value) })} className="soc-input" /></Field>
              <Field label="Pain Points">
                <select value={form.painPoints} onChange={(e) => setForm({ ...form, painPoints: e.target.value })} className="soc-select">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </Field>
              <Field label="Budget Confirmed">
                <select value={form.budgetConfirmed ? "yes" : "no"} onChange={(e) => setForm({ ...form, budgetConfirmed: e.target.value === "yes" })} className="soc-select">
                  <option value="yes">Confirmed</option><option value="no">Unknown</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="soc-select">
                  {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Next Follow-Up"><input type="date" value={form.nextFollowUp ? form.nextFollowUp.split("T")[0] : ""} onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="soc-input" /></Field>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 soc-btn soc-btn-primary">Save Lead</button>
              <button onClick={() => setShowModal(false)} className="flex-1 soc-btn soc-btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Drawer({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: "cyan" | "green" | "amber" | "purple" }) {
  const tones: Record<string, string> = {
    cyan: "bg-cyan-400/15 text-cyan-300",
    green: "bg-lime-400/15 text-lime-300",
    amber: "bg-amber-400/15 text-amber-300",
    purple: "bg-purple-400/15 text-purple-300",
  };
  return (
    <div className="soc-kpi">
      <div className="flex items-start justify-between gap-2">
        <p className="soc-kpi-label">{label}</p>
        <div className={`${tones[tone] || tones.cyan} soc-kpi-icon rounded-full`}>{icon}</div>
      </div>
      <p className="soc-kpi-value mt-1">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="soc-label mb-1">{label}</label>
      {children}
    </div>
  );
}

function renewalsDue(leads: Lead[]) {
  const now = Date.now();
  return leads.filter((l) => l.contractRenewalDate && new Date(l.contractRenewalDate).getTime() <= now + 90 * 86400000).length;
}