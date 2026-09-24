"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, Calendar, DollarSign, Building2,
  AlertCircle, CheckCircle, Clock, Download, Plus,
  Edit2, Trash2, Bell, TrendingUp, Users, X
} from "lucide-react";

interface Contract {
  id: string;
  leadId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  guardCount: number;
  status: "Active" | "Expiring Soon" | "Expired" | "Renewed";
  paymentTerms: string;
  specialConditions: string;
  lastInvoiceDate: string;
  nextInvoiceDate: string;
}

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

export default function ContractManagementPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedLead, setSelectedLead] = useState("");
  const [alertDismissed, setAlertDismissed] = useState<{[key: string]: boolean}>({});
  
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    monthlyValue: 0,
    guardCount: 5,
    paymentTerms: "Net 15",
    specialConditions: ""
  });

  useEffect(() => {
    loadData();
    
    // Check for expiring contracts every hour
    const interval = setInterval(() => {
      loadData();
    }, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // Load contracts
    const savedContracts = localStorage.getItem("tsfs_contracts");
    if (savedContracts) {
      const parsed = JSON.parse(savedContracts);
      // Update statuses based on current date
      const updated = parsed.map((contract: Contract) => updateContractStatus(contract));
      setContracts(updated);
      localStorage.setItem("tsfs_contracts", JSON.stringify(updated));
    } else {
      // Sample contracts
      const sampleContracts: Contract[] = [
        {
          id: "1",
          leadId: "1",
          companyName: "Apollo Hospitals",
          startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          monthlyValue: 187500,
          guardCount: 10,
          status: "Active",
          paymentTerms: "Net 15",
          specialConditions: "24/7 supervisor included",
          lastInvoiceDate: new Date(Date.now() - 15 * 86400000).toISOString(),
          nextInvoiceDate: new Date(Date.now() + 15 * 86400000).toISOString()
        },
        {
          id: "2",
          leadId: "2",
          companyName: "Vizag SEZ",
          startDate: new Date(Date.now() - 300 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 45 * 86400000).toISOString(),
          monthlyValue: 375000,
          guardCount: 20,
          status: "Active",
          paymentTerms: "Net 30",
          specialConditions: "Armed guards required",
          lastInvoiceDate: new Date(Date.now() - 10 * 86400000).toISOString(),
          nextInvoiceDate: new Date(Date.now() + 20 * 86400000).toISOString()
        }
      ];
      setContracts(sampleContracts);
      localStorage.setItem("tsfs_contracts", JSON.stringify(sampleContracts));
    }
    
    // Load leads
    const savedLeads = localStorage.getItem("tsfs_leads");
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  };

  const updateContractStatus = (contract: Contract): Contract => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (contract.status === "Renewed") return contract;
    if (endDate < today) return { ...contract, status: "Expired" };
    if (daysUntilExpiry <= 90) return { ...contract, status: "Expiring Soon" };
    return { ...contract, status: "Active" };
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };

  const ALERT_CARD: Record<string, string> = {
    red: "bg-red-400/15 border border-red-400/40",
    orange: "bg-orange-400/15 border border-orange-400/40",
    yellow: "bg-yellow-400/15 border border-yellow-400/40",
  };
  const ALERT_TEXT: Record<string, string> = {
    red: "text-red-400", orange: "text-orange-400", yellow: "text-yellow-400",
  };

  const getAlertLevel = (days: number) => {
    if (days <= 30) return { color: "red", text: "Critical" };
    if (days <= 60) return { color: "orange", text: "Warning" };
    if (days <= 90) return { color: "yellow", text: "Notice" };
    return null;
  };

  const handleSubmit = () => {
    if (!selectedLead) {
      alert("Please select a client");
      return;
    }
    
    const lead = leads.find(l => l.id === selectedLead);
    if (!lead) return;
    
    const newContract: Contract = {
      id: editingContract?.id || Date.now().toString(),
      leadId: selectedLead,
      companyName: lead.company,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      monthlyValue: formData.monthlyValue,
      guardCount: formData.guardCount,
      status: "Active",
      paymentTerms: formData.paymentTerms,
      specialConditions: formData.specialConditions,
      lastInvoiceDate: new Date().toISOString(),
      nextInvoiceDate: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    
    let updatedContracts;
    if (editingContract) {
      updatedContracts = contracts.map(c => c.id === editingContract.id ? newContract : c);
    } else {
      updatedContracts = [...contracts, newContract];
    }
    
    setContracts(updatedContracts);
    localStorage.setItem("tsfs_contracts", JSON.stringify(updatedContracts));
    
    // Update lead status to "Won" if not already
    const savedLeads = localStorage.getItem("tsfs_leads");
    if (savedLeads) {
      const leadsList = JSON.parse(savedLeads);
      const updatedLeads = leadsList.map((l: Lead) => 
        l.id === selectedLead ? { ...l, status: "Won" } : l
      );
      localStorage.setItem("tsfs_leads", JSON.stringify(updatedLeads));
    }
    
    setShowModal(false);
    setEditingContract(null);
    resetForm();
    alert("Contract saved successfully!");
  };

  const handleRenew = (contract: Contract) => {
    const newEndDate = new Date(contract.endDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    
    const updatedContract = {
      ...contract,
      endDate: newEndDate.toISOString(),
      status: "Active" as const
    };
    
    const updated = contracts.map(c => c.id === contract.id ? updatedContract : c);
    setContracts(updated);
    localStorage.setItem("tsfs_contracts", JSON.stringify(updated));
    alert(`Contract renewed until ${newEndDate.toLocaleDateString()}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this contract? This action cannot be undone.")) {
      const updated = contracts.filter(c => c.id !== id);
      setContracts(updated);
      localStorage.setItem("tsfs_contracts", JSON.stringify(updated));
    }
  };

  const dismissAlert = (contractId: string) => {
    setAlertDismissed(prev => ({ ...prev, [contractId]: true }));
  };

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      monthlyValue: 0,
      guardCount: 5,
      paymentTerms: "Net 15",
      specialConditions: ""
    });
    setSelectedLead("");
  };

  const openEditModal = (contract: Contract) => {
    setEditingContract(contract);
    setSelectedLead(contract.leadId);
    setFormData({
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate.split('T')[0],
      monthlyValue: contract.monthlyValue,
      guardCount: contract.guardCount,
      paymentTerms: contract.paymentTerms,
      specialConditions: contract.specialConditions
    });
    setShowModal(true);
  };

  // Get alerts for expiring contracts (not dismissed)
  const expiringContracts = contracts.filter(c => 
    c.status === "Expiring Soon" && !alertDismissed[c.id]
  );

  const activeContracts = contracts.filter(c => c.status === "Active");
  const expiringCount = contracts.filter(c => c.status === "Expiring Soon").length;
  const totalMonthlyRevenue = contracts.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalAnnualRevenue = totalMonthlyRevenue * 12;

  // Fix: Check if leads exist before filtering
  const wonLeads = leads ? leads.filter(l => l.status === "Won").length : 0;
  const availableToContract = leads ? leads.filter(l => 
    l.status === "Negotiation" || l.status === "Proposal Sent"
  ).length : 0;

  return (
    <div className="soc-wrap">
        {/* Header */}
        <div className="soc-page-header">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => router.push('/dashboard')}
              className="soc-btn soc-btn-ghost px-3 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="soc-page-title">
              <div className="soc-kicker">// MODULE — Contract Management</div>
              <h1 className="soc-h1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Contract Management
              </h1>
              <p className="soc-sub">Manage active contracts and renewal alerts</p>
            </div>
          </div>
          <div className="soc-actions">
            <button 
              onClick={() => { setEditingContract(null); resetForm(); setShowModal(true); }}
              className="soc-btn soc-btn-primary"
            >
              <Plus className="w-4 h-4" /> New Contract
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="soc-kpis mb-6">
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Active Contracts</span>
              <div className="soc-kpi-icon bg-lime-400/15 text-lime-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{activeContracts.length}</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Monthly Recurring Revenue</span>
              <div className="soc-kpi-icon bg-cyan-400/15 text-cyan-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">₹{(totalMonthlyRevenue / 100000).toFixed(1)}L</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Annual Contract Value</span>
              <div className="soc-kpi-icon bg-purple-400/15 text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">₹{(totalAnnualRevenue / 10000000).toFixed(1)}Cr</div>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Expiring in 90 Days</span>
              <div className="soc-kpi-icon bg-amber-400/15 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value text-amber-400">{expiringCount}</div>
          </div>
        </div>

        {/* Renewal Alerts Banner */}
        {expiringContracts.length > 0 && (
          <div className="mb-6 space-y-2">
            {expiringContracts.map(contract => {
              const daysLeft = getDaysUntilExpiry(contract.endDate);
              const alertLevel = getAlertLevel(daysLeft);
              return (
                <div key={contract.id} className={`${ALERT_CARD[alertLevel?.color || "red"]} rounded-xl p-4 flex flex-wrap justify-between items-center gap-3`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Bell className={`w-5 h-5 shrink-0 ${ALERT_TEXT[alertLevel?.color || "red"]}`} />
                    <div className="min-w-0">
                      <p className="font-semibold">{contract.companyName}</p>
                      <p className="text-sm">
                        Contract expires in <span className="font-bold">{daysLeft} days</span> ({new Date(contract.endDate).toLocaleDateString()})
                      </p>
                      <p className="text-xs text-slate-500">Monthly Value: ₹{contract.monthlyValue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center shrink-0">
                    <button 
                      onClick={() => handleRenew(contract)}
                      className="soc-btn soc-btn-lime"
                    >
                      Renew Now
                    </button>
                    <button 
                      onClick={() => dismissAlert(contract.id)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contracts Table */}
        <div className="soc-table-wrap">
          <div className="p-4 border-b border-ink-700/60">
            <h2 className="soc-card-title">All Contracts</h2>
          </div>
          <div className="soc-table-scroll">
            <table className="soc-table">
              <thead>
                <tr>
                  <th className="soc-th">Client</th>
                  <th className="soc-th">Start Date</th>
                  <th className="soc-th">End Date</th>
                  <th className="soc-th">Monthly Value</th>
                  <th className="soc-th">Guards</th>
                  <th className="soc-th">Status</th>
                  <th className="soc-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => {
                  const daysLeft = getDaysUntilExpiry(contract.endDate);
                  const alertLevel = getAlertLevel(daysLeft);
                  return (
                    <tr key={contract.id}>
                      <td className="soc-td">
                        <div className="font-medium text-slate-200">{contract.companyName}</div>
                        <div className="text-xs text-slate-500">{contract.paymentTerms}</div>
                      </td>
                      <td className="soc-td text-sm">{new Date(contract.startDate).toLocaleDateString()}</td>
                      <td className="soc-td">
                        <div className="text-sm">{new Date(contract.endDate).toLocaleDateString()}</div>
                        {contract.status === "Expiring Soon" && (
                          <div className={`text-xs font-medium ${ALERT_TEXT[alertLevel?.color || "red"]}`}>
                            {daysLeft} days left
                          </div>
                        )}
                      </td>
                      <td className="soc-td font-semibold">₹{contract.monthlyValue.toLocaleString()}</td>
                      <td className="soc-td">{contract.guardCount} guards</td>
                      <td className="soc-td">
                        <span className={contract.status === "Active" ? "soc-badge soc-badge-green" :
                          contract.status === "Expiring Soon" ? "soc-badge soc-badge-amber" :
                          contract.status === "Expired" ? "soc-badge soc-badge-red" :
                          "soc-badge soc-badge-cyan"
                        }>
                          {contract.status}
                        </span>
                      </td>
                      <td className="soc-td">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(contract)} className="text-slate-500 hover:text-cyan-300">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(contract.id)} className="text-slate-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="soc-td text-center text-slate-500 py-10">
                      No contracts yet. Click "New Contract" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available to Convert Section */}
        {availableToContract > 0 && (
          <div className="mt-6 bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-4">
            <h3 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ready to Convert ({availableToContract} leads in negotiation)
            </h3>
            <p className="text-sm text-slate-400">
              These leads are ready to become contracts. Click "New Contract" and select them.
            </p>
          </div>
        )}

        {/* Contract Modal */}
        {showModal && (
          <div className="soc-modal-bg">
            <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingContract ? "Edit Contract" : "New Contract"}</h2>
                <button onClick={() => { setShowModal(false); setEditingContract(null); }} className="text-slate-500 hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="soc-label">Select Client</label>
                  <select 
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="soc-select"
                    disabled={!!editingContract}
                  >
                    <option value="">Select a lead...</option>
                    {leads && leads.filter(l => l.status === "Won" || l.status === "Negotiation" || l.status === "Proposal Sent").map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.company} - {lead.industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="soc-label">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="soc-input"
                  />
                </div>
                
                <div>
                  <label className="soc-label">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="soc-input"
                  />
                </div>
                
                <div>
                  <label className="soc-label">Number of Guards</label>
                  <input 
                    type="number" 
                    value={formData.guardCount}
                    onChange={e => setFormData({...formData, guardCount: Number(e.target.value)})}
                    className="soc-input"
                  />
                </div>
                
                <div>
                  <label className="soc-label">Monthly Contract Value (₹)</label>
                  <input 
                    type="number" 
                    value={formData.monthlyValue}
                    onChange={e => setFormData({...formData, monthlyValue: Number(e.target.value)})}
                    className="soc-input"
                    placeholder="e.g., 187500"
                  />
                </div>
                
                <div>
                  <label className="soc-label">Payment Terms</label>
                  <select 
                    value={formData.paymentTerms}
                    onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                    className="soc-select"
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Advance Payment</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="soc-label">Special Conditions</label>
                  <textarea 
                    value={formData.specialConditions}
                    onChange={e => setFormData({...formData, specialConditions: e.target.value})}
                    className="soc-input h-24"
                    placeholder="e.g., 24/7 supervisor, armed guards required..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="soc-btn soc-btn-primary flex-1">
                  {editingContract ? "Update" : "Create"} Contract
                </button>
                <button onClick={() => { setShowModal(false); setEditingContract(null); }} className="soc-btn soc-btn-ghost flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}