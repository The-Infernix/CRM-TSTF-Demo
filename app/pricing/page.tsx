"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, DollarSign, TrendingUp, Calculator, FileText, 
  Download, Save, ArrowLeft, Users, Clock, Building2,
  IndianRupee, Percent, AlertCircle, CheckCircle
} from "lucide-react";

interface PricingInputs {
  // Per guard per month
  basicSalary: number;
  pf: number;
  esi: number;
  bonus: number;
  leaveReserve: number;
  uniform: number;
  training: number;
  supervisor: number;
  admin: number;
  profitMargin: number;
  guardCount: number;
}

interface PricingOutput {
  actualCostPerGuard: number;
  actualCostTotal: number;
  suggestedPrice: number;
  margin20: number;
  margin25: number;
  margin35: number;
  monthlyRevenue: number;
  annualRevenue: number;
}

export default function PricingEnginePage() {
  const router = useRouter();
  const [inputs, setInputs] = useState<PricingInputs>({
    basicSalary: 15000,
    pf: 1800,      // 12% of basic
    esi: 975,      // 6.5% of basic (up to 21k)
    bonus: 1250,   // ~8.33% of basic
    leaveReserve: 1500,
    uniform: 300,
    training: 200,
    supervisor: 500,
    admin: 400,
    profitMargin: 25,
    guardCount: 10
  });

  const [outputs, setOutputs] = useState<PricingOutput>({
    actualCostPerGuard: 0,
    actualCostTotal: 0,
    suggestedPrice: 0,
    margin20: 0,
    margin25: 0,
    margin35: 0,
    monthlyRevenue: 0,
    annualRevenue: 0
  });

  const [savedProposals, setSavedProposals] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [proposalName, setProposalName] = useState("");

  useEffect(() => {
    calculatePricing();
    loadSavedProposals();
  }, [inputs]);

  const loadSavedProposals = () => {
    const saved = localStorage.getItem("tsfs_pricing_proposals");
    if (saved) {
      setSavedProposals(JSON.parse(saved));
    }
  };

  const calculatePricing = () => {
    // Calculate total cost per guard
    const totalCostPerGuard = 
      inputs.basicSalary +
      inputs.pf +
      inputs.esi +
      inputs.bonus +
      inputs.leaveReserve +
      inputs.uniform +
      inputs.training +
      inputs.supervisor +
      inputs.admin;

    const actualCostTotal = totalCostPerGuard * inputs.guardCount;

    // Calculate prices with different margins
    const margin20Price = totalCostPerGuard * 1.20;
    const margin25Price = totalCostPerGuard * 1.25;
    const margin35Price = totalCostPerGuard * 1.35;

    // Suggested price based on selected margin
    let suggestedPrice = totalCostPerGuard;
    if (inputs.profitMargin === 20) suggestedPrice = margin20Price;
    else if (inputs.profitMargin === 25) suggestedPrice = margin25Price;
    else if (inputs.profitMargin === 35) suggestedPrice = margin35Price;

    setOutputs({
      actualCostPerGuard: totalCostPerGuard,
      actualCostTotal: actualCostTotal,
      suggestedPrice: suggestedPrice,
      margin20: margin20Price,
      margin25: margin25Price,
      margin35: margin35Price,
      monthlyRevenue: suggestedPrice * inputs.guardCount,
      annualRevenue: suggestedPrice * inputs.guardCount * 12
    });
  };

  const updateInput = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const saveProposal = () => {
    if (!proposalName) {
      alert("Please enter a proposal name");
      return;
    }

    const proposal = {
      id: Date.now(),
      name: proposalName,
      date: new Date().toISOString(),
      inputs: { ...inputs },
      outputs: { ...outputs },
      guardCount: inputs.guardCount
    };

    const updated = [...savedProposals, proposal];
    localStorage.setItem("tsfs_pricing_proposals", JSON.stringify(updated));
    setSavedProposals(updated);
    setShowSaveModal(false);
    setProposalName("");
    alert("Proposal saved successfully!");
  };

  const loadProposal = (proposal: any) => {
    setInputs(proposal.inputs);
    setProposalName(proposal.name);
  };

  const deleteProposal = (id: number) => {
    const updated = savedProposals.filter((p: any) => p.id !== id);
    localStorage.setItem("tsfs_pricing_proposals", JSON.stringify(updated));
    setSavedProposals(updated);
  };

  const generatePDF = () => {
    // This will trigger PDF download
    const printContent = document.getElementById('pricing-report');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Pricing Proposal - TSFS</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #1e3a8a; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f3f4f6; }
                .total { font-size: 18px; font-weight: bold; color: #16a34a; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Pricing Engine</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            Pricing Engine
          </h1>
          <p className="soc-sub">Calculate costs and margins for security contracts</p>
        </div>
        <div className="soc-actions">
          <button
            onClick={() => setShowSaveModal(true)}
            className="soc-btn soc-btn-ghost"
          >
            <Save className="w-4 h-4" />
            Save Proposal
          </button>
          <button
            onClick={generatePDF}
            className="soc-btn soc-btn-primary"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Calculator Card */}
            <div className="soc-panel">
              <h3 className="soc-card-title mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Cost Breakdown (Per Guard / Month)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Basic Salary" 
                  value={inputs.basicSalary}
                  onChange={(v: number) => updateInput('basicSalary', v)}
                  icon="💰"
                />
                <InputField 
                  label="PF (12% of basic)" 
                  value={inputs.pf}
                  onChange={(v: number) => updateInput('pf', v)}
                  icon="🏦"
                />
                <InputField 
                  label="ESI (6.5% of basic)" 
                  value={inputs.esi}
                  onChange={(v: number) => updateInput('esi', v)}
                  icon="🩺"
                />
                <InputField 
                  label="Bonus (annual ~8.33%)" 
                  value={inputs.bonus}
                  onChange={(v: number) => updateInput('bonus', v)}
                  icon="🎯"
                />
                <InputField 
                  label="Leave Reserve" 
                  value={inputs.leaveReserve}
                  onChange={(v: number) => updateInput('leaveReserve', v)}
                  icon="🌴"
                />
                <InputField 
                  label="Uniform & Gear" 
                  value={inputs.uniform}
                  onChange={(v: number) => updateInput('uniform', v)}
                  icon="👕"
                />
                <InputField 
                  label="Training" 
                  value={inputs.training}
                  onChange={(v: number) => updateInput('training', v)}
                  icon="📚"
                />
                <InputField 
                  label="Supervisor Allocation" 
                  value={inputs.supervisor}
                  onChange={(v: number) => updateInput('supervisor', v)}
                  icon="👔"
                />
                <InputField 
                  label="Admin & Overhead" 
                  value={inputs.admin}
                  onChange={(v: number) => updateInput('admin', v)}
                  icon="📊"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-ink-700/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField 
                    label="Number of Guards" 
                    value={inputs.guardCount}
                    onChange={(v: number) => updateInput('guardCount', v)}
                    icon="👥"
                  />
                  <div>
                    <label className="soc-label">
                      Profit Margin
                    </label>
                    <select
                      value={inputs.profitMargin}
                      onChange={(e) => updateInput('profitMargin', Number(e.target.value))}
                      className="soc-select"
                    >
                      <option value={20}>20% Margin</option>
                      <option value={25}>25% Margin (Recommended)</option>
                      <option value={35}>35% Margin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Proposals */}
            {savedProposals.length > 0 && (
              <div className="soc-panel">
                <h3 className="soc-card-title mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-lime-400" />
                  Saved Proposals
                </h3>
                <div className="space-y-2">
                  {savedProposals.map((proposal: any) => (
                    <div key={proposal.id} className="flex justify-between items-center p-4 bg-ink-800/70 border border-ink-700/60 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-200">{proposal.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(proposal.date).toLocaleDateString()} • {proposal.guardCount} guards
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadProposal(proposal)}
                          className="text-cyan-400 text-sm hover:text-cyan-300 hover:underline"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteProposal(proposal.id)}
                          className="text-red-400 text-sm hover:text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Outputs */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="soc-panel">
              <h3 className="soc-card-title mb-4">Pricing Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Actual Cost Per Guard</p>
                  <p className="text-2xl font-bold font-mono text-cyan-300">{formatCurrency(outputs.actualCostPerGuard)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Suggested Price ({inputs.profitMargin}% Margin)</p>
                  <p className="text-3xl font-bold font-mono text-lime-300">{formatCurrency(outputs.suggestedPrice)}</p>
                </div>
                <div className="pt-2 border-t border-ink-700/60">
                  <p className="text-xs text-slate-500">Monthly Revenue ({inputs.guardCount} guards)</p>
                  <p className="text-xl font-bold font-mono text-cyan-300">{formatCurrency(outputs.monthlyRevenue)}</p>
                  <p className="text-xs text-slate-500 mt-1">Annual Revenue</p>
                  <p className="text-lg font-semibold font-mono text-slate-200">{formatCurrency(outputs.annualRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Margin Options */}
            <div className="soc-panel">
              <h3 className="soc-card-title mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4 text-slate-500" />
                Margin Options
              </h3>
              <div className="space-y-3">
                <MarginCard 
                  label="20% Margin"
                  price={outputs.margin20}
                  isRecommended={false}
                  formatCurrency={formatCurrency}
                />
                <MarginCard 
                  label="25% Margin"
                  price={outputs.margin25}
                  isRecommended={true}
                  formatCurrency={formatCurrency}
                />
                <MarginCard 
                  label="35% Margin"
                  price={outputs.margin35}
                  isRecommended={false}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="soc-panel">
              <h3 className="soc-card-title mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => updateInput('profitMargin', 20)}
                  className="w-full text-left px-3 py-2 hover:bg-ink-800 rounded-lg text-sm text-slate-400 hover:text-slate-200"
                >
                  Apply 20% Margin
                </button>
                <button 
                  onClick={() => updateInput('profitMargin', 25)}
                  className="w-full text-left px-3 py-2 hover:bg-ink-800 rounded-lg text-sm text-slate-400 hover:text-slate-200"
                >
                  Apply 25% Margin
                </button>
                <button 
                  onClick={() => updateInput('profitMargin', 35)}
                  className="w-full text-left px-3 py-2 hover:bg-ink-800 rounded-lg text-sm text-slate-400 hover:text-slate-200"
                >
                  Apply 35% Margin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Report for PDF */}
        <div id="pricing-report" className="hidden">
          <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#1e3a8a' }}>TSFS Security Services - Pricing Proposal</h1>
            <p>Generated: {new Date().toLocaleString()}</p>
            
            <h2>Cost Breakdown (Per Guard)</h2>
            <table>
              <thead>
                <tr><th>Component</th><th>Amount (₹)</th></tr>
              </thead>
              <tbody>
                <tr><td>Basic Salary</td><td>{inputs.basicSalary}</td></tr>
                <tr><td>PF</td><td>{inputs.pf}</td></tr>
                <tr><td>ESI</td><td>{inputs.esi}</td></tr>
                <tr><td>Bonus</td><td>{inputs.bonus}</td></tr>
                <tr><td>Leave Reserve</td><td>{inputs.leaveReserve}</td></tr>
                <tr><td>Uniform</td><td>{inputs.uniform}</td></tr>
                <tr><td>Training</td><td>{inputs.training}</td></tr>
                <tr><td>Supervisor</td><td>{inputs.supervisor}</td></tr>
                <tr><td>Admin</td><td>{inputs.admin}</td></tr>
                <tr style={{ fontWeight: 'bold' }}><td>Total Cost Per Guard</td><td>{formatCurrency(outputs.actualCostPerGuard)}</td></tr>
              </tbody>
            </table>

            <h2>Pricing Options ({inputs.guardCount} Guards)</h2>
            <table>
              <thead>
                <tr><th>Margin</th><th>Price Per Guard</th><th>Monthly Total</th><th>Annual Total</th></tr>
              </thead>
              <tbody>
                <tr><td>20%</td><td>{formatCurrency(outputs.margin20)}</td><td>{formatCurrency(outputs.margin20 * inputs.guardCount)}</td><td>{formatCurrency(outputs.margin20 * inputs.guardCount * 12)}</td></tr>
                <tr style={{ backgroundColor: '#f0fdf4' }}><td>25% (Recommended)</td><td>{formatCurrency(outputs.margin25)}</td><td>{formatCurrency(outputs.margin25 * inputs.guardCount)}</td><td>{formatCurrency(outputs.margin25 * inputs.guardCount * 12)}</td></tr>
                <tr><td>35%</td><td>{formatCurrency(outputs.margin35)}</td><td>{formatCurrency(outputs.margin35 * inputs.guardCount)}</td><td>{formatCurrency(outputs.margin35 * inputs.guardCount * 12)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal max-h-[92vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4 text-slate-200">Save Pricing Proposal</h2>
            <input
              type="text"
              placeholder="Proposal name (e.g., Apollo Hospitals - 10 Guards)"
              value={proposalName}
              onChange={(e) => setProposalName(e.target.value)}
              className="soc-input mb-4"
            />
            <div className="flex gap-3">
              <button onClick={saveProposal} className="soc-btn soc-btn-primary flex-1">
                Save
              </button>
              <button onClick={() => setShowSaveModal(false)} className="soc-btn soc-btn-ghost flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function InputField({ label, value, onChange, icon }: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void; 
  icon: string;
}) {
  return (
    <div>
      <label className="soc-label">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">{icon}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full pl-8 pr-3 py-2 bg-ink-800 border border-ink-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
        />
      </div>
    </div>
  );
}

function MarginCard({ label, price, isRecommended, formatCurrency }: { 
  label: string; 
  price: number; 
  isRecommended: boolean; 
  formatCurrency: (amount: number) => string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${isRecommended ? 'border-lime-400/40 bg-lime-400/15' : 'border-ink-700/60 bg-ink-800/40'}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-slate-200 flex items-center gap-2">
            {label}
            {isRecommended && <CheckCircle className="w-4 h-4 text-lime-400" />}
          </p>
          <p className="text-xl font-bold font-mono text-cyan-300">{formatCurrency(price)}</p>
        </div>
        {isRecommended && (
          <span className="soc-badge soc-badge-green">Recommended</span>
        )}
      </div>
    </div>
  );
}