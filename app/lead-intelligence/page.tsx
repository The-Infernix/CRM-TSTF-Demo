"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Brain, TrendingUp, Target, Award, 
  AlertCircle, CheckCircle, Clock, BarChart3,
  Building2, Phone, Mail, Calendar, Star
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

export default function LeadIntelligencePage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tsfs_leads");
    if (saved) {
      setLeads(JSON.parse(saved));
    }
  }, []);

  const getScoreDetails = (lead: Lead) => {
    let details = [];
    let totalScore = 0;

    // Industry score
    const industryScores: Record<string, number> = {
      "Hospital": 20, "Factory": 15, "IT Park": 20, "Apartment": 10, "Mall": 15
    };
    const industryScore = industryScores[lead.industry] || 10;
    totalScore += industryScore;
    details.push({ 
      label: "Industry", 
      value: industryScore, 
      max: 20,
      reason: `${lead.industry} scores ${industryScore}/20 points`
    });

    // Contact availability
    const contactScore = lead.contactPerson ? 20 : 0;
    totalScore += contactScore;
    details.push({ 
      label: "Decision Maker Contact", 
      value: contactScore, 
      max: 20,
      reason: lead.contactPerson ? "Contact available" : "No contact information"
    });

    // Pain points
    const painScores: Record<string, number> = { "High": 25, "Medium": 15, "Low": 5 };
    const painScore = painScores[lead.painPoints] || 5;
    totalScore += painScore;
    details.push({ 
      label: "Pain Points", 
      value: painScore, 
      max: 25,
      reason: `${lead.painPoints} pain level - urgent need for security`
    });

    // Budget / Revenue
    const budgetScore = lead.potentialRevenue > 500000 ? 20 : lead.potentialRevenue > 0 ? 5 : 0;
    totalScore += budgetScore;
    details.push({ 
      label: "Budget Confirmed", 
      value: budgetScore, 
      max: 20,
      reason: lead.potentialRevenue > 500000 ? "High budget confirmed" : 
              lead.potentialRevenue > 0 ? "Budget mentioned" : "Budget unknown"
    });

    return { details, totalScore };
  };

  const getRecommendations = (lead: Lead) => {
    const recommendations = [];
    
    if (lead.leadScore === "Hot") {
      recommendations.push("Schedule meeting immediately - high priority");
      recommendations.push("Prepare proposal with premium pricing");
      recommendations.push("Assign senior sales executive");
    } else if (lead.leadScore === "Warm") {
      recommendations.push("Follow up within 3 days");
      recommendations.push("Share case studies from similar industry");
      recommendations.push("Offer free security audit");
    } else {
      recommendations.push("Nurture with monthly newsletter");
      recommendations.push("Share educational content about security");
      recommendations.push("Re-evaluate in 60 days");
    }

    if (!lead.contactPerson) {
      recommendations.push("Find decision maker contact information");
    }
    
    if (lead.painPoints === "High") {
      recommendations.push("Highlight quick deployment capabilities");
    }

    return recommendations;
  };

  const hotLeads = leads.filter(l => l.leadScore === "Hot").length;
  const warmLeads = leads.filter(l => l.leadScore === "Warm").length;
  const coldLeads = leads.filter(l => l.leadScore === "Cold").length;
  const totalValue = leads.reduce((sum, l) => sum + l.potentialRevenue, 0);

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Lead Intelligence</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Lead Intelligence
          </h1>
          <p className="soc-sub">AI-powered lead scoring and recommendations</p>
        </div>
        <div className="soc-actions">
          <button
            onClick={() => router.push('/dashboard')}
            className="soc-btn soc-btn-ghost"
          >
            <ArrowLeft className="w-5 h-5" /> Dashboard
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="soc-kpis mb-6">
        <div className="soc-kpi">
          <div className="flex justify-between items-start gap-2">
            <span className="soc-kpi-label">Total Leads</span>
            <div className="soc-kpi-icon bg-cyan-400/15 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="soc-kpi-value">{leads.length}</div>
        </div>

        <div className="soc-kpi">
          <div className="flex justify-between items-start gap-2">
            <span className="soc-kpi-label">Hot Leads</span>
            <div className="soc-kpi-icon bg-red-400/15 text-red-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="soc-kpi-value text-red-400">{hotLeads}</div>
        </div>

        <div className="soc-kpi">
          <div className="flex justify-between items-start gap-2">
            <span className="soc-kpi-label">Pipeline Value</span>
            <div className="soc-kpi-icon bg-lime-400/15 text-lime-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="soc-kpi-value text-lime-400">₹{(totalValue / 100000).toFixed(1)}L</div>
        </div>

        <div className="soc-kpi">
          <div className="flex justify-between items-start gap-2">
            <span className="soc-kpi-label">Conversion Potential</span>
            <div className="soc-kpi-icon bg-purple-400/15 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="soc-kpi-value">
            {leads.length ? Math.round((hotLeads / leads.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Lead List with Score Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead List */}
        <div className="lg:col-span-1">
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60">
              <h3 className="soc-card-title">All Leads</h3>
            </div>
            <div className="divide-y divide-ink-700/50 max-h-[600px] overflow-auto pr-1">
            {leads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full p-4 text-left transition ${
                  selectedLead?.id === lead.id ? 'bg-cyan-400/10' : 'hover:bg-ink-800/60'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-slate-200">{lead.company}</span>
                  <span className={`soc-badge ${
                    lead.leadScore === "Hot" ? "soc-badge-red" :
                    lead.leadScore === "Warm" ? "soc-badge-amber" :
                    "soc-badge-cyan"
                  }`}>
                    {lead.leadScore}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{lead.industry} • {lead.city}</p>
                <p className="text-xs text-slate-600 mt-1">₹{(lead.potentialRevenue / 100000).toFixed(1)}L potential</p>
              </button>
            ))}
            {leads.length === 0 && (
              <div className="soc-empty">
                No leads yet. Add leads from dashboard.
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Score Details */}
        <div className="lg:col-span-2">
          {selectedLead ? (
            <div className="space-y-6">
              {/* Lead Info */}
              <div className="soc-panel">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">{selectedLead.company}</h2>
                    <p className="text-slate-500 text-sm">{selectedLead.industry} • {selectedLead.city}</p>
                  </div>
                  <div className={`soc-badge ${
                    selectedLead.leadScore === "Hot" ? "soc-badge-red" :
                    selectedLead.leadScore === "Warm" ? "soc-badge-amber" :
                    "soc-badge-cyan"
                  }`}>
                    {selectedLead.leadScore} Lead
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Contact</p>
                    <p className="font-medium text-slate-200">{selectedLead.contactPerson || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="font-medium text-slate-200">{selectedLead.phone || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="font-medium text-slate-200">{selectedLead.email || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="font-medium text-slate-200">{selectedLead.status}</p>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="soc-panel">
                <h3 className="soc-card-title mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Lead Score Breakdown
                </h3>
                {getScoreDetails(selectedLead).details.map((detail, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{detail.label}</span>
                      <span className="text-slate-400">{detail.value}/{detail.max}</span>
                    </div>
                    <div className="w-full bg-ink-700 rounded-full h-2">
                      <div 
                        className="bg-cyan-400 rounded-full h-2 transition-all"
                        style={{ width: `${(detail.value / detail.max) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{detail.reason}</p>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-ink-700/60">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-300">Total Score</span>
                    <span className="text-lg text-cyan-300 font-mono">{getScoreDetails(selectedLead).totalScore}/100</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="soc-panel">
                <h3 className="soc-card-title mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {getRecommendations(selectedLead).map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-lime-400 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="soc-panel soc-empty p-12">
              <Brain className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>Select a lead to see intelligence data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing import
import { Users } from "lucide-react";