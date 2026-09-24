"use client";
import { useEffect, useState } from "react";
import { CalendarClock, Phone, CircleAlert, CircleCheck, CalendarDays, BellRing, Clock3 } from "lucide-react";
import { loadLeads, saveLeads, seedIfEmpty, type Lead } from "@/lib/store";
import { SCORE_STYLE } from "@/lib/scoring";

const DAY = 86400000;

export default function FollowUpPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    seedIfEmpty();
    setLeads(loadLeads().filter((l) => l.status !== "Won" && l.status !== "Lost"));
  }, []);

  const setDate = (id: string, date: string) => {
    const next = leads.map((l) =>
      l.id === id ? { ...l, nextFollowUp: date ? new Date(date).toISOString() : "" } : l
    );
    setLeads(next);
    saveLeads(next);
  };

  const bucket = (lead: Lead): { key: string; label: string } => {
    if (!lead.nextFollowUp) return { key: "none", label: "No Follow-Up Set" };
    const diff = new Date(lead.nextFollowUp).getTime() - Date.now();
    if (diff < 0) return { key: "overdue", label: "Overdue" };
    if (diff < DAY) return { key: "today", label: "Today" };
    if (diff <= 3 * DAY) return { key: "3d", label: "Within 3 Days" };
    if (diff <= 7 * DAY) return { key: "7d", label: "Within 7 Days" };
    if (diff <= 14 * DAY) return { key: "14d", label: "Within 14 Days" };
    if (diff <= 30 * DAY) return { key: "30d", label: "Within 30 Days" };
    return { key: "later", label: "Later" };
  };

  const BUCKETS: { key: string; label: string; icon: React.ReactNode; tint: string }[] = [
    { key: "overdue", label: "Overdue Follow-ups", icon: <CircleAlert className="w-5 h-5 text-red-400" />, tint: "bg-red-500/15 text-red-300" },
    { key: "today", label: "Today's Follow-ups", icon: <BellRing className="w-5 h-5 text-amber-400" />, tint: "bg-amber-400/15 text-amber-300" },
    { key: "3d", label: "Within 3 Days", icon: <Clock3 className="w-5 h-5 text-amber-400" />, tint: "bg-amber-400/15 text-amber-300" },
    { key: "7d", label: "Within 7 Days", icon: <CalendarDays className="w-5 h-5 text-cyan-400" />, tint: "bg-cyan-400/15 text-cyan-300" },
    { key: "30d", label: "Within 30 Days", icon: <CalendarClock className="w-5 h-5 text-purple-400" />, tint: "bg-purple-400/15 text-purple-300" },
    { key: "none", label: "No Follow-Up Set", icon: <CircleCheck className="w-5 h-5 text-slate-400" />, tint: "bg-slate-400/10 text-slate-400" },
  ];

  const bucketLeads = (key: string) => leads.filter((l) => bucket(l).key === key);
  const sorted = [...leads].sort((a, b) =>
    (a.nextFollowUp || "z").localeCompare(b.nextFollowUp || "z")
  );
  const counts = BUCKETS.map((b) => ({ ...b, count: bucketLeads(b.key).length }));

  return (
    <div className="soc-wrap">
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Follow-Up Center</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-cyan-400" />
            Follow-Up Center
          </h1>
          <p className="soc-sub">Automatic reminder buckets — 3 / 7 / 14 / 30 day cadence per blueprint</p>
        </div>
      </div>

      {/* Bucket summary */}
      <div className="soc-kpis mb-6">
        {counts.map((b) => (
          <div key={b.key} className="soc-kpi">
            <div className="flex items-center justify-between gap-2">
              <p className="soc-kpi-label">{b.label}</p>
              <div className={`soc-kpi-icon ${b.tint}`}>{b.icon}</div>
            </div>
            <p className={`text-2xl font-bold font-mono mt-1 ${b.count > 0 ? "text-cyan-300" : "text-slate-600"}`}>{b.count}</p>
          </div>
        ))}
      </div>

      {/* Follow-up list sorted by next action */}
      <div className="soc-panel overflow-hidden" style={{ padding: 0 }}>
        <div className="px-5 py-4 border-b border-ink-700/60">
          <h2 className="soc-card-title">All Open Leads by Next Action</h2>
        </div>
        <div className="divide-y divide-ink-700/60">
          {sorted.length === 0 && (
            <div className="soc-empty">No open leads. Add leads in the CRM module.</div>
          )}
          {sorted.map((lead) => {
            const b = bucket(lead);
            const tint = BUCKETS.find((x) => x.key === b.key)?.tint || "bg-gray-100";
            return (
              <div key={lead.id} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{lead.company}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${SCORE_STYLE[lead.leadScore] || SCORE_STYLE.Cold}`}>
                      {lead.leadScore}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {lead.contactPerson || "—"} • {lead.phone} • {lead.status}
                  </p>
                </div>
                {b.key === "overdue" && (
                  <button
                    onClick={() => window.open(`tel:${lead.phone}`, "_self")}
                    className="soc-btn soc-btn-danger"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </button>
                )}
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="hidden lg:inline">Next:</span>
                  <input
                    type="date"
                    value={lead.nextFollowUp ? lead.nextFollowUp.split("T")[0] : ""}
                    onChange={(e) => setDate(lead.id, e.target.value)}
                    className="px-2 py-1 bg-ink-800 border border-ink-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </label>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${tint}`}>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-xl text-sm text-slate-200">
        <strong className="text-cyan-300">Blueprint reminder cadence:</strong> auto-touch at 3, 7, 14 and 30 days if a follow-up is not actioned.
        A WhatsApp/Email notification hook plugs in here when connected to Supabase.
      </div>
    </div>
  );
}