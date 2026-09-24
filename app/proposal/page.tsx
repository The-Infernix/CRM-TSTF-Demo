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
  status: string;
  potentialRevenue: number;
  leadScore: string;
  painPoints: string;
  createdAt: string;
  nextFollowUp: string;
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
            .demo-note { color: #9ca3af; margin-top: 8px; }
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
            <thead>
              <tr><th>Description</th><th>Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Monthly Security Charges (${proposal.guardCount} guards)</td><td>₹${proposal.monthlyPrice.toLocaleString()}</td></tr>
              <tr><td>GST (18%)</td><td>₹${Math.round(proposal.monthlyPrice * 0.18).toLocaleString()}</td></tr>
              <tr style="font-weight: bold;"><td>Total Monthly Invoice</td><td>₹${Math.round(proposal.monthlyPrice * 1.18).toLocaleString()}</td></tr>
            </tbody>
          </table>
          
          <p class="total">Contract Value: ₹${Math.round(proposal.monthlyPrice * proposal.contractDuration * 1.18).toLocaleString()} (including GST)</p>
          
          <h2>About TSFS Private Limited</h2>
          <p>TSFS Private Limited is a full-scope Security Operations & Facility Management company headquartered in Visakhapatnam. We deliver manned guarding, supervisor-led teams, and integrated security reporting — not just guard placement. Every deployment is backed by training, supervision and a single accountable point of contact for the client.</p>

          <h2>Deployment Plan</h2>
          <table>
            <thead><tr><th>Phase</th><th>Timeline</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>Kick-off</td><td>Day 1</td><td>Site familiarization, access point mapping, handover from incumbent team</td></tr>
              <tr><td>Mobilization</td><td>Days 1-3</td><td>Guard deployment, uniform/kit issue, shift roster finalization</td></tr>
              <tr><td>Supervision</td><td>Week 1</td><td>Supervisor on site, SOPs and reporting templates activated</td></tr>
              <tr><td>Steady State</td><td>Week 2+</td><td>Weekly client review, incident register live, monthly security report</td></tr>
            </tbody>
          </table>

          <h2>Reporting Plan</h2>
          <ul>
            <li><b>Daily:</b> Shift-wise written reports — movements, incidents, attendance, anomalies.</li>
            <li><b>Weekly:</b> Supervisor summary + open-pending items for your nominated POC.</li>
            <li><b>Monthly:</b> Consolidated security report — incidents, access stats, recommendations.</li>
            <li><b>Incident:</b> Immediate notification of any security incident via phone + written report within 24 hours.</li>
          </ul>

          <h2>Escalation Matrix</h2>
          <table>
            <thead><tr><th>Severity</th><th>Examples</th><th>Response</th><th>Escalated To</th><th>Time</th></tr></thead>
            <tbody>
              <tr><td>Minor</td><td>Gate dispute, visitor issue, access discrepancy</td><td>On-duty guard resolves / logs</td><td>Supervisor &rarr; Site In-charge</td><td>&le; 1 hour</td></tr>
              <tr><td>Moderate</td><td>Theft, trespass, attendance gap, equipment loss</td><td>Secure the scene, preserve evidence</td><td>Operations Manager + Client POC</td><td>&le; 30 mins</td></tr>
              <tr><td>Major</td><td>Security breach, fire, medical emergency, armed threat</td><td>Emergency response + authorities as required</td><td>Ops Manager + Client + Police/Fire/Ambulance; CEO informed</td><td>Immediate</td></tr>
            </tbody>
          </table>

          <h2>Terms & Conditions</h2>
          <ul>
            <li>24/7 guard deployment with supervisor cover</li>
            <li>Guards are trained, uniformed and background-verified</li>
            <li>Weekly reporting and incident tracking included</li>
            <li>Relief guards provided for leave and absenteeism</li>
            <li>Monthly billing with agreed payment terms</li>
            <li>30-day notice period for termination</li>
          </ul>
          
          <div class="footer">
            <p>TSFS Private Limited | Visakhapatnam | Contact: +91 90522 21234 | info@tsfs.in</p>
            <p>This is a system-generated proposal. For verification, contact TSFS office.</p>
            <p class="demo-note">Demo data — company details and pricing to be verified before external use.</p>
          </div>
        </body>
      </html>
    `;
    
    const win = window.open();
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  const selectedLeadData = leads.find(l => l.id === selectedLead);

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Proposal Generator</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Proposal Generator
          </h1>
          <p className="soc-sub">Create professional security service proposals</p>
        </div>
        <div className="soc-actions">
          <button onClick={() => router.push('/dashboard')} className="soc-btn soc-btn-ghost">
            <ArrowLeft className="w-5 h-5" /> Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-6">
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Client Information</h3>
            <select 
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="soc-select mb-3"
            >
              <option value="">Select a lead...</option>
              {leads && leads.filter(l => l.status === "Negotiation" || l.status === "Proposal Sent").map(lead => (
                <option key={lead.id} value={lead.id}>{lead.company} - {lead.industry}</option>
              ))}
            </select>
            
            {selectedLeadData && (
              <div className="bg-ink-800/70 border border-ink-700/60 p-4 rounded-lg space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-slate-100">Contact:</strong> {selectedLeadData.contactPerson}</p>
                <p className="text-slate-300"><strong className="text-slate-100">Phone:</strong> {selectedLeadData.phone}</p>
                <p className="text-slate-300"><strong className="text-slate-100">Email:</strong> {selectedLeadData.email}</p>
                <p className="text-slate-300"><strong className="text-slate-100">Location:</strong> {selectedLeadData.city}</p>
              </div>
            )}
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Proposal Details</h3>
            
            <div className="mb-4">
              <label className="soc-label">Number of Guards</label>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={guardCount}
                onChange={(e) => setGuardCount(Number(e.target.value))}
                className="soc-range"
              />
              <div className="text-center font-bold text-xl mt-2 text-cyan-300 font-mono">{guardCount} Guards</div>
            </div>
            
            <div className="mb-4">
              <label className="soc-label">Contract Duration (months)</label>
              <select 
                value={contractDuration}
                onChange={(e) => setContractDuration(Number(e.target.value))}
                className="soc-select"
              >
                <option value={6}>6 months</option>
                <option value={12}>12 months (Recommended)</option>
                <option value={24}>24 months (Best value)</option>
                <option value={36}>36 months</option>
              </select>
            </div>
            
            <div className="bg-ink-800/70 border border-ink-700/60 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400">Monthly Investment</p>
              <p className="text-3xl font-bold text-cyan-300 font-mono">₹{monthlyPrice.toLocaleString()}</p>
              <p className="text-xs text-slate-500">+18% GST as applicable</p>
            </div>
          </div>

          <button 
            onClick={generateProposal}
            className="soc-btn soc-btn-primary w-full"
          >
            <Save className="w-4 h-4" /> Generate Proposal
          </button>
        </div>

        {/* Recent Proposals */}
        <div className="soc-panel">
          <h3 className="soc-card-title mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Proposals
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-auto pr-1">
            {proposals.length === 0 ? (
              <p className="soc-empty py-8">No proposals yet. Generate your first proposal.</p>
            ) : (
              proposals.slice().reverse().map(proposal => (
                <div key={proposal.id} className="bg-ink-800/70 border border-ink-700/60 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-200">{proposal.companyName}</p>
                      <p className="text-sm text-slate-500">{proposal.guardCount} guards • {proposal.contractDuration} months</p>
                      <p className="text-sm font-semibold text-cyan-400">₹{proposal.monthlyPrice.toLocaleString()}/month</p>
                    </div>
                    <button 
                      onClick={() => downloadPDF(proposal)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{new Date(proposal.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Escalation Matrix preview */}
      <div className="mt-8 soc-panel">
        <h3 className="soc-card-title mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-cyan-400" /> Escalation Matrix — included in every proposal
        </h3>
        <div className="soc-table-wrap">
        <div className="soc-table-scroll">
          <table className="soc-table">
            <thead>
              <tr>
                <th className="soc-th">Severity</th>
                <th className="soc-th">Examples</th>
                <th className="soc-th">Immediate Response</th>
                <th className="soc-th">Escalated To</th>
                <th className="soc-th">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="soc-td font-medium"><span className="soc-badge soc-badge-green">Minor</span></td>
                <td className="soc-td text-slate-400">Gate dispute, visitor issue, access discrepancy</td>
                <td className="soc-td">On-duty guard resolves and logs</td>
                <td className="soc-td">Supervisor → Site In-charge</td>
                <td className="soc-td">≤ 1 hour</td>
              </tr>
              <tr>
                <td className="soc-td font-medium"><span className="soc-badge soc-badge-amber">Moderate</span></td>
                <td className="soc-td text-slate-400">Theft, trespass, attendance gap, equipment loss</td>
                <td className="soc-td">Secure scene, preserve evidence</td>
                <td className="soc-td">Operations Manager + Client POC</td>
                <td className="soc-td">≤ 30 mins</td>
              </tr>
              <tr>
                <td className="soc-td font-medium"><span className="soc-badge soc-badge-red">Major</span></td>
                <td className="soc-td text-slate-400">Security breach, fire, medical emergency, armed threat</td>
                <td className="soc-td">Emergency response + authorities as required</td>
                <td className="soc-td">Ops Manager + Client + Police/Fire/Ambulance — CEO informed</td>
                <td className="soc-td">Immediate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        <p className="text-xs text-slate-600 mt-3">Deployment plan (Day 1 → Week 2+) and daily/weekly/monthly reporting plan are embedded in the generated PDF.</p>
      </div>
    </div>
  );
}