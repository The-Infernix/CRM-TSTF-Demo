"use client";
import { useEffect, useState } from "react";
import { ScrollText, TrendingUp, BarChart3, PieChart, Percent } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPie, Pie, Cell, Legend,
} from "recharts";
import { loadLeads, loadContracts, loadAudits, seedIfEmpty, type Lead, type Contract } from "@/lib/store";

export default function ReportsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    seedIfEmpty();
    setLeads(loadLeads());
    setContracts(loadContracts());
  }, []);

  const won = leads.filter((l) => l.status === "Won").length;
  const lost = leads.filter((l) => l.status === "Lost").length;
  const meetings = leads.filter((l) => l.status === "Meeting Scheduled").length;
  const proposals = leads.filter((l) => l.status === "Proposal Sent").length;
  const active = leads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const conversion = leads.length ? ((won / leads.length) * 100).toFixed(1) : "0";

  const monthlyRevenue = contracts.map((c) => c.monthlyValue).reduce((a, b) => a + b, 0);
  const annualRevenue = monthlyRevenue * 12;
  const activeContracts = contracts.length;

  // Revenue pipeline by month (contracts spread on next 6 months for demo trend)
  const now = Date.now();
  const revenueSeries = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now + i * 30 * 86400000);
    return {
      month: d.toLocaleString("en", { month: "short" }),
      revenue: Math.round((monthlyRevenue / 6) * (i + 1) * (1 + (i % 3) * 0.05)),
    };
  });

  const funnelData = [
    { name: "Leads", value: active.length, color: "#22d3ee" },
    { name: "Meetings", value: meetings, color: "#a3e635" },
    { name: "Proposals", value: proposals, color: "#fbbf24" },
    { name: "Won", value: won, color: "#a78bfa" },
  ];

  const industryCount: Record<string, number> = {};
  leads.forEach((l) => { industryCount[l.industry] = (industryCount[l.industry] || 0) + 1; });
  const industryData = Object.entries(industryCount).map(([name, value]) => ({ name, value }));

  const scoreData = [
    { name: "Hot", value: leads.filter((l) => l.leadScore === "Hot").length, color: "#f87171" },
    { name: "Warm", value: leads.filter((l) => l.leadScore === "Warm").length, color: "#fbbf24" },
    { name: "Cold", value: leads.filter((l) => l.leadScore === "Cold").length, color: "#22d3ee" },
  ];

  const audits = loadAudits();
  const avgRisk = audits.length ? Math.round(audits.reduce((s, a) => s + a.riskScore, 0) / audits.length) : 0;

  return (
    <div className="soc-wrap">
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Reports</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            Reports
          </h1>
          <p className="soc-sub">Aggregated business intelligence across the Growth Engine</p>
        </div>
      </div>

      {/* Revenue KPIs */}
      <h3 className="soc-kpi-label mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Revenue</h3>
      <div className="soc-kpis mb-8">
        <KPI label="Monthly Revenue" value={`₹${(monthlyRevenue / 100000).toFixed(1)}L`} />
        <KPI label="Quarterly Revenue" value={`₹${(monthlyRevenue * 3 / 100000).toFixed(1)}L`} />
        <KPI label="Annual Revenue" value={`₹${(annualRevenue / 10000000).toFixed(2)}Cr`} />
        <KPI label="Active Contracts" value={String(activeContracts)} />
      </div>

      {/* Sales KPIs */}
      <h3 className="soc-kpi-label mb-3"><BarChart3 className="w-4 h-4 inline text-cyan-400" /> Sales Pipeline</h3>
      <div className="soc-kpis mb-8">
        <KPI label="Leads" value={String(leads.length)} />
        <KPI label="Meetings" value={String(meetings)} />
        <KPI label="Proposals" value={String(proposals)} />
        <KPI label="Wins" value={String(won)} />
        <KPI label="Losses" value={String(lost)} />
        <KPI label="Conversion" value={`${conversion}%`} fancy />
      </div>

      {/* Operations + Marketing */}
      <h3 className="soc-kpi-label mb-3"><PieChart className="w-4 h-4 inline text-cyan-400" /> Operations & Marketing</h3>
      <div className="soc-kpis mb-8">
        <KPI label="Avg Audit Risk Score" value={audits.length ? `${avgRisk}/100` : "—"} />
        <KPI label="Audits Conducted" value={String(audits.length)} />
        <KPI label="Guards Deployed" value={`${contracts.reduce((s, c) => s + c.guardCount, 0)}`} />
        <KPI label="Website Leads (mock)" value="—" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="soc-panel">
          <h3 className="soc-card-title mb-4">Revenue Projection (6 months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3a5c" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <Tooltip formatter={(value) => (value ? `₹${Number(value).toLocaleString()}` : "")} contentStyle={{ background: "#0a0e18", border: "1px solid #2c3a5c", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="soc-panel">
          <h3 className="soc-card-title mb-4">Sales Funnel</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RPie>
              <Pie data={funnelData} cx="50%" cy="50%" dataKey="value" nameKey="name" label>
                {funnelData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0a0e18", border: "1px solid #2c3a5c", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ color: "#94a3b8" }} />
            </RPie>
          </ResponsiveContainer>
        </div>

        <div className="soc-panel">
          <h3 className="soc-card-title mb-4">Lead Score Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3a5c" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <Tooltip contentStyle={{ background: "#0a0e18", border: "1px solid #2c3a5c", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} />
              <Bar dataKey="value" name="Leads">
                {scoreData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="soc-panel">
          <h3 className="soc-card-title mb-4">Leads by Industry</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={industryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3a5c" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#47587f" />
              <Tooltip contentStyle={{ background: "#0a0e18", border: "1px solid #2c3a5c", borderRadius: 8 }} labelStyle={{ color: "#e2e8f0" }} />
              <Bar dataKey="value" name="Leads" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <Percent className="w-4 h-4" />
        Export options (PDF / CSV) map to the Reports module when Supabase is connected.
      </div>
    </div>
  );
}

function KPI({ label, value, fancy }: { label: string; value: string; fancy?: boolean }) {
  return (
    <div className="soc-kpi">
      <p className="soc-kpi-label">{label}</p>
      <p className="soc-kpi-value" style={fancy ? { color: "#a3e635" } : undefined}>{value}</p>
    </div>
  );
}