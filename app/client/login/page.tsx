"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded demo accounts for testing
  const demoClients = [
    {
      id: "1",
      companyName: "Apollo Hospitals",
      email: "client1@apollohospitals.com",
      password: "123456",
      contractId: "contract_1"
    },
    {
      id: "2", 
      companyName: "Vizag SEZ",
      email: "client2@vizagsez.com",
      password: "123456",
      contractId: "contract_2"
    },
    {
      id: "3",
      companyName: "CMR Mall", 
      email: "client3@cmrmall.com",
      password: "123456",
      contractId: "contract_3"
    },
    {
      id: "4",
      companyName: "Greenfield Apartments",
      email: "client4@greenfield.com",
      password: "123456",
      contractId: "contract_4"
    }
  ];

  useEffect(() => {
    // Ensure demo clients are saved to localStorage
    localStorage.setItem("tsfs_clients", JSON.stringify(demoClients));
    
    // Also create sample contract data if none exists
    const existingContracts = localStorage.getItem("tsfs_contracts");
    if (!existingContracts || JSON.parse(existingContracts).length === 0) {
      const sampleContracts = [
        {
          id: "contract_1",
          leadId: "1",
          companyName: "Apollo Hospitals",
          startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 300 * 86400000).toISOString(),
          monthlyValue: 187500,
          guardCount: 10,
          status: "Active",
          paymentTerms: "Net 15",
          specialConditions: "24/7 supervisor included"
        },
        {
          id: "contract_2",
          leadId: "2",
          companyName: "Vizag SEZ",
          startDate: new Date(Date.now() - 120 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 240 * 86400000).toISOString(),
          monthlyValue: 375000,
          guardCount: 20,
          status: "Active",
          paymentTerms: "Net 30",
          specialConditions: "Armed guards required"
        }
      ];
      localStorage.setItem("tsfs_contracts", JSON.stringify(sampleContracts));
    }
  }, []);

  const handleLogin = () => {
    const client = demoClients.find(c => c.email === email && c.password === password);
    
    if (client) {
      localStorage.setItem("clientId", client.id);
      localStorage.setItem("clientName", client.companyName);
      router.push("/client/dashboard");
    } else {
      setError("Invalid email or password. Try: client1@apollohospitals.com / 123456");
    }
  };

  return (
    <div className="min-h-screen soc-bg flex items-center justify-center p-4">
      <div className="bg-ink-900 border border-ink-700 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/40">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-ink-800 border border-cyan-400/40 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="soc-kicker text-center mb-1">// RESTRICTED ACCESS</p>
          <h1 className="text-2xl font-bold text-center text-white mb-2">Client Portal</h1>
          <p className="text-center text-slate-500 mb-8">Access your security reports and invoices</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-300 text-sm font-mono">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="soc-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com" 
                className="soc-input pl-9"
              />
            </div>
          </div>
          
          <div>
            <label className="soc-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="soc-input pl-9 pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleLogin}
            className="soc-btn soc-btn-primary w-full"
          >
            Login to Portal
          </button>
        </div>
        
        <div className="mt-6 p-3 bg-ink-800 border border-ink-700 rounded-lg">
          <p className="soc-kicker text-center text-[10px] mb-2">// Demo Credentials:</p>
          <p className="text-xs text-slate-400 text-center font-mono">
            Email: client1@apollohospitals.com<br />
            Password: 123456
          </p>
          <hr className="my-2 border-ink-700" />
          <p className="text-xs text-slate-400 text-center font-mono">
            Email: client2@vizagsez.com<br />
            Password: 123456
          </p>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-500">
          © TSFS Security Services - Client Portal
        </p>
      </div>
    </div>
  );
}