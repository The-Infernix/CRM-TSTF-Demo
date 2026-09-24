"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, Calendar, DollarSign, FileText, AlertTriangle,
  CheckCircle, Clock, Download, Eye, LogOut,
  Users, Building2, Phone, Mail, MapPin
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface Contract {
  id: string;
  companyName: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  guardCount: number;
  status: string;
}

interface Incident {
  id: string;
  date: string;
  type: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  resolved: boolean;
}

interface Invoice {
  id: string;
  month: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const name = localStorage.getItem("clientName");
    const id = localStorage.getItem("clientId");
    
    if (!name || !id) {
      router.push("/client/login");
      return;
    }
    
    setClientName(name);
    setClientId(id);
    loadClientData(id, name);
  }, []);

  const loadClientData = (clientId: string, clientName: string) => {
    // Load contract based on client name
    const contracts = JSON.parse(localStorage.getItem("tsfs_contracts") || "[]");
    const clientContract = contracts.find((c: any) => c.companyName === clientName);
    
    if (clientContract) {
      setContract(clientContract);
    } else {
      // Create a default contract for demo
      const defaultContract: Contract = {
        id: "demo_" + clientId,
        companyName: clientName,
        startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 270 * 86400000).toISOString(),
        monthlyValue: 250000,
        guardCount: 12,
        status: "Active"
      };
      setContract(defaultContract);
    }

    // Load or create sample incidents
    const savedIncidents = localStorage.getItem(`tsfs_incidents_${clientId}`);
    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    } else {
      const sampleIncidents: Incident[] = [
        {
          id: "1",
          date: new Date(Date.now() - 15 * 86400000).toISOString(),
          type: "Unauthorized Access Attempt",
          description: "Unknown person attempted to enter restricted area at 2:30 AM. Guard prevented access.",
          severity: "Medium",
          resolved: true
        },
        {
          id: "2",
          date: new Date(Date.now() - 5 * 86400000).toISOString(),
          type: "Lost & Found",
          description: "Employee wallet found at entrance and returned.",
          severity: "Low",
          resolved: true
        }
      ];
      setIncidents(sampleIncidents);
      localStorage.setItem(`tsfs_incidents_${clientId}`, JSON.stringify(sampleIncidents));
    }

    // Load or create sample invoices
    const savedInvoices = localStorage.getItem(`tsfs_invoices_${clientId}`);
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      const monthlyAmount = clientContract?.monthlyValue || 250000;
      const sampleInvoices: Invoice[] = [
        {
          id: "INV-001",
          month: "January 2024",
          amount: monthlyAmount,
          status: "Paid",
          dueDate: new Date(Date.now() - 45 * 86400000).toISOString()
        },
        {
          id: "INV-002",
          month: "February 2024",
          amount: monthlyAmount,
          status: "Paid",
          dueDate: new Date(Date.now() - 15 * 86400000).toISOString()
        },
        {
          id: "INV-003",
          month: "March 2024",
          amount: monthlyAmount,
          status: "Pending",
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString()
        }
      ];
      setInvoices(sampleInvoices);
      localStorage.setItem(`tsfs_invoices_${clientId}`, JSON.stringify(sampleInvoices));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");
    router.push("/client/login");
  };

  const attendanceData = [
    { week: "Week 1", attendance: 96 },
    { week: "Week 2", attendance: 98 },
    { week: "Week 3", attendance: 94 },
    { week: "Week 4", attendance: 100 }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "High": return "soc-badge-red";
      case "Medium": return "soc-badge-amber";
      default: return "soc-badge-green";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "soc-badge-green";
      case "Pending": return "soc-badge-amber";
      default: return "soc-badge-red";
    }
  };

  const totalGuards = contract?.guardCount || 0;
  const attendanceRate = 97; // Demo average

  return (
    <div className="min-h-screen soc-bg">
      {/* Client Header */}
      <div className="bg-ink-900/80 backdrop-blur border-b border-ink-700/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-400/15 border border-cyan-400/30 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TSFS Client Portal</h1>
                <p className="text-sm text-slate-500">Welcome, {clientName}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="soc-btn soc-btn-ghost px-3 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-ink-700/70 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="soc-tab-strip">
            {["overview", "attendance", "incidents", "invoices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`soc-tab capitalize ${
                  activeTab === tab 
                    ? "soc-tab-active" 
                    : "soc-tab-idle"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="soc-wrap">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="soc-kpis">
              <div className="soc-kpi">
                <div className="flex items-start justify-between gap-2">
                  <span className="soc-kpi-label">Guards Deployed</span>
                  <div className="soc-kpi-icon bg-cyan-400/15 text-cyan-300">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="soc-kpi-value">{totalGuards}</div>
              </div>

              <div className="soc-kpi">
                <div className="flex items-start justify-between gap-2">
                  <span className="soc-kpi-label">Attendance Rate</span>
                  <div className="soc-kpi-icon bg-lime-400/15 text-lime-300">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="soc-kpi-value">{attendanceRate}%</div>
              </div>

              <div className="soc-kpi">
                <div className="flex items-start justify-between gap-2">
                  <span className="soc-kpi-label">Incidents (30 days)</span>
                  <div className="soc-kpi-icon bg-amber-400/15 text-amber-300">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="soc-kpi-value">{incidents.length}</div>
              </div>

              <div className="soc-kpi">
                <div className="flex items-start justify-between gap-2">
                  <span className="soc-kpi-label">Outstanding Amount</span>
                  <div className="soc-kpi-icon bg-red-400/15 text-red-300">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="soc-kpi-value" style={{ color: "#f87171" }}>
                  ₹{invoices.filter(i => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Contract Info */}
            {contract && (
              <div className="soc-panel">
                <h3 className="soc-kicker mb-3">// Active Contract</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Start Date</p>
                    <p className="font-semibold text-slate-200">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">End Date</p>
                    <p className="font-semibold text-slate-200">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly Investment</p>
                    <p className="font-semibold text-slate-200">₹{contract.monthlyValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Security Personnel</p>
                    <p className="font-semibold text-slate-200">{contract.guardCount} Guards</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Chart */}
            <div className="soc-panel">
              <h3 className="soc-card-title mb-4">Guard Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={attendanceData}>
                  <CartesianGrid className="soc-chart-grid" strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke="#47587f" />
                  <YAxis domain={[80, 100]} stroke="#47587f" />
                  <Tooltip contentStyle={{ background: '#0a0e18', border: '1px solid #2c3a5c', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="attendance" stroke="#22d3ee" strokeWidth={2} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Incidents */}
            <div className="soc-panel overflow-hidden" style={{ padding: 0 }}>
              <div className="px-5 py-4 border-b border-ink-700/60">
                <h3 className="soc-card-title">Recent Incidents</h3>
              </div>
              <div className="divide-y divide-ink-700/60">
                {incidents.slice(0, 3).map(incident => (
                  <div key={incident.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-200">{incident.type}</p>
                        <p className="text-sm text-slate-400 mt-1">{incident.description}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">{new Date(incident.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`soc-badge ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Weekly Attendance Summary</h3>
            <div className="space-y-4">
              {attendanceData.map((week, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{week.week}</span>
                    <span className="text-slate-400 font-mono">{week.attendance}%</span>
                  </div>
                  <div className="w-full bg-ink-700 rounded-full h-2">
                    <div className="bg-lime-500 rounded-full h-2" style={{ width: `${week.attendance}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
              <p className="text-sm text-cyan-300 font-mono">Target attendance: 98% | Current average: 97%</p>
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === "incidents" && (
          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="soc-panel">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-200">{incident.type}</h3>
                    <p className="text-xs text-slate-500 font-mono">{new Date(incident.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`soc-badge ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    {incident.resolved && (
                      <span className="soc-badge soc-badge-green">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{incident.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="soc-table-wrap">
            <div className="soc-table-scroll">
            <table className="soc-table">
              <thead>
                <tr>
                  <th className="soc-th">Invoice #</th>
                  <th className="soc-th">Month</th>
                  <th className="soc-th">Amount</th>
                  <th className="soc-th">Due Date</th>
                  <th className="soc-th">Status</th>
                  <th className="soc-th"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="soc-td font-medium text-slate-200">{invoice.id}</td>
                    <td className="soc-td">{invoice.month}</td>
                    <td className="soc-td">₹{invoice.amount.toLocaleString()}</td>
                    <td className="soc-td font-mono">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="soc-td">
                      <span className={`soc-badge ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                     </td>
                    <td className="soc-td">
                      <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                     </td>
                   </tr>
                ))}
              </tbody>
             </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}