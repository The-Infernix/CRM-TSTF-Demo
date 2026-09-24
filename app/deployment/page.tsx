"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Users, MapPin, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Plus, Edit2, Trash2, Search,
  Shield, Phone, Mail, UserCheck, UserX, Eye, Download,
  Filter, ChevronDown, ChevronUp, Star, Award
} from "lucide-react";

interface Guard {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  designation: "Guard" | "Senior Guard" | "Supervisor" | "Captain";
  joiningDate: string;
  status: "Active" | "On Leave" | "Suspended" | "Resigned";
  skills: string[];
  certifications: string[];
  profileImage?: string;
}

interface Deployment {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  shift: "Morning" | "Evening" | "Night" | "Rotational";
  startTime: string;
  endTime: string;
  assignedDate: string;
  status: "Active" | "Completed" | "Pending";
  attendance: {
    date: string;
    checkIn: string;
    checkOut: string;
    status: "Present" | "Absent" | "Late" | "Half Day";
    remarks?: string;
  }[];
}

interface Site {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  address: string;
  city: string;
  requiredGuards: number;
  currentGuards: number;
  shiftTimings: {
    morning: string;
    evening: string;
    night: string;
  };
  supervisorId?: string;
}

export default function GuardDeploymentPage() {
  const router = useRouter();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [activeTab, setActiveTab] = useState("deployments");
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");

  // Form states
  const [guardForm, setGuardForm] = useState({
    name: "",
    employeeId: "",
    phone: "",
    email: "",
    designation: "Guard",
    joiningDate: "",
    skills: "",
    certifications: ""
  });

  const [deploymentForm, setDeploymentForm] = useState({
    guardId: "",
    siteId: "",
    shift: "Morning",
    startTime: "06:00",
    endTime: "14:00",
    assignedDate: new Date().toISOString().split('T')[0]
  });

  const [siteForm, setSiteForm] = useState({
    name: "",
    clientId: "",
    clientName: "",
    address: "",
    city: "",
    requiredGuards: 5,
    shiftTimings: {
      morning: "06:00-14:00",
      evening: "14:00-22:00",
      night: "22:00-06:00"
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load guards
    const savedGuards = localStorage.getItem("tsfs_guards");
    if (savedGuards) {
      setGuards(JSON.parse(savedGuards));
    } else {
      const sampleGuards: Guard[] = [
        {
          id: "1",
          name: "Ramesh Kumar",
          employeeId: "TSF-001",
          phone: "9876543101",
          email: "ramesh@tsfs.com",
          designation: "Supervisor",
          joiningDate: "2022-01-15",
          status: "Active",
          skills: ["CCTV Operation", "Access Control", "First Aid"],
          certifications: ["Security Guard License", "Fire Safety"]
        },
        {
          id: "2",
          name: "Suresh Reddy",
          employeeId: "TSF-002",
          phone: "9876543102",
          email: "suresh@tsfs.com",
          designation: "Senior Guard",
          joiningDate: "2022-03-20",
          status: "Active",
          skills: ["Patrol", "Visitor Management"],
          certifications: ["Security Guard License"]
        },
        {
          id: "3",
          name: "Mahesh Babu",
          employeeId: "TSF-003",
          phone: "9876543103",
          email: "mahesh@tsfs.com",
          designation: "Guard",
          joiningDate: "2023-01-10",
          status: "Active",
          skills: ["Basic Security"],
          certifications: ["Security Guard License"]
        },
        {
          id: "4",
          name: "Venkatesh Rao",
          employeeId: "TSF-004",
          phone: "9876543104",
          email: "venkatesh@tsfs.com",
          designation: "Guard",
          joiningDate: "2023-06-15",
          status: "On Leave",
          skills: ["Basic Security"],
          certifications: ["Security Guard License"]
        }
      ];
      setGuards(sampleGuards);
      localStorage.setItem("tsfs_guards", JSON.stringify(sampleGuards));
    }

    // Load sites from contracts
    const contracts = JSON.parse(localStorage.getItem("tsfs_contracts") || "[]");
    const sampleSites: Site[] = contracts.map((contract: any, idx: number) => ({
      id: contract.id || `site_${idx}`,
      name: `${contract.companyName} - Security Post`,
      clientId: contract.leadId,
      clientName: contract.companyName,
      address: `${contract.companyName}, Vizag`,
      city: "Vizag",
      requiredGuards: contract.guardCount,
      currentGuards: Math.floor(contract.guardCount * 0.8),
      shiftTimings: {
        morning: "06:00-14:00",
        evening: "14:00-22:00",
        night: "22:00-06:00"
      }
    }));
    
    const savedSites = localStorage.getItem("tsfs_sites");
    if (savedSites) {
      setSites(JSON.parse(savedSites));
    } else if (sampleSites.length > 0) {
      setSites(sampleSites);
      localStorage.setItem("tsfs_sites", JSON.stringify(sampleSites));
    }

    // Load deployments
    const savedDeployments = localStorage.getItem("tsfs_deployments");
    if (savedDeployments) {
      setDeployments(JSON.parse(savedDeployments));
    } else {
      const sampleDeployments: Deployment[] = [];
      setDeployments(sampleDeployments);
      localStorage.setItem("tsfs_deployments", JSON.stringify(sampleDeployments));
    }
  };

  const saveGuards = (newGuards: Guard[]) => {
    setGuards(newGuards);
    localStorage.setItem("tsfs_guards", JSON.stringify(newGuards));
  };

  const saveDeployments = (newDeployments: Deployment[]) => {
    setDeployments(newDeployments);
    localStorage.setItem("tsfs_deployments", JSON.stringify(newDeployments));
  };

  const saveSites = (newSites: Site[]) => {
    setSites(newSites);
    localStorage.setItem("tsfs_sites", JSON.stringify(newSites));
  };

  const handleAddGuard = () => {
    const newGuard: Guard = {
      id: Date.now().toString(),
      name: guardForm.name,
      employeeId: guardForm.employeeId || `TSF-${Math.floor(Math.random() * 1000)}`,
      phone: guardForm.phone,
      email: guardForm.email,
      designation: guardForm.designation as any,
      joiningDate: guardForm.joiningDate,
      status: "Active",
      skills: guardForm.skills.split(",").map(s => s.trim()),
      certifications: guardForm.certifications.split(",").map(c => c.trim())
    };
    saveGuards([...guards, newGuard]);
    setShowGuardModal(false);
    resetGuardForm();
  };

  const handleAddSite = () => {
    const newSite: Site = {
      id: Date.now().toString(),
      name: siteForm.name,
      clientId: siteForm.clientId,
      clientName: siteForm.clientName,
      address: siteForm.address,
      city: siteForm.city,
      requiredGuards: siteForm.requiredGuards,
      currentGuards: 0,
      shiftTimings: siteForm.shiftTimings
    };
    saveSites([...sites, newSite]);
    setShowSiteModal(false);
    resetSiteForm();
  };

  const handleAssignGuard = () => {
    const guard = guards.find(g => g.id === deploymentForm.guardId);
    const site = sites.find(s => s.id === deploymentForm.siteId);
    
    if (!guard || !site) return;

    const newDeployment: Deployment = {
      id: Date.now().toString(),
      guardId: deploymentForm.guardId,
      guardName: guard.name,
      siteId: deploymentForm.siteId,
      siteName: site.name,
      shift: deploymentForm.shift as any,
      startTime: deploymentForm.startTime,
      endTime: deploymentForm.endTime,
      assignedDate: deploymentForm.assignedDate,
      status: "Active",
      attendance: []
    };
    
    saveDeployments([...deployments, newDeployment]);
    
    // Update site current guards count
    const updatedSites = sites.map(s => 
      s.id === deploymentForm.siteId 
        ? { ...s, currentGuards: s.currentGuards + 1 }
        : s
    );
    saveSites(updatedSites);
    
    setShowDeploymentModal(false);
    resetDeploymentForm();
  };

  const handleAttendance = (deploymentId: string, status: "Present" | "Absent" | "Late" | "Half Day") => {
    const updated = deployments.map(d => {
      if (d.id === deploymentId) {
        const todayAttendance = {
          date: selectedDate,
          checkIn: status !== "Absent" ? new Date().toLocaleTimeString() : "",
          checkOut: "",
          status,
          remarks: status === "Late" ? "Arrived late" : undefined
        };
        return {
          ...d,
          attendance: [...d.attendance, todayAttendance]
        };
      }
      return d;
    });
    saveDeployments(updated);
  };

  const resetGuardForm = () => {
    setGuardForm({
      name: "", employeeId: "", phone: "", email: "",
      designation: "Guard", joiningDate: "", skills: "", certifications: ""
    });
  };

  const resetDeploymentForm = () => {
    setDeploymentForm({
      guardId: "", siteId: "", shift: "Morning",
      startTime: "06:00", endTime: "14:00",
      assignedDate: new Date().toISOString().split('T')[0]
    });
  };

  const resetSiteForm = () => {
    setSiteForm({
      name: "", clientId: "", clientName: "", address: "", city: "",
      requiredGuards: 5,
      shiftTimings: { morning: "06:00-14:00", evening: "14:00-22:00", night: "22:00-06:00" }
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "soc-badge soc-badge-green";
      case "On Leave": return "soc-badge soc-badge-amber";
      case "Suspended": return "soc-badge soc-badge-red";
      case "Resigned": return "soc-badge soc-badge-slate";
      default: return "soc-badge soc-badge-slate";
    }
  };

  const getShiftColor = (shift: string) => {
    switch(shift) {
      case "Morning": return "soc-badge soc-badge-cyan";
      case "Evening": return "soc-badge soc-badge-amber";
      case "Night": return "soc-badge soc-badge-purple";
      default: return "soc-badge soc-badge-slate";
    }
  };

  const activeGuards = guards.filter(g => g.status === "Active").length;
  const totalDeployments = deployments.filter(d => d.status === "Active").length;
  const totalSites = sites.length;
  const vacantPositions = sites.reduce((sum, s) => sum + (s.requiredGuards - s.currentGuards), 0);

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
              <div className="soc-kicker">// MODULE — Guard Deployment</div>
              <h1 className="soc-h1 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Guard Deployment
              </h1>
              <p className="soc-sub">Manage security personnel and site assignments</p>
            </div>
          </div>
          <div className="soc-actions">
            <button 
              onClick={() => { setEditingItem(null); setShowGuardModal(true); }}
              className="soc-btn soc-btn-primary px-3 py-2 text-xs"
            >
              <Plus className="w-4 h-4" /> Add Guard
            </button>
            <button 
              onClick={() => { setEditingItem(null); setShowSiteModal(true); }}
              className="soc-btn soc-btn-lime px-3 py-2 text-xs"
            >
              <Plus className="w-4 h-4" /> Add Site
            </button>
            <button 
              onClick={() => { setShowDeploymentModal(true); }}
              className="soc-btn soc-btn-primary px-3 py-2 text-xs"
            >
              <Plus className="w-4 h-4" /> Assign Guard
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="soc-kpis mb-6">
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Total Guards</span>
              <div className="soc-kpi-icon bg-cyan-400/15 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{guards.length}</div>
            <p className="soc-kpi-change text-lime-400">{activeGuards} active</p>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Active Deployments</span>
              <div className="soc-kpi-icon bg-lime-400/15 text-lime-400">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{totalDeployments}</div>
            <p className="soc-kpi-change text-slate-500">guards on duty</p>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Active Sites</span>
              <div className="soc-kpi-icon bg-purple-400/15 text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value">{totalSites}</div>
            <p className="soc-kpi-change text-slate-500">client locations</p>
          </div>
          
          <div className="soc-kpi">
            <div className="flex justify-between items-start gap-2">
              <span className="soc-kpi-label">Vacant Positions</span>
              <div className="soc-kpi-icon bg-amber-400/15 text-amber-400">
                <UserX className="w-5 h-5" />
              </div>
            </div>
            <div className="soc-kpi-value text-amber-400">{vacantPositions}</div>
            <p className="soc-kpi-change text-slate-500">need recruitment</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="soc-tab-strip mb-6">
          {["deployments", "guards", "sites", "attendance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`soc-tab capitalize ${
                activeTab === tab 
                  ? "soc-tab-active" 
                  : "soc-tab-idle"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Deployments Tab */}
        {activeTab === "deployments" && (
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60 flex flex-wrap justify-between items-center gap-2">
              <h3 className="soc-card-title">Current Deployments</h3>
              <div className="flex flex-wrap gap-2">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="soc-input w-40"
                />
              </div>
            </div>
            <div className="divide-y divide-ink-700/60">
              {deployments.filter(d => d.status === "Active").length === 0 ? (
                <div className="soc-empty">
                  No active deployments. Click "Assign Guard" to deploy security personnel.
                </div>
              ) : (
                deployments.filter(d => d.status === "Active").map(deployment => (
                  <div key={deployment.id} className="p-4 hover:bg-ink-800/50">
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="font-semibold">{deployment.guardName}</span>
                          <span className={getShiftColor(deployment.shift)}>
                            {deployment.shift} Shift
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{deployment.siteName}</p>
                        <p className="text-xs text-slate-500">
                          {deployment.startTime} - {deployment.endTime}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleAttendance(deployment.id, "Present")}
                          className="soc-btn soc-btn-lime px-2 py-1 text-xs"
                        >
                          Mark Present
                        </button>
                        <button 
                          onClick={() => handleAttendance(deployment.id, "Absent")}
                          className="soc-btn soc-btn-danger px-2 py-1 text-xs"
                        >
                          Mark Absent
                        </button>
                      </div>
                    </div>
                    
                    {/* Today's attendance status */}
                    {deployment.attendance.filter(a => a.date === selectedDate).map((att, idx) => (
                      <div key={idx} className="mt-2 p-2 bg-ink-800 rounded-lg text-sm">
                        <span className={`font-medium ${
                          att.status === "Present" ? "text-lime-400" :
                          att.status === "Absent" ? "text-red-400" : "text-amber-400"
                        }`}>
                          {att.status}
                        </span>
                        {att.checkIn && <span className="ml-2 text-xs text-slate-500">Checked in: {att.checkIn}</span>}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Guards Tab */}
        {activeTab === "guards" && (
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60 flex flex-wrap justify-between items-center gap-2">
              <h3 className="soc-card-title">Security Personnel</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search guards..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="soc-input pl-9 w-56"
                />
              </div>
            </div>
            <div className="divide-y divide-ink-700/60">
              {guards.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(guard => (
                <div key={guard.id} className="p-4 hover:bg-ink-800/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold">{guard.name}</span>
                        <span className="text-xs text-slate-500">{guard.employeeId}</span>
                        <span className={getStatusColor(guard.status)}>
                          {guard.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {guard.designation}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined: {new Date(guard.joiningDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {guard.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {guard.email}
                        </div>
                      </div>
                      {guard.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {guard.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs bg-ink-800 text-slate-400 border border-ink-600 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="text-slate-500 hover:text-cyan-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === "sites" && (
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60">
              <h3 className="soc-card-title">Deployment Sites</h3>
            </div>
            <div className="divide-y divide-ink-700/60">
              {sites.map(site => (
                <div key={site.id} className="p-4 hover:bg-ink-800/50">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold">{site.clientName}</span>
                        <span className="text-sm text-slate-500 min-w-0">{site.name}</span>
                      </div>
                      <p className="text-sm text-slate-400">{site.address}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-lime-400">✓ {site.currentGuards} deployed</span>
                        <span className="text-amber-400">⚠ {site.requiredGuards - site.currentGuards} needed</span>
                      </div>
                      <div className="w-full bg-ink-800 border border-ink-700 rounded-full h-1.5 mt-2 max-w-xs">
                        <div 
                          className="bg-lime-400 rounded-full h-1.5"
                          style={{ width: `${(site.currentGuards / site.requiredGuards) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Required</p>
                      <p className="text-lg font-bold">{site.requiredGuards} guards</p>
                    </div>
                  </div>
                </div>
))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="soc-panel p-0">
            <div className="p-4 border-b border-ink-700/60 flex flex-wrap justify-between items-center gap-2">
              <h3 className="soc-card-title">Daily Attendance</h3>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="soc-input w-40"
              />
            </div>
            <div className="divide-y divide-ink-700/60">
              {deployments.filter(d => d.status === "Active").map(deployment => {
                const todayAttendance = deployment.attendance.find(a => a.date === selectedDate);
                return (
                  <div key={deployment.id} className="p-4 flex flex-wrap justify-between items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-medium">{deployment.guardName}</p>
                      <p className="text-sm text-slate-500">{deployment.siteName} - {deployment.shift} Shift</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {todayAttendance ? (
                        <span className={todayAttendance.status === "Present" ? "soc-badge soc-badge-green" :
                          todayAttendance.status === "Absent" ? "soc-badge soc-badge-red" :
                          "soc-badge soc-badge-amber"
                        }>
                          {todayAttendance.status}
                          {todayAttendance.checkIn && ` at ${todayAttendance.checkIn}`}
                        </span>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleAttendance(deployment.id, "Present")}
                            className="soc-btn soc-btn-lime px-3 py-1 text-sm"
                          >
                            Present
                          </button>
                          <button 
                            onClick={() => handleAttendance(deployment.id, "Absent")}
                            className="soc-btn soc-btn-danger px-3 py-1 text-sm"
                          >
                            Absent
                          </button>
                          <button 
                            onClick={() => handleAttendance(deployment.id, "Late")}
                            className="soc-btn soc-btn-ghost px-3 py-1 text-sm"
                          >
                            Late
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Add Guard Modal */}
      {showGuardModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Guard</h2>
              <button onClick={() => setShowGuardModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name" value={guardForm.name} onChange={e => setGuardForm({...guardForm, name: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Employee ID (optional)" value={guardForm.employeeId} onChange={e => setGuardForm({...guardForm, employeeId: e.target.value})} className="soc-input" />
              <input type="tel" placeholder="Phone" value={guardForm.phone} onChange={e => setGuardForm({...guardForm, phone: e.target.value})} className="soc-input" />
              <input type="email" placeholder="Email" value={guardForm.email} onChange={e => setGuardForm({...guardForm, email: e.target.value})} className="soc-input" />
              <select value={guardForm.designation} onChange={e => setGuardForm({...guardForm, designation: e.target.value as any})} className="soc-select">
                <option>Guard</option><option>Senior Guard</option><option>Supervisor</option><option>Captain</option>
              </select>
              <input type="date" placeholder="Joining Date" value={guardForm.joiningDate} onChange={e => setGuardForm({...guardForm, joiningDate: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Skills (comma separated)" value={guardForm.skills} onChange={e => setGuardForm({...guardForm, skills: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Certifications (comma separated)" value={guardForm.certifications} onChange={e => setGuardForm({...guardForm, certifications: e.target.value})} className="soc-input" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddGuard} className="soc-btn soc-btn-primary flex-1">Add Guard</button>
              <button onClick={() => setShowGuardModal(false)} className="soc-btn soc-btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Site Modal */}
      {showSiteModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Deployment Site</h2>
              <button onClick={() => setShowSiteModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Site Name" value={siteForm.name} onChange={e => setSiteForm({...siteForm, name: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Client Name" value={siteForm.clientName} onChange={e => setSiteForm({...siteForm, clientName: e.target.value})} className="soc-input" />
              <input type="text" placeholder="Address" value={siteForm.address} onChange={e => setSiteForm({...siteForm, address: e.target.value})} className="soc-input" />
              <input type="text" placeholder="City" value={siteForm.city} onChange={e => setSiteForm({...siteForm, city: e.target.value})} className="soc-input" />
              <input type="number" placeholder="Required Guards" value={siteForm.requiredGuards} onChange={e => setSiteForm({...siteForm, requiredGuards: Number(e.target.value)})} className="soc-input" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddSite} className="soc-btn soc-btn-lime flex-1">Add Site</button>
              <button onClick={() => setShowSiteModal(false)} className="soc-btn soc-btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Guard Modal */}
      {showDeploymentModal && (
        <div className="soc-modal-bg">
          <div className="soc-modal max-w-2xl max-h-[92vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Assign Guard to Site</h2>
              <button onClick={() => setShowDeploymentModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select value={deploymentForm.guardId} onChange={e => setDeploymentForm({...deploymentForm, guardId: e.target.value})} className="soc-select">
                <option value="">Select Guard</option>
                {guards.filter(g => g.status === "Active").map(g => (
                  <option key={g.id} value={g.id}>{g.name} - {g.designation}</option>
                ))}
              </select>
              <select value={deploymentForm.siteId} onChange={e => setDeploymentForm({...deploymentForm, siteId: e.target.value})} className="soc-select">
                <option value="">Select Site</option>
                {sites.filter(s => s.currentGuards < s.requiredGuards).map(s => (
                  <option key={s.id} value={s.id}>{s.clientName} ({s.currentGuards}/{s.requiredGuards} guards)</option>
                ))}
              </select>
              <select value={deploymentForm.shift} onChange={e => setDeploymentForm({...deploymentForm, shift: e.target.value as any})} className="soc-select">
                <option>Morning</option><option>Evening</option><option>Night</option><option>Rotational</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={deploymentForm.startTime} onChange={e => setDeploymentForm({...deploymentForm, startTime: e.target.value})} className="soc-input" />
                <input type="time" value={deploymentForm.endTime} onChange={e => setDeploymentForm({...deploymentForm, endTime: e.target.value})} className="soc-input" />
              </div>
              <input type="date" value={deploymentForm.assignedDate} onChange={e => setDeploymentForm({...deploymentForm, assignedDate: e.target.value})} className="soc-input" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAssignGuard} className="soc-btn soc-btn-primary flex-1">Assign Guard</button>
              <button onClick={() => setShowDeploymentModal(false)} className="soc-btn soc-btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing import
import { Building2, X } from "lucide-react";