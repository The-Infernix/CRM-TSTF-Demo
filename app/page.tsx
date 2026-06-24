"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState("ceo");
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", "Demo User");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">TSFS Growth Engine</h1>
        <p className="text-center text-gray-500 mb-8">Security Operations & Facility Management</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ceo">CEO</option>
              <option value="bdm">Business Development Manager</option>
              <option value="ops">Operations Manager</option>
              <option value="marketing">Marketing Manager</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="demo@tsfs.com" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="demo@tsfs.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="demo"
            />
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Demo Mode — No authentication required
        </div>
      </div>
    </div>
  );
}