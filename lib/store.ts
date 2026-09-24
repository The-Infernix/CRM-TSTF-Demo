// Shared data layer — localStorage-backed demo store (Supabase swap-in later).

export interface Lead {
  id: string;
  company: string;
  industry: string;
  city: string;
  address?: string;
  contactPerson: string;
  designation?: string;
  phone: string;
  email: string;
  currentVendor?: string;
  contractRenewalDate?: string;
  estimatedGuardCount?: number;
  budgetConfirmed?: boolean;
  status: string;
  potentialRevenue: number;
  leadScore: string;
  painPoints: string;
  createdAt: string;
  nextFollowUp: string;
}

export interface Audit {
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

export interface Contract {
  id: string;
  leadId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  guardCount: number;
  status: string;
  paymentTerms: string;
  specialConditions: string;
}

export const LEAD_STATUSES = [
  "New", "Contacted", "Meeting Scheduled", "Site Audit",
  "Proposal Sent", "Negotiation", "Won", "Lost"
];

export const ROLES = {
  ceo: { label: "CEO" },
  bdm: { label: "Business Development Manager" },
  ops: { label: "Operations Manager" },
  marketing: { label: "Marketing Manager" },
} as const;

export type Role = keyof typeof ROLES;

// Per-blueprint role access matrix.
export const ROLE_NAV: Record<Role, string[]> = {
  ceo: ["dashboard", "crm", "lead-intelligence", "audit", "pitch-builder", "proposal", "pricing", "follow-up", "contracts", "client-portal", "deployment", "marketing", "reports", "settings"],
  bdm: ["dashboard", "crm", "lead-intelligence", "audit", "pitch-builder", "proposal", "pricing", "follow-up"],
  ops: ["dashboard", "audit", "contracts", "client-portal", "deployment", "reports"],
  marketing: ["dashboard", "marketing", "reports"],
};

export function getRole(): Role {
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  return (role as Role) || "ceo";
}

export function getJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const loadLeads = (): Lead[] => getJson<Lead[]>("tsfs_leads", []);
export const saveLeads = (leads: Lead[]) => setJson("tsfs_leads", leads);
export const loadContracts = (): Contract[] => getJson<Contract[]>("tsfs_contracts", []);
export const loadAudits = (): Audit[] => getJson<Audit[]>("tsfs_audits", []);
export const loadProposals = (): any[] => getJson<any[]>("tsfs_proposals", []);

export function seedIfEmpty() {
  if (loadLeads().length === 0) {
    const now = Date.now();
    const sample: Lead[] = [
      {
        id: "1", company: "Apollo Hospitals", industry: "Hospital", city: "Vizag",
        address: "Near RK Beach", contactPerson: "Dr. Sharma", designation: "Admin Director",
        phone: "9876543210", email: "admin@apollo.com", currentVendor: "Vijay Securities",
        contractRenewalDate: new Date(now + 60 * 86400000).toISOString(), estimatedGuardCount: 12,
        budgetConfirmed: true, status: "Meeting Scheduled", potentialRevenue: 420000,
        leadScore: "Hot", painPoints: "High", createdAt: new Date(now).toISOString(),
        nextFollowUp: new Date(now + 86400000).toISOString(),
      },
      {
        id: "2", company: "Vizag SEZ", industry: "IT Park", city: "Vizag",
        contactPerson: "Mr. Rajesh", designation: "Facility Head", phone: "9876543211",
        email: "admin@vizagsez.com", currentVendor: "SVS Security", contractRenewalDate: new Date(now + 120 * 86400000).toISOString(),
        estimatedGuardCount: 22, budgetConfirmed: true, status: "Proposal Sent", potentialRevenue: 890000,
        leadScore: "Hot", painPoints: "High", createdAt: new Date(now).toISOString(),
        nextFollowUp: new Date(now + 2 * 86400000).toISOString(),
      },
      {
        id: "3", company: "CMR Mall", industry: "Mall", city: "Vizag",
        contactPerson: "Mrs. Priya", designation: "Operations Manager", phone: "9876543212",
        email: "admin@cmrmall.com", currentVendor: "", contractRenewalDate: new Date(now + 200 * 86400000).toISOString(),
        estimatedGuardCount: 15, budgetConfirmed: false, status: "Negotiation", potentialRevenue: 310000,
        leadScore: "Warm", painPoints: "Medium", createdAt: new Date(now).toISOString(),
        nextFollowUp: new Date(now + 172800000).toISOString(),
      },
      {
        id: "4", company: "Greenfield Apartments", industry: "Apartment", city: "Kakinada",
        contactPerson: "Mr. Suresh", designation: "Secretary", phone: "9876543213",
        email: "admin@greenfield.com", currentVendor: "", contractRenewalDate: new Date(now + 400 * 86400000).toISOString(),
        estimatedGuardCount: 6, budgetConfirmed: false, status: "Contacted", potentialRevenue: 90000,
        leadScore: "Cold", painPoints: "Low", createdAt: new Date(now).toISOString(),
        nextFollowUp: new Date(now + 7 * 86400000).toISOString(),
      },
    ];
    saveLeads(sample);
  }

  if (loadContracts().length === 0) {
    const contracts: Contract[] = [
      {
        id: "c1", leadId: "1", companyName: "Apollo Hospitals",
        startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        monthlyValue: 187500, guardCount: 10, status: "Active", paymentTerms: "Net 15", specialConditions: "24/7 supervisor included",
      },
      {
        id: "c2", leadId: "2", companyName: "Vizag SEZ",
        startDate: new Date(Date.now() - 300 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 45 * 86400000).toISOString(),
        monthlyValue: 375000, guardCount: 20, status: "Active", paymentTerms: "Net 30", specialConditions: "Armed guards required",
      },
    ];
    setJson("tsfs_contracts", contracts);
  }
}