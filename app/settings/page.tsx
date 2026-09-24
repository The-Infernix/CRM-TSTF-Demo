"use client";
import { useState } from "react";
import { Settings, ShieldCheck, Building2, Megaphone, Bell, User } from "lucide-react";
import { ROLES, ROLE_NAV } from "@/lib/store";

const NAV_LABELS: Record<string, string> = {
  dashboard: "Dashboard", crm: "CRM", "lead-intelligence": "Lead Intelligence",
  audit: "Security Audit", "pitch-builder": "Pitch Builder", proposal: "Proposal Generator",
  pricing: "Pricing Engine", "follow-up": "Follow-Up Center", contracts: "Contract Management",
  "client-portal": "Client Portal", deployment: "Guard Deployment", marketing: "Marketing Center",
  reports: "Reports", settings: "Settings",
};

export default function SettingsPage() {
  const [company, setCompany] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tsfs_company_settings") || "null") || {
        name: "TSFS Private Limited",
        tagline: "Protecting your business around the clock",
        email: "info@tsfs.in",
        phone: "+91 90522 21234",
        city: "Visakhapatnam",
        linkedin: "0", websiteLeads: "0", googleReviews: "0",
        notifyWhatsapp: true, notifyEmail: true, notifyFollowup: true,
      };
    } catch {
      return {};
    }
  });

  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("tsfs_company_settings", JSON.stringify(company));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const set = (k: string, v: string | boolean) => setCompany((p: any) => ({ ...p, [k]: v }));

  return (
    <div className="soc-wrap">
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Settings</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Settings
          </h1>
          <p className="soc-sub">Role permissions, company profile and branding targets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role permissions */}
        <div className="soc-panel">
          <h3 className="soc-card-title mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" /> Role Access Matrix
          </h3>
          <div className="soc-table-wrap">
            <div className="soc-table-scroll">
            <table className="soc-table">
              <thead>
                <tr>
                  <th className="soc-th">Module</th>
                  {Object.keys(ROLES).map((r) => (
                    <th key={r} className="soc-th text-center">{ROLES[r as keyof typeof ROLES].label.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(NAV_LABELS).map((key) => (
                  <tr key={key}>
                    <td className="soc-td">{NAV_LABELS[key]}</td>
                    {Object.keys(ROLES).map((r) => (
                      <td key={r} className="soc-td text-center">
                        {ROLE_NAV[r as keyof typeof ROLES].includes(key) ? "✓" : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Defined in lib/store.ts — edit ROLE_NAV to change access.</p>
        </div>

        <div className="space-y-6">
          {/* Company profile */}
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" /> Company Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Company Name"><input value={company.name} onChange={(e) => set("name", e.target.value)} className="soc-input" /></Field>
              <Field label="Tagline"><input value={company.tagline} onChange={(e) => set("tagline", e.target.value)} className="soc-input" /></Field>
              <Field label="Official Email"><input value={company.email} onChange={(e) => set("email", e.target.value)} className="soc-input" /></Field>
              <Field label="Phone / WhatsApp"><input value={company.phone} onChange={(e) => set("phone", e.target.value)} className="soc-input" /></Field>
              <Field label="Headquarters"><input value={company.city} onChange={(e) => set("city", e.target.value)} className="soc-input" /></Field>
            </div>
          </div>

          {/* Branding targets */}
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-400" /> Branding KPI Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="LinkedIn Followers"><input type="number" value={company.linkedin} onChange={(e) => set("linkedin", e.target.value)} className="soc-input" /></Field>
              <Field label="Website Leads"><input type="number" value={company.websiteLeads} onChange={(e) => set("websiteLeads", e.target.value)} className="soc-input" /></Field>
              <Field label="Google Reviews"><input type="number" value={company.googleReviews} onChange={(e) => set("googleReviews", e.target.value)} className="soc-input" /></Field>
            </div>
          </div>

          {/* Notifications */}
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" /> Notifications
            </h3>
            <div className="divide-y divide-ink-700/60">
              <Toggle label="WhatsApp alerts for new leads & follow-ups" checked={company.notifyWhatsapp} onChange={(v) => set("notifyWhatsapp", v)} />
              <Toggle label="Email reports on contract expiry (90/60/30 days)" checked={company.notifyEmail} onChange={(v) => set("notifyEmail", v)} />
              <Toggle label="Follow-up reminders (3/7/14/30 days)" checked={company.notifyFollowup} onChange={(v) => set("notifyFollowup", v)} />
            </div>
            <p className="text-xs text-slate-500 mt-3">Hooks into WhatsApp/Email gateway when Supabase is connected.</p>
          </div>

          <button onClick={save} className="soc-btn soc-btn-primary w-full py-3">
            <User className="w-4 h-4" /> {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="soc-label">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-3 cursor-pointer">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition relative ${checked ? "bg-cyan-400" : "bg-ink-600"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}