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
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      default: return "text-green-600 bg-green-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-red-600 bg-red-50";
    }
  };

  const totalGuards = contract?.guardCount || 0;
  const attendanceRate = 97; // Demo average

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TSFS Client Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {clientName}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {["overview", "attendance", "incidents", "invoices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition capitalize ${
                  activeTab === tab 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Guards Deployed</p>
                    <p className="text-2xl font-bold">{totalGuards}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                    <p className="text-2xl font-bold">{attendanceRate}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Incidents (30 days)</p>
                    <p className="text-2xl font-bold">{incidents.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Outstanding Amount</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{invoices.filter(i => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Contract Info */}
            {contract && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-3">Active Contract</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Start Date</p>
                    <p className="font-semibold">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">End Date</p>
                    <p className="font-semibold">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Monthly Investment</p>
                    <p className="font-semibold">₹{contract.monthlyValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Security Personnel</p>
                    <p className="font-semibold">{contract.guardCount} Guards</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Guard Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Incidents */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">Recent Incidents</h3>
              </div>
              <div className="divide-y">
                {incidents.slice(0, 3).map(incident => (
                  <div key={incident.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{incident.type}</p>
                        <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(incident.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
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
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Weekly Attendance Summary</h3>
            <div className="space-y-4">
              {attendanceData.map((week, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{week.week}</span>
                    <span>{week.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 rounded-full h-2" style={{ width: `${week.attendance}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Target attendance: 98% | Current average: 97%</p>
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === "incidents" && (
          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{incident.type}</h3>
                    <p className="text-xs text-gray-500">{new Date(incident.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    {incident.resolved && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{incident.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Month</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="border-b">
                      <td className="p-4 font-medium">{invoice.id}</td>
                      <td className="p-4">{invoice.month}</td>
                      <td className="p-4">₹{invoice.amount.toLocaleString()}</td>
                      <td className="p-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                       </td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
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