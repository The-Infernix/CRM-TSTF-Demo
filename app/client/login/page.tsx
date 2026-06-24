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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Client Portal</h1>
        <p className="text-center text-gray-500 mb-8">Access your security reports and invoices</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com" 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          >
            Login to Portal
          </button>
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-400 text-center">
            Email: client1@apollohospitals.com<br />
            Password: 123456
          </p>
          <hr className="my-2" />
          <p className="text-xs text-gray-400 text-center">
            Email: client2@vizagsez.com<br />
            Password: 123456
          </p>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          © TSFS Security Services - Client Portal
        </p>
      </div>
    </div>
  );
}