"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, TrendingUp, Building2, DollarSign,
  Plus, Edit2, Trash2, X, CheckCircle, Calendar, Globe,
  AlertTriangle, Clock, FileText, Phone, Star
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis
} from "recharts";

// Types
interface Lead {
  id: string;
  company: string;
  industry: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: string;
  potentialRevenue: number;
  leadScore: string;
  painPoints: string;
  createdAt: string;
  nextFollowUp: string;
}

// Industry scores
const industryScores: Record<string, number> = {
  "Hospital": 20,
  "Factory": 15,
  "IT Park": 20,
  "Apartment": 10,
  "Mall": 15
};

// Calculate lead score
const calculateLeadScore = (lead: Partial<Lead>): string => {
  let score = 0;
  score += industryScores[lead.industry || ""] || 10;
  score += lead.contactPerson ? 20 : 0;

  const painScores: Record<string, number> = {
    "High": 25,
    "Medium": 15,
    "Low": 5
  };
  score += painScores[lead.painPoints || "Low"] || 5;

  if (lead.potentialRevenue && lead.potentialRevenue > 500000) score += 20;
  else if (lead.potentialRevenue) score += 5;

  if (score >= 60) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
};

const STATUS_TONE: Record<string, string> = {
  "New": "bg-ink-700 text-slate-300 border-ink-500",
  "Contacted": "bg-cyan-400/15 text-cyan-300 border-cyan-400/40",
  "Meeting Scheduled": "bg-amber-400/15 text-amber-300 border-amber-400/40",
  "Site Audit": "bg-purple-400/15 text-purple-300 border-purple-400/40",
  "Proposal Sent": "bg-indigo-400/15 text-indigo-300 border-indigo-400/40",
  "Negotiation": "bg-orange-400/15 text-orange-300 border-orange-400/40",
  "Won": "bg-lime-400/15 text-lime-300 border-lime-400/40",
  "Lost": "bg-red-400/15 text-red-300 border-red-400/40"
};

const SCORE_TONE: Record<string, string> = {
  Hot: "bg-red-400/15 text-red-300 border-red-400/40",
  Warm: "bg-amber-400/15 text-amber-300 border-amber-400/40",
  Cold: "bg-cyan-400/15 text-cyan-300 border-cyan-400/40"
};

