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

  const wonLeads = leads.filter(l => l.status === "Won").length;
  const availableToContract = leads.filter(l => 
    l.status === "Negotiation" || l.status === "Proposal Sent"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-7 h-7 text-blue-600" />
                Contract Management
              </h1>
              <p className="text-sm text-gray-500">Manage active contracts and renewal alerts</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingContract(null); resetForm(); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> New Contract
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Contracts</p>
                <p className="text-2xl font-bold">{activeContracts.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold">₹{(totalMonthlyRevenue / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Annual Contract Value</p>
                <p className="text-2xl font-bold">₹{(totalAnnualRevenue / 10000000).toFixed(1)}Cr</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring in 90 Days</p>
                <p className="text-2xl font-bold text-orange-600">{expiringCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Renewal Alerts Banner */}
        {expiringContracts.length > 0 && (
          <div className="mb-6 space-y-2">
            {expiringContracts.map(contract => {
              const daysLeft = getDaysUntilExpiry(contract.endDate);
              const alertLevel = getAlertLevel(daysLeft);
              return (
                <div key={contract.id} className={`bg-${alertLevel?.color}-50 border border-${alertLevel?.color}-200 rounded-xl p-4 flex justify-between items-center`}>
                  <div className="flex items-center gap-3">
                    <Bell className={`w-5 h-5 text-${alertLevel?.color}-600`} />
                    <div>
                      <p className="font-semibold">{contract.companyName}</p>
                      <p className="text-sm">
                        Contract expires in <span className="font-bold">{daysLeft} days</span> ({new Date(contract.endDate).toLocaleDateString()})
                      </p>
                      <p className="text-xs text-gray-500">Monthly Value: ₹{contract.monthlyValue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRenew(contract)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      Renew Now
                    </button>
                    <button 
                      onClick={() => dismissAlert(contract.id)}
                      className="text-gray-500 hover:text-gray-700"
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
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">All Contracts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4">Client</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Monthly Value</th>
                  <th className="p-4">Guards</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => {
                  const daysLeft = getDaysUntilExpiry(contract.endDate);
                  const alertLevel = getAlertLevel(daysLeft);
                  return (
                    <tr key={contract.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{contract.companyName}</div>
                        <div className="text-xs text-gray-500">{contract.paymentTerms}</div>
                      </td>
                      <td className="p-4 text-sm">{new Date(contract.startDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="text-sm">{new Date(contract.endDate).toLocaleDateString()}</div>
                        {contract.status === "Expiring Soon" && (
                          <div className={`text-xs text-${alertLevel?.color}-600 font-medium`}>
                            {daysLeft} days left
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold">₹{contract.monthlyValue.toLocaleString()}</td>
                      <td className="p-4">{contract.guardCount} guards</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contract.status === "Active" ? "bg-green-100 text-green-700" :
                          contract.status === "Expiring Soon" ? "bg-yellow-100 text-yellow-700" :
                          contract.status === "Expired" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(contract)} className="text-gray-500 hover:text-blue-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(contract.id)} className="text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
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
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ready to Convert ({availableToContract} leads in negotiation)
            </h3>
            <p className="text-sm text-blue-600">
              These leads are ready to become contracts. Click "New Contract" and select them.
            </p>
          </div>
        )}

        {/* Contract Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingContract ? "Edit Contract" : "New Contract"}</h2>
                <button onClick={() => { setShowModal(false); setEditingContract(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Client</label>
                  <select 
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    disabled={!!editingContract}
                  >
                    <option value="">Select a lead...</option>
                    {leads.filter(l => l.status === "Won" || l.status === "Negotiation" || l.status === "Proposal Sent").map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.company} - {lead.industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Guards</label>
                  <input 
                    type="number" 
                    value={formData.guardCount}
                    onChange={e => setFormData({...formData, guardCount: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Contract Value (₹)</label>
                  <input 
                    type="number" 
                    value={formData.monthlyValue}
                    onChange={e => setFormData({...formData, monthlyValue: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., 187500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms</label>
                  <select 
                    value={formData.paymentTerms}
                    onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Advance Payment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Special Conditions</label>
                  <textarea 
                    value={formData.specialConditions}
                    onChange={e => setFormData({...formData, specialConditions: e.target.value})}
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="e.g., 24/7 supervisor, armed guards required..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingContract ? "Update" : "Create"} Contract
                </button>
                <button onClick={() => { setShowModal(false); setEditingContract(null); }} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}