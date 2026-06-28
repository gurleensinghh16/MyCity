import React, { useState } from 'react';
import { Shield, Mail, Lock } from 'lucide-react';

interface PageLoginProps {
  onLoginSuccess: (email: string, department: string) => void;
  onNavigateHome: () => void;
}

export default function PageLogin({
  onLoginSuccess,
  onNavigateHome
}: PageLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both the department email address and password.');
      return;
    }

    // Official responder accounts routing mapping
    let detectedDept = 'Municipal Corporation';
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.includes('publicworks') || normalizedEmail.includes('pwd') || normalizedEmail.includes('road')) {
      detectedDept = 'Public Works Department (PWD)';
    } else if (normalizedEmail.includes('municipal')) {
      detectedDept = 'Municipal Corporation';
    } else if (normalizedEmail.includes('water')) {
      detectedDept = 'Water Supply Department';
    } else if (normalizedEmail.includes('electricity') || normalizedEmail.includes('power')) {
      detectedDept = 'Electricity Department';
    } else if (normalizedEmail.includes('sanitation') || normalizedEmail.includes('garbage')) {
      detectedDept = 'Sanitation Department';
    } else if (normalizedEmail.includes('traffic') || normalizedEmail.includes('police')) {
      detectedDept = 'Traffic Police';
    }

    onLoginSuccess(email, detectedDept);
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fade-in" id="page-login-root">
      
      {/* Government Portal Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Authority Access Portal</h1>
          <p className="text-xs text-slate-400 font-sans">
            Official secure gateway for municipal responders and public service agencies
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Department Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Departmental Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="department@mycity.gov"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                required
              />
            </div>
          </div>

          {/* Password Credentials */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Password</label>
              <button 
                type="button"
                onClick={() => alert("Please contact your IT administrator to reset your portal password.")}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-sans hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center space-x-2"
            id="authority-login-submit"
          >
            <span>Access Console</span>
            <span>&rarr;</span>
          </button>
        </form>

        {/* Demo Login Gateway */}
        <div className="border-t border-white/5 pt-5 space-y-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 text-left mb-2">
              Available Demo Agency Accounts
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'Municipal Corporation', email: 'municipal@mycity.gov', pass: 'municipal2026' },
                { name: 'Water Supply Department', email: 'water@mycity.gov', pass: 'municipal2026' },
                { name: 'Electricity Department', email: 'electricity@mycity.gov', pass: 'municipal2026' }
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword(demo.pass);
                    setError(null);
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-left p-2.5 rounded-xl transition-all cursor-pointer group flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors">{demo.name}</span>
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-400/5 px-1.5 py-0.5 rounded border border-indigo-400/10">Use Demo</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>ID: <strong className="text-slate-300">{demo.email}</strong></span>
                    <span>PW: <strong className="text-slate-300">{demo.pass}</strong></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Return to Citizen Registry
        </button>
      </div>

    </div>
  );
}