const CHART_TOOLTIP = { background: "#0a0e18", border: "1px solid #2c3a5c", borderRadius: 8 };

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("ceo");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company: "",
    industry: "Hospital",
    city: "",
    contactPerson: "",
    phone: "",
    email: "",
    status: "New",
    potentialRevenue: "",
    painPoints: "Medium"
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/");
    } else {
      setUserRole(role);
      loadLeads();
      loadMetrics();
    }
  }, []);

  const loadLeads = () => {
    const saved = localStorage.getItem("tsfs_leads");
    if (saved) {
      setLeads(JSON.parse(saved));
    } else {
      // Sample data
      const sampleLeads: Lead[] = [
        {
          id: "1",
          company: "Apollo Hospitals",
          industry: "Hospital",
          city: "Vizag",
          contactPerson: "Dr. Sharma",
          phone: "9876543210",
          email: "admin@apollo.com",
          status: "Meeting Scheduled",
          potentialRevenue: 420000,
          leadScore: "Hot",
          painPoints: "High",
          createdAt: new Date().toISOString(),
          nextFollowUp: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: "2",
          company: "Vizag SEZ",
          industry: "IT Park",
          city: "Vizag",
          contactPerson: "Mr. Rajesh",
          phone: "9876543211",
          email: "admin@vizagsez.com",
          status: "Proposal Sent",
          potentialRevenue: 890000,
          leadScore: "Hot",
          painPoints: "High",
          createdAt: new Date().toISOString(),
          nextFollowUp: new Date(Date.now() + 172800000).toISOString()
        },
        {
          id: "3",
          company: "CMR Mall",
          industry: "Mall",
          city: "Vizag",
          contactPerson: "Mrs. Priya",
          phone: "9876543212",
          email: "admin@cmrmall.com",
          status: "Negotiation",
          potentialRevenue: 310000,
          leadScore: "Warm",
          painPoints: "Medium",
          createdAt: new Date().toISOString(),
          nextFollowUp: new Date(Date.now() + 43200000).toISOString()
        }
      ];
      setLeads(sampleLeads);
      localStorage.setItem("tsfs_leads", JSON.stringify(sampleLeads));
    }
  };

  const saveLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
    localStorage.setItem("tsfs_leads", JSON.stringify(newLeads));
  };

  const handleAddLead = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      company: formData.company,
      industry: formData.industry,
      city: formData.city,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      potentialRevenue: parseFloat(formData.potentialRevenue) || 0,
      leadScore: "Cold",
      painPoints: formData.painPoints,
      createdAt: new Date().toISOString(),
      nextFollowUp: new Date(Date.now() + 7 * 86400000).toISOString()
    };
    newLead.leadScore = calculateLeadScore(newLead);
    saveLeads([...leads, newLead]);
    setShowLeadModal(false);
    resetForm();
  };

  const handleUpdateLead = () => {
    if (!editingLead) return;
    const updatedLead: Lead = {
      ...editingLead,
      company: formData.company,
      industry: formData.industry,
      city: formData.city,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      potentialRevenue: parseFloat(formData.potentialRevenue) || 0,
      painPoints: formData.painPoints
    };
    updatedLead.leadScore = calculateLeadScore(updatedLead);
    const updatedLeads = leads.map(l => l.id === editingLead.id ? updatedLead : l);
    saveLeads(updatedLeads);
    setShowLeadModal(false);
    setEditingLead(null);
    resetForm();
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Delete this lead?")) {
      saveLeads(leads.filter(l => l.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    saveLeads(updated);
  };

  const handleAddFollowup = (lead: Lead) => {
    const newFollowupDate = prompt("Enter follow-up date (YYYY-MM-DD):");
    if (newFollowupDate) {
      const updated = leads.map(l => l.id === lead.id ? { ...l, nextFollowUp: new Date(newFollowupDate).toISOString() } : l);
      saveLeads(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "", industry: "Hospital", city: "", contactPerson: "",
      phone: "", email: "", status: "New", potentialRevenue: "", painPoints: "Medium"
    });
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      company: lead.company,
      industry: lead.industry,
      city: lead.city,
      contactPerson: lead.contactPerson,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      potentialRevenue: lead.potentialRevenue.toString(),
      painPoints: lead.painPoints
    });
    setShowLeadModal(true);
  };

  // Stats
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === "Won").length;
  const totalRevenue = leads.reduce((sum, l) => sum + (l.status === "Won" ? l.potentialRevenue : 0), 0);
  const hotLeads = leads.filter(l => l.leadScore === "Hot").length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  // Blueprint metric groups — computed client-side to avoid SSR reads
  const meetings = leads.filter(l => l.status === "Meeting Scheduled").length;
  const proposals = leads.filter(l => l.status === "Proposal Sent").length;
  const losses = leads.filter(l => l.status === "Lost").length;
  const attendanceAvg = 97;

  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0, activeClients: 0, guardsDeployed: 0, incidents: 0,
    websiteLeads: 12, linkedinFollowers: 850, reviews: 0, avgRating: 0,
  });

  const loadMetrics = () => {
    let contracts: any[] = [];
    try { contracts = JSON.parse(localStorage.getItem("tsfs_contracts") || "[]"); } catch { /* noop */ }
    let linkedinPosts: any[] = [];
    let reviews: any[] = [];
    try { linkedinPosts = JSON.parse(localStorage.getItem("tsfs_linkedin_posts") || "[]"); } catch { /* noop */ }
    try { reviews = JSON.parse(localStorage.getItem("tsfs_google_reviews") || "[]"); } catch { /* noop */ }
    let incidents = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || "";
      if (k.startsWith("tsfs_incidents_")) {
        try { incidents += JSON.parse(localStorage.getItem(k) || "[]").length; } catch { /* noop */ }
      }
    }
    const engagement = linkedinPosts.reduce((s, p) => s + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
    setMetrics({
      monthlyRevenue: contracts.reduce((s: number, c: any) => s + (Number(c.monthlyValue) || 0), 0),
      activeClients: contracts.filter((c: any) => c.status === "Active").length,
      guardsDeployed: contracts.reduce((s: number, c: any) => s + (Number(c.guardCount) || 0), 0),
      incidents,
      websiteLeads: 12,
      linkedinFollowers: 850 + engagement,
      reviews: reviews.length,
      avgRating: Number(avgRating.toFixed(1)),
    });
  };

  const formatFollowers = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const todayFollowups = leads.filter(l => {
    if (!l.nextFollowUp) return false;
    const today = new Date().toDateString();
    const followupDate = new Date(l.nextFollowUp).toDateString();
    return followupDate === today;
  });

  const funnelData = [
    { name: "Leads", value: leads.filter(l => l.status !== "Won" && l.status !== "Lost").length, color: "#22d3ee" },
    { name: "Meetings", value: meetings, color: "#a3e635" },
    { name: "Proposals", value: proposals, color: "#f59e0b" },
    { name: "Won", value: wonLeads, color: "#a78bfa" }
  ];

  const revenueData = [
    { month: "Jan", revenue: 850000 },
    { month: "Feb", revenue: 920000 },
    { month: "Mar", revenue: totalRevenue * 0.3 },
    { month: "Apr", revenue: totalRevenue * 0.5 },
    { month: "May", revenue: totalRevenue * 0.7 },
    { month: "Jun", revenue: totalRevenue }
  ];

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// Command Overview</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            Mission Dashboard
          </h1>
          <p className="soc-sub">{userRole.toUpperCase()} OPERATOR · {leads.length} total leads on the net</p>
        </div>
        <div className="soc-actions">
          <button
            onClick={() => { setEditingLead(null); resetForm(); setShowLeadModal(true); }}
            className="soc-btn soc-btn-primary"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <>
        <div className="soc-kicker mb-2">// Revenue</div>
        <div className="soc-kpis mb-6">
          <KPICard tone="cyan" title="Monthly Revenue" value={`₹${(metrics.monthlyRevenue / 100000).toFixed(1)}L`} change="recurring contracts" icon={<DollarSign />} />
          <KPICard tone="green" title="Quarter Revenue" value={`₹${(metrics.monthlyRevenue * 3 / 100000).toFixed(1)}L`} change="projected" icon={<TrendingUp />} />
          <KPICard tone="purple" title="Annual Revenue" value={`₹${(metrics.monthlyRevenue * 12 / 10000000).toFixed(2)}Cr`} change="run-rate" icon={<DollarSign />} />
          <KPICard tone="cyan" title="Revenue (Won Pipeline)" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change="won leads" icon={<TrendingUp />} />
        </div>

        <div className="soc-kicker mb-2">// Sales</div>
        <div className="soc-kpis mb-6">
          <KPICard tone="cyan" title="Total Leads" value={totalLeads.toString()} change={`${hotLeads} hot`} icon={<Users />} />
          <KPICard tone="amber" title="Meetings" value={meetings.toString()} change="scheduled" icon={<Calendar />} />
          <KPICard tone="purple" title="Proposals" value={proposals.toString()} change="sent" icon={<FileText />} />
          <KPICard tone="green" title="Wins / Losses" value={`${wonLeads} / ${losses}`} change={`${conversionRate}% conversion`} icon={<CheckCircle />} />
        </div>

        <div className="soc-kicker mb-2">// Operations</div>
        <div className="soc-kpis mb-6">
          <KPICard tone="cyan" title="Active Clients" value={metrics.activeClients.toString()} change="contracts" icon={<Building2 />} />
          <KPICard tone="green" title="Guards Deployed" value={metrics.guardsDeployed.toString()} change="across contracts" icon={<Users />} />
          <KPICard tone="red" title="Incidents" value={metrics.incidents.toString()} change="recorded" icon={<AlertTriangle />} />
          <KPICard tone="purple" title="Attendance" value={`${attendanceAvg}%`} change="average" icon={<CheckCircle />} />
        </div>

        <div className="soc-kicker mb-2">// Marketing</div>
        <div className="soc-kpis mb-6">
          <KPICard tone="cyan" title="Website Leads" value={String(metrics.websiteLeads)} change="tracked (mock)" icon={<Globe />} />
          <KPICard tone="green" title="LinkedIn Followers" value={formatFollowers(metrics.linkedinFollowers)} change="+growth" icon={<LinkedinIcon />} />
          <KPICard tone="amber" title="Google Reviews" value={metrics.reviews.toString()} change={`${metrics.avgRating}★ avg`} icon={<Star />} />
          <KPICard tone="red" title="Today's Followups" value={todayFollowups.length.toString()} change="needs action" icon={<Calendar />} />
        </div>
      </>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="soc-panel">
          <h3 className="soc-card-title mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Revenue Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3a5c" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${v/100000}L`} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value) => `₹${(value as number).toLocaleString()}`} labelStyle={{ color: "#e2e8f0" }} />
              <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="soc-panel">
          <h3 className="soc-card-title mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> Sales Funnel
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={funnelData} cx="50%" cy="50%" dataKey="value" label>
                {funnelData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP} labelStyle={{ color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads Table */}
      <div className="soc-table-wrap">
        <div className="px-4 py-3 border-b border-ink-700/70 flex flex-wrap justify-between items-center gap-2">
          <h3 className="soc-card-title">Lead Register</h3>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{leads.length} records</span>
        </div>
        <div className="soc-table-scroll">
          <table className="soc-table">
            <thead>
              <tr>
                <th className="soc-th">Company</th>
                <th className="soc-th">Industry</th>
                <th className="soc-th">Contact</th>
                <th className="soc-th">Status</th>
                <th className="soc-th">Value</th>
                <th className="soc-th">Score</th>
                <th className="soc-th">Follow-up</th>
                <th className="soc-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="soc-td">
                    <div className="font-medium text-slate-200">{lead.company}</div>
                    <div className="text-xs text-slate-500 font-mono">{lead.city}</div>
                  </td>
                  <td className="soc-td text-sm">{lead.industry}</td>
                  <td className="soc-td">
                    <div className="text-sm">{lead.contactPerson}</div>
                    <div className="text-xs text-slate-500 font-mono">{lead.phone}</div>
                  </td>
                  <td className="soc-td">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-[11px] font-mono border outline-none bg-transparent ${STATUS_TONE[lead.status] || STATUS_TONE.New}`}
                    >
                      <option className="text-slate-300">New</option>
                      <option className="text-slate-300">Contacted</option>
                      <option className="text-slate-300">Meeting Scheduled</option>
                      <option className="text-slate-300">Site Audit</option>
                      <option className="text-slate-300">Proposal Sent</option>
                      <option className="text-slate-300">Negotiation</option>
                      <option className="text-slate-300">Won</option>
                      <option className="text-slate-300">Lost</option>
                    </select>
                  </td>
                  <td className="soc-td font-mono font-semibold text-slate-200">₹{(lead.potentialRevenue / 100000).toFixed(1)}L</td>
                  <td className="soc-td">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-mono border ${SCORE_TONE[lead.leadScore] || SCORE_TONE.Cold}`}>
                      {lead.leadScore}
                    </span>
                  </td>
                  <td className="soc-td">
                    <button
                      onClick={() => handleAddFollowup(lead)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline flex items-center gap-1 font-mono"
                    >
                      <Calendar className="w-3 h-3" />
                      {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "Set"}
                    </button>
                  </td>
                  <td className="soc-td">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(lead)} className="text-slate-500 hover:text-cyan-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-slate-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow-up Alerts */}
      {todayFollowups.length > 0 && (
        <div className="mt-6 bg-amber-400/10 border border-amber-400/40 rounded-xl p-4">
          <h3 className="font-semibold text-amber-200 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Today's Follow-ups ({todayFollowups.length})
          </h3>
          <div className="space-y-2">
            {todayFollowups.map(lead => (
              <div key={lead.id} className="flex justify-between items-center text-sm text-slate-300">
                <span>{lead.company} — {lead.contactPerson}</span>
                <button className="soc-btn soc-btn-ghost px-3 py-1">
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Portal Access Card */}
      <div className="mt-6 bg-ink-800/60 border border-cyan-400/30 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Client Portal Access
            </h3>
            <p className="text-sm text-slate-500">Share this link with clients to access reports and invoices</p>
          </div>
          <button
            onClick={() => window.open('/client/login', '_blank')}
            className="soc-btn soc-btn-ghost"
          >
            Open Client Portal
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500 font-mono">Demo Client Login: client1@apollohospitals.com / 123456</p>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-100">{editingLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={() => { setShowLeadModal(false); setEditingLead(null); }} className="text-slate-500 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="soc-input" />
              <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="soc-select">
                <option>Hospital</option><option>Factory</option><option>IT Park</option><option>Apartment</option><option>Mall</option>
              </select>
              <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="soc-input" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="soc-input" />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="soc-input" />
              <input type="number" placeholder="Potential Revenue (₹)" value={formData.potentialRevenue} onChange={e => setFormData({...formData, potentialRevenue: e.target.value})} className="soc-input" />
              <select value={formData.painPoints} onChange={e => setFormData({...formData, painPoints: e.target.value})} className="soc-select">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="soc-select">
                <option>New</option><option>Contacted</option><option>Meeting Scheduled</option>
                <option>Site Audit</option><option>Proposal Sent</option><option>Negotiation</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={editingLead ? handleUpdateLead : handleAddLead} className="flex-1 soc-btn soc-btn-primary">
                {editingLead ? "Update" : "Add"} Lead
              </button>
              <button onClick={() => { setShowLeadModal(false); setEditingLead(null); }} className="flex-1 soc-btn soc-btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Components
function KPICard({ title, value, change, icon, tone }: { title: string; value: string; change: string; icon: React.ReactNode; tone: "cyan" | "green" | "amber" | "purple" | "red" }) {
  const tones: Record<string, { value: string; chip: string }> = {
    cyan: { value: "text-cyan-300", chip: "bg-cyan-400/15 text-cyan-300" },
    green: { value: "text-lime-300", chip: "bg-lime-400/15 text-lime-300" },
    amber: { value: "text-amber-300", chip: "bg-amber-400/15 text-amber-300" },
    purple: { value: "text-purple-300", chip: "bg-purple-400/15 text-purple-300" },
    red: { value: "text-red-300", chip: "bg-red-400/15 text-red-300" },
  };
  const t = tones[tone] || tones.cyan;
  return (
    <div className="soc-kpi hover:border-cyan-400/40 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <span className="soc-kpi-label">{title}</span>
        <div className={`soc-kpi-icon ${t.chip}`}>{icon}</div>
      </div>
      <div className={`soc-kpi-value ${t.value}`}>{value}</div>
      <div className={`soc-kpi-change ${change.startsWith("+") ? "text-lime-400" : "text-slate-500"}`}>{change}</div>
    </div>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.4H5.7V18h2.64zM7.02 8.3a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.3 18v-4.7c0-2.5-1.34-3.66-3.12-3.66a2.7 2.7 0 0 0-2.44 1.34V9.4H10.1V18h2.64v-4.66c0-1.24.6-2 1.63-2 .92 0 1.43.63 1.43 2V18h2.5z"/>
    </svg>
  );
}