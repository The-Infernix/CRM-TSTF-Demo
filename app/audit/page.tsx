"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ClipboardCheck, CheckCircle, XCircle, 
  AlertTriangle, Camera, DoorOpen, Users, Shield,
  TrendingUp, Save, Download, Eye
} from "lucide-react";

interface Audit {
  id: string;
  leadId: string;
  companyName: string;
  date: string;
  entryPoints: number;
  exitPoints: number;
  cctvCount: number;
  blindSpots: number;
  visitorManagement: string;
  hasTheftIssue: boolean;
  hasTrespassing: boolean;
  hasCrowdIssues: boolean;
  riskScore: number;
  recommendations: string[];
}

export default function SecurityAuditPage() {
  const router = useRouter();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [formData, setFormData] = useState({
    entryPoints: 0,
    exitPoints: 0,
    cctvCount: 0,
    blindSpots: 0,
    visitorManagement: "Manual",
    hasTheftIssue: false,
    hasTrespassing: false,
    hasCrowdIssues: false
  });

  useEffect(() => {
    const savedAudits = localStorage.getItem("tsfs_audits");
    if (savedAudits) setAudits(JSON.parse(savedAudits));
    
    const savedLeads = localStorage.getItem("tsfs_leads");
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, []);

  const calculateRiskScore = () => {
    let score = 0;
    if (formData.cctvCount < 5) score += 20;
    if (formData.blindSpots > 3) score += 25;
    if (formData.visitorManagement === "None") score += 20;
    if (formData.visitorManagement === "Manual") score += 10;
    if (formData.hasTheftIssue) score += 15;
    if (formData.hasTrespassing) score += 10;
    if (formData.hasCrowdIssues) score += 10;
    return Math.min(score, 100);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "Critical", color: "red", icon: AlertTriangle };
    if (score >= 40) return { level: "High", color: "orange", icon: AlertTriangle };
    if (score >= 20) return { level: "Medium", color: "yellow", icon: Shield };
    return { level: "Low", color: "green", icon: CheckCircle };
  };

  const getRecommendations = (score: number, data: typeof formData) => {
    const recs = [];
    if (data.cctvCount < 5) recs.push("Install additional CCTV cameras at key locations");
    if (data.blindSpots > 3) recs.push("Conduct blind spot analysis and add mirrors/cameras");
    if (data.visitorManagement !== "Digital") recs.push("Implement digital visitor management system");
    if (data.hasTheftIssue) recs.push("Deploy security guards at high-risk areas");
    if (data.hasTrespassing) recs.push("Install perimeter fencing and access control");
    if (data.hasCrowdIssues) recs.push("Train guards in crowd management");
    if (recs.length === 0) recs.push("Maintain current security posture");
    return recs;
  };

  const handleSubmit = () => {
    if (!selectedLead) {
      alert("Please select a lead");
      return;
    }
    
    const lead = leads.find(l => l.id === selectedLead);
    const riskScore = calculateRiskScore();
    const recommendations = getRecommendations(riskScore, formData);
    
    const newAudit: Audit = {
      id: Date.now().toString(),
      leadId: selectedLead,
      companyName: lead?.company || "Unknown",
      date: new Date().toISOString(),
      ...formData,
      riskScore,
      recommendations
    };
    
    const updated = [...audits, newAudit];
    setAudits(updated);
    localStorage.setItem("tsfs_audits", JSON.stringify(updated));
    alert("Audit saved successfully!");
  };

  const riskScore = calculateRiskScore();
  const riskInfo = getRiskLevel(riskScore);
  const RiskIcon = riskInfo.icon;

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
              <ClipboardCheck className="w-7 h-7 text-blue-600" />
              Security Audit
            </h1>
            <p className="text-sm text-gray-500">On-site security assessment checklist</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Select Client</h2>
              <select 
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select a lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.company} - {lead.status}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Access Control</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Entry Points</label>
                  <input type="number" value={formData.entryPoints} onChange={e => setFormData({...formData, entryPoints: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Exit Points</label>
                  <input type="number" value={formData.exitPoints} onChange={e => setFormData({...formData, exitPoints: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Surveillance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">CCTV Count</label>
                  <input type="number" value={formData.cctvCount} onChange={e => setFormData({...formData, cctvCount: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blind Spots</label>
                  <input type="number" value={formData.blindSpots} onChange={e => setFormData({...formData, blindSpots: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Visitor Management</h2>
              <select value={formData.visitorManagement} onChange={e => setFormData({...formData, visitorManagement: e.target.value})} className="w-full p-2 border rounded-lg">
                <option>Manual</option><option>Digital</option><option>None</option>
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold mb-4">Risk Areas</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.hasTheftIssue} onChange={e => setFormData({...formData, hasTheftIssue: e.target.checked})} />
                  History of Theft
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.hasTrespassing} onChange={e => setFormData({...formData, hasTrespassing: e.target.checked})} />
                  Trespassing Issues
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.hasCrowdIssues} onChange={e => setFormData({...formData, hasCrowdIssues: e.target.checked})} />
                  Crowd Management Problems
                </label>
              </div>
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Audit Report
            </button>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-6">
            <div className={`bg-${riskInfo.color}-50 border border-${riskInfo.color}-200 rounded-xl p-6`}>
              <div className="text-center mb-4">
                <RiskIcon className={`w-12 h-12 mx-auto text-${riskInfo.color}-600`} />
                <h3 className="text-lg font-bold mt-2">Risk Score: {riskScore}/100</h3>
                <p className={`text-${riskInfo.color}-600 font-semibold`}>Risk Level: {riskInfo.level}</p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`bg-${riskInfo.color}-600 rounded-full h-3 transition-all`} style={{ width: `${riskScore}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Recommendations
              </h3>
              <div className="space-y-2">
                {getRecommendations(riskScore, formData).map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Audits */}
            {audits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold mb-3">Previous Audits</h3>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {audits.slice().reverse().map(audit => (
                    <div key={audit.id} className="p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium">{audit.companyName}</p>
                      <p className="text-xs text-gray-500">{new Date(audit.date).toLocaleDateString()} • Risk: {audit.riskScore}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}