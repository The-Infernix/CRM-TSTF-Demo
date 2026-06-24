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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-600" />
              Lead Intelligence
            </h1>
            <p className="text-sm text-gray-500">AI-powered lead scoring and recommendations</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{hotLeads}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pipeline Value</p>
                <p className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Potential</p>
                <p className="text-2xl font-bold">
                  {leads.length ? Math.round((hotLeads / leads.length) * 100) : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lead List with Score Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="font-semibold">All Leads</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-auto">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedLead?.id === lead.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{lead.company}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      lead.leadScore === "Hot" ? "bg-red-100 text-red-700" :
                      lead.leadScore === "Warm" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {lead.leadScore}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{lead.industry} • {lead.city}</p>
                  <p className="text-xs text-gray-400 mt-1">₹{(lead.potentialRevenue / 100000).toFixed(1)}L potential</p>
                </button>
              ))}
              {leads.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No leads yet. Add leads from dashboard.
                </div>
              )}
            </div>
          </div>

          {/* Score Details */}
          <div className="lg:col-span-2">
            {selectedLead ? (
              <div className="space-y-6">
                {/* Lead Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{selectedLead.company}</h2>
                      <p className="text-gray-500">{selectedLead.industry} • {selectedLead.city}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                      selectedLead.leadScore === "Hot" ? "bg-red-100 text-red-700" :
                      selectedLead.leadScore === "Warm" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {selectedLead.leadScore} Lead
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{selectedLead.contactPerson || "Not available"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{selectedLead.phone || "Not available"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedLead.email || "Not available"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{selectedLead.status}</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Lead Score Breakdown
                  </h3>
                  {getScoreDetails(selectedLead).details.map((detail, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{detail.label}</span>
                        <span>{detail.value}/{detail.max}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 rounded-full h-2 transition-all"
                          style={{ width: `${(detail.value / detail.max) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{detail.reason}</p>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total Score</span>
                      <span className="text-lg">{getScoreDetails(selectedLead).totalScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {getRecommendations(selectedLead).map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a lead to see intelligence data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import
import { Users } from "lucide-react";