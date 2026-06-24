"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Brain, ClipboardCheck, FileText, 
  Megaphone, TrendingUp, Building2, DollarSign, Phone, 
  LogOut, Plus, Edit2, Trash2, X, CheckCircle, Clock,
  Shield, Star, Calendar, Mail, Phone as PhoneIcon, MapPin,
  Calculator
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
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

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Stats
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === "Won").length;
  const totalRevenue = leads.reduce((sum, l) => sum + (l.status === "Won" ? l.potentialRevenue : 0), 0);
  const hotLeads = leads.filter(l => l.leadScore === "Hot").length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";
  
  const todayFollowups = leads.filter(l => {
    if (!l.nextFollowUp) return false;
    const today = new Date().toDateString();
    const followupDate = new Date(l.nextFollowUp).toDateString();
    return followupDate === today;
  });

  const getStatusColor = (status: string) => {
    const colors: any = {
      "New": "bg-gray-100 text-gray-700",
      "Contacted": "bg-blue-100 text-blue-700",
      "Meeting Scheduled": "bg-yellow-100 text-yellow-700",
      "Site Audit": "bg-purple-100 text-purple-700",
      "Proposal Sent": "bg-indigo-100 text-indigo-700",
      "Negotiation": "bg-orange-100 text-orange-700",
      "Won": "bg-green-100 text-green-700",
      "Lost": "bg-red-100 text-red-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getScoreColor = (score: string) => {
    if (score === "Hot") return "text-red-600 bg-red-50 border-red-200";
    if (score === "Warm") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const funnelData = [
    { name: "Leads", value: leads.filter(l => l.status !== "Won" && l.status !== "Lost").length, color: "#3b82f6" },
    { name: "Meetings", value: leads.filter(l => l.status === "Meeting Scheduled").length, color: "#10b981" },
    { name: "Proposals", value: leads.filter(l => l.status === "Proposal Sent").length, color: "#f59e0b" },
    { name: "Won", value: wonLeads, color: "#8b5cf6" }
  ];

  const revenueData = [
    { month: "Jan", revenue: 850000 },
    { month: "Feb", revenue: 920000 },
    { month: "Mar", revenue: totalRevenue * 0.3 },
    { month: "Apr", revenue: totalRevenue * 0.5 },
    { month: "May", revenue: totalRevenue * 0.7 },
    { month: "Jun", revenue: totalRevenue }
  ];

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard" },
    { name: "CRM", icon: <Users className="w-5 h-5" />, path: "/dashboard" },
    { name: "Lead Intelligence", icon: <Brain className="w-5 h-5" />, path: "/lead-intelligence" },
    { name: "Security Audit", icon: <ClipboardCheck className="w-5 h-5" />, path: "/audit" },
    { name: "Proposal Generator", icon: <FileText className="w-5 h-5" />, path: "/proposal" },
    { name: "Pricing Engine", icon: <Calculator className="w-5 h-5" />, path: "/pricing" },
    { name: "Marketing Center", icon: <Megaphone className="w-5 h-5" />, path: "/marketing" },
    { name: "Contracts", icon: <FileText className="w-5 h-5" />, path: "/contracts" },
    { name: "Guard Deployment", icon: <Users className="w-5 h-5" />, path: "/deployment" }, // Add this
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-4 overflow-auto">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-700">
          <Shield className="w-8 h-8 text-blue-400" />
          <span className="font-bold text-lg">TSFS Growth</span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => {
                if (item.path) {
                  router.push(item.path);
                } else {
                  alert(`${item.name} - Coming soon!`);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">{userRole.toUpperCase()} • {leads.length} total leads</p>
          </div>
          <button 
            onClick={() => { setEditingLead(null); resetForm(); setShowLeadModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard title="Total Leads" value={totalLeads.toString()} change={`+${hotLeads} hot`} icon={<Users />} color="bg-blue-500" />
          <KPICard title="Won Contracts" value={wonLeads.toString()} change={`${conversionRate}% conv`} icon={<TrophyIcon />} color="bg-green-500" />
          <KPICard title="Revenue (Annual)" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change="+18%" icon={<DollarSign />} color="bg-purple-500" />
          <KPICard title="Today's Followups" value={todayFollowups.length.toString()} change="needs action" icon={<Calendar />} color="bg-orange-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">Revenue Pipeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip formatter={(value) => `₹${(value as number).toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">Sales Funnel</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={funnelData} cx="50%" cy="50%" dataKey="value" label>
                  {funnelData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Lead Management</h3>
            <span className="text-sm text-gray-400">{leads.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4">Company</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Follow-up</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-xs text-gray-400">{lead.city}</div>
                    </td>
                    <td className="p-4 text-sm">{lead.industry}</td>
                    <td className="p-4">
                      <div className="text-sm">{lead.contactPerson}</div>
                      <div className="text-xs text-gray-400">{lead.phone}</div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}
                      >
                        <option>New</option><option>Contacted</option><option>Meeting Scheduled</option>
                        <option>Site Audit</option><option>Proposal Sent</option><option>Negotiation</option>
                        <option>Won</option><option>Lost</option>
                      </select>
                    </td>
                    <td className="p-4 font-semibold">₹{(lead.potentialRevenue / 100000).toFixed(1)}L</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(lead.leadScore)}`}>
                        {lead.leadScore}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleAddFollowup(lead)}
                        className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "Set"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(lead)} className="text-gray-500 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteLead(lead.id)} className="text-gray-500 hover:text-red-600">
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
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Today's Follow-ups ({todayFollowups.length})
            </h3>
            <div className="space-y-2">
              {todayFollowups.map(lead => (
                <div key={lead.id} className="flex justify-between items-center">
                  <span>{lead.company} - {lead.contactPerson}</span>
                  <button className="text-sm bg-yellow-100 px-3 py-1 rounded hover:bg-yellow-200">Call Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Portal Access Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Client Portal Access</h3>
              <p className="text-sm text-gray-600">Share this link with your clients to access reports and invoices</p>
            </div>
            <button 
              onClick={() => window.open('/client/login', '_blank')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Open Client Portal
            </button>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500">Demo Client Login: client1@apollohospitals.com / 123456</p>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={() => { setShowLeadModal(false); setEditingLead(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-2 border rounded-lg" />
              <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full p-2 border rounded-lg">
                <option>Hospital</option><option>Factory</option><option>IT Park</option><option>Apartment</option><option>Mall</option>
              </select>
              <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Potential Revenue (₹)" value={formData.potentialRevenue} onChange={e => setFormData({...formData, potentialRevenue: e.target.value})} className="w-full p-2 border rounded-lg" />
              <select value={formData.painPoints} onChange={e => setFormData({...formData, painPoints: e.target.value})} className="w-full p-2 border rounded-lg">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded-lg">
                <option>New</option><option>Contacted</option><option>Meeting Scheduled</option>
                <option>Site Audit</option><option>Proposal Sent</option><option>Negotiation</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={editingLead ? handleUpdateLead : handleAddLead} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                {editingLead ? "Update" : "Add"} Lead
              </button>
              <button onClick={() => { setShowLeadModal(false); setEditingLead(null); }} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">
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
function KPICard({ title, value, change, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        <div className={`${color} p-2 rounded-lg text-white`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-green-600 mt-1">{change}</div>
    </div>
  );
}

function TrophyIcon() { return <Star className="w-4 h-4" />; }