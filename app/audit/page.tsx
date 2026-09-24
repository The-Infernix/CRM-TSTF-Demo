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

  const RISK_CARD: Record<string, string> = {
    red: "bg-red-400/15 border border-red-400/40", orange: "bg-orange-400/15 border border-orange-400/40",
    yellow: "bg-yellow-400/15 border border-yellow-400/40", green: "bg-lime-400/15 border border-lime-400/40",
  };
  const RISK_TEXT: Record<string, string> = {
    red: "text-red-400", orange: "text-orange-400", yellow: "text-yellow-400", green: "text-lime-300",
  };
  const RISK_BAR: Record<string, string> = {
    red: "bg-red-400", orange: "bg-orange-400", yellow: "bg-yellow-400", green: "bg-lime-400",
  };

  return (
    <div className="soc-wrap">
      {/* Header */}
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Security Audit</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-cyan-400" />
            Security Audit
          </h1>
          <p className="soc-sub">On-site security assessment checklist</p>
        </div>
        <div className="soc-actions">
          <button onClick={() => router.push('/dashboard')} className="soc-btn soc-btn-ghost">
            <ArrowLeft className="w-5 h-5" /> Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Audit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Select Client</h3>
            <select 
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="soc-select"
            >
              <option value="">Select a lead...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.company} - {lead.status}</option>
              ))}
            </select>
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Access Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="soc-label">Entry Points</label>
                <input type="number" value={formData.entryPoints} onChange={e => setFormData({...formData, entryPoints: Number(e.target.value)})} className="soc-input" />
              </div>
              <div>
                <label className="soc-label">Exit Points</label>
                <input type="number" value={formData.exitPoints} onChange={e => setFormData({...formData, exitPoints: Number(e.target.value)})} className="soc-input" />
              </div>
            </div>
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" /> Surveillance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="soc-label">CCTV Count</label>
                <input type="number" value={formData.cctvCount} onChange={e => setFormData({...formData, cctvCount: Number(e.target.value)})} className="soc-input" />
              </div>
              <div>
                <label className="soc-label">Blind Spots</label>
                <input type="number" value={formData.blindSpots} onChange={e => setFormData({...formData, blindSpots: Number(e.target.value)})} className="soc-input" />
              </div>
            </div>
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Visitor Management</h3>
            <select value={formData.visitorManagement} onChange={e => setFormData({...formData, visitorManagement: e.target.value})} className="soc-select">
              <option>Manual</option><option>Digital</option><option>None</option>
            </select>
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-4">Risk Areas</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-slate-300 text-sm">
                <input className="soc-check" type="checkbox" checked={formData.hasTheftIssue} onChange={e => setFormData({...formData, hasTheftIssue: e.target.checked})} />
                History of Theft
              </label>
              <label className="flex items-center gap-2 text-slate-300 text-sm">
                <input className="soc-check" type="checkbox" checked={formData.hasTrespassing} onChange={e => setFormData({...formData, hasTrespassing: e.target.checked})} />
                Trespassing Issues
              </label>
              <label className="flex items-center gap-2 text-slate-300 text-sm">
                <input className="soc-check" type="checkbox" checked={formData.hasCrowdIssues} onChange={e => setFormData({...formData, hasCrowdIssues: e.target.checked})} />
                Crowd Management Problems
              </label>
            </div>
          </div>

          <button onClick={handleSubmit} className="soc-btn soc-btn-primary w-full">
            <Save className="w-4 h-4" /> Save Audit Report
          </button>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-6">
          <div className={`${RISK_CARD[riskInfo.color] || RISK_CARD.red} rounded-xl p-6`}>
            <div className="text-center mb-4">
              <RiskIcon className={`w-12 h-12 mx-auto ${RISK_TEXT[riskInfo.color] || RISK_TEXT.red}`} />
              <h3 className="text-lg font-bold mt-2 text-slate-100">Risk Score: {riskScore}/100</h3>
              <p className={`${RISK_TEXT[riskInfo.color] || RISK_TEXT.red} font-semibold`}>Risk Level: {riskInfo.level}</p>
            </div>
            
            <div className="w-full bg-ink-700 rounded-full h-3">
              <div className={`${RISK_BAR[riskInfo.color] || RISK_BAR.red} rounded-full h-3 transition-all`} style={{ width: `${riskScore}%` }} />
            </div>
          </div>

          <div className="soc-panel">
            <h3 className="soc-card-title mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> Recommendations
            </h3>
            <div className="space-y-2">
              {getRecommendations(riskScore, formData).map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-lime-400 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Audits */}
          {audits.length > 0 && (
            <div className="soc-panel">
              <h3 className="soc-card-title mb-3">Previous Audits</h3>
              <div className="space-y-2 max-h-60 overflow-auto pr-1">
                {audits.slice().reverse().map(audit => (
                  <div key={audit.id} className="p-3 bg-ink-800/70 border border-ink-700/60 rounded text-sm">
                    <p className="font-medium text-slate-200">{audit.companyName}</p>
                    <p className="text-xs text-slate-500">{new Date(audit.date).toLocaleDateString()} • Risk: {audit.riskScore}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}