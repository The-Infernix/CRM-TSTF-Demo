"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, Download, Save, Users, 
  Calendar, DollarSign, Building2, CheckCircle,
  Clock, Phone, Mail, MapPin
} from "lucide-react";

interface Lead {
  id: string;
  company: string;
  industry: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  potentialRevenue: number;
}

interface Proposal {
  id: string;
  leadId: string;
  companyName: string;
  date: string;
  guardCount: number;
  contractDuration: number;
  monthlyPrice: number;
  status: string;
}

export default function ProposalPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [guardCount, setGuardCount] = useState(5);
  const [contractDuration, setContractDuration] = useState(12);
  const [monthlyPrice, setMonthlyPrice] = useState(0);

  useEffect(() => {
    const savedLeads = localStorage.getItem("tsfs_leads");
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    
    const savedProposals = localStorage.getItem("tsfs_proposals");
    if (savedProposals) setProposals(JSON.parse(savedProposals));
  }, []);

  const calculatePrice = () => {
    // Base price per guard: ₹15,000 + 25% margin = ₹18,750
    const basePrice = 18750;
    let total = basePrice * guardCount;
    
    // Volume discount
    if (guardCount > 20) total *= 0.95;
    else if (guardCount > 10) total *= 0.98;
    
    return Math.round(total);
  };

  useEffect(() => {
    setMonthlyPrice(calculatePrice());
  }, [guardCount]);

  const generateProposal = () => {
    if (!selectedLead) {
      alert("Please select a lead");
      return;
    }
    
    const lead = leads.find(l => l.id === selectedLead);
    if (!lead) return;
    
    const newProposal: Proposal = {
      id: Date.now().toString(),
      leadId: selectedLead,
      companyName: lead.company,
      date: new Date().toISOString(),
      guardCount,
      contractDuration,
      monthlyPrice,
      status: "Draft"
    };
    
    const updated = [...proposals, newProposal];
    setProposals(updated);
    localStorage.setItem("tsfs_proposals", JSON.stringify(updated));
    alert("Proposal generated! Click Download to save as PDF");
  };

  const downloadPDF = (proposal: Proposal) => {
    const lead = leads.find(l => l.id === proposal.leadId);
    if (!lead) return;
    
    const printContent = `
      <html>
        <head>
          <title>Proposal - ${proposal.companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            .total { font-size: 18px; font-weight: bold; color: #16a34a; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>TSFS Security Services</h1>
          <h2>Security Manpower Proposal</h2>
          
          <p><strong>Prepared for:</strong> ${proposal.companyName}</p>
          <p><strong>Date:</strong> ${new Date(proposal.date).toLocaleDateString()}</p>
          <p><strong>Contact:</strong> ${lead.contactPerson} | ${lead.phone} | ${lead.email}</p>
          
          <h2>Scope of Work</h2>
          <p>TSFS will provide ${proposal.guardCount} trained security personnel for ${proposal.companyName} on a ${proposal.contractDuration}-month contract basis.</p>
          
          <h2>Pricing</h2>
          <table>
            <tr><th>Description</th><th>Amount (₹)</th></tr>
            <tr><td>Monthly Security Charges (${proposal.guardCount} guards)</td><td>₹${proposal.monthlyPrice.toLocaleString()}</td></tr>
            <tr><td>GST (18%)</td><td>₹${Math.round(proposal.monthlyPrice * 0.18).toLocaleString()}</td></tr>
            <tr style="font-weight: bold;"><td>Total Monthly Invoice</td><td>₹${Math.round(proposal.monthlyPrice * 1.18).toLocaleString()}</td></tr>
          </table>
          
          <p class="total">Contract Value: ₹${Math.round(proposal.monthlyPrice * proposal.contractDuration * 1.18).toLocaleString()} (including GST)</p>
          
          <h2>Terms & Conditions</h2>
          <ul>
            <li>24/7 guard deployment with supervisor</li>
            <li>Weekly reporting and incident tracking</li>
            <li>Uniformed and trained personnel</li>
            <li>30-day notice period for termination</li>
          </ul>
          
          <div class="footer">
            <p>TSFS Security Services | Vizag, India | Phone: +91 XXXXXXXXXX</p>
            <p>This is a system-generated proposal. For verification, contact TSFS office.</p>
          </div>
        </body>
      </html>
    `;
    
    const win = window.open();
    win?.document.write(printContent);
    win?.document.close();
    win?.print();
  };

  const selectedLeadData = leads.find(l => l.id === selectedLead);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              Proposal Generator
            </h1>
            <p className="text-sm text-gray-500">Create professional security service proposals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Client Information</h2>
              <select 
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3"
              >
                <option value="">Select a lead...</option>
                {leads.filter(l => l.status === "Negotiation" || l.status === "Proposal Sent").map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.company} - {lead.industry}</option>
                ))}
              </select>
              
              {selectedLeadData && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <p><strong>Contact:</strong> {selectedLeadData.contactPerson}</p>
                  <p><strong>Phone:</strong> {selectedLeadData.phone}</p>
                  <p><strong>Email:</strong> {selectedLeadData.email}</p>
                  <p><strong>Location:</strong> {selectedLeadData.city}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Proposal Details</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Number of Guards</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={guardCount}
                  onChange={(e) => setGuardCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-bold text-xl mt-2">{guardCount} Guards</div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Contract Duration (months)</label>
                <select 
                  value={contractDuration}
                  onChange={(e) => setContractDuration(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value={6}>6 months</option>
                  <option value={12}>12 months (Recommended)</option>
                  <option value={24}>24 months (Best value)</option>
                  <option value={36}>36 months</option>
                </select>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Monthly Investment</p>
                <p className="text-3xl font-bold text-blue-600">₹{monthlyPrice.toLocaleString()}</p>
                <p className="text-xs text-gray-500">+18% GST as applicable</p>
              </div>
            </div>

            <button 
              onClick={generateProposal}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Generate Proposal
            </button>
          </div>

          {/* Recent Proposals */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Proposals
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-auto">
              {proposals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No proposals yet. Generate your first proposal.</p>
              ) : (
                proposals.slice().reverse().map(proposal => (
                  <div key={proposal.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{proposal.companyName}</p>
                        <p className="text-sm text-gray-500">{proposal.guardCount} guards • {proposal.contractDuration} months</p>
                        <p className="text-sm font-semibold text-blue-600">₹{proposal.monthlyPrice.toLocaleString()}/month</p>
                      </div>
                      <button 
                        onClick={() => downloadPDF(proposal)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{new Date(proposal.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}