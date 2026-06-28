import React, { useState, useEffect } from 'react';
import { Issue, IssueStatus } from './types';
import PageHome from './components/PageHome';
import PageReport from './components/PageReport';
import PageDetails from './components/PageDetails';
import PageLogin from './components/PageLogin';
import PageMap from './components/PageMap';
import AuthorityDashboard from './components/AuthorityDashboard';

import { 
  Building, ShieldCheck, Mail, ShieldAlert, CheckCircle, 
  RefreshCw, Sparkles, MapPin, Map, HelpCircle, Landmark, LogOut, FileText 
} from 'lucide-react';

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'report' | 'details' | 'login' | 'dashboard' | 'map'>('home');
  const [userEmail, setUserEmail] = useState<string>('citizen@mycity.gov');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authority authentication states
  const [authorityEmail, setAuthorityEmail] = useState<string | null>(null);
  const [authorityDept, setAuthorityDept] = useState<string | null>(null);

  // Sync Issues list with Server Backend database
  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      const data = await response.json();
      setIssues(data);
      setError(null);
    } catch (err: any) {
      console.error('Error syncing backend directory:', err);
      setError('Could not connect to the MyCity backend database. Retrying...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // Poll updates every 15 seconds
    const interval = setInterval(fetchIssues, 15000);
    return () => clearInterval(interval);
  }, []);

  // Citizen report handler
  const handleReportIssue = async (reportData: { 
    image: string; 
    location: string; 
    description: string; 
    latitude?: number; 
    longitude?: number; 
    area?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    locationType?: string;
    aiVerificationReport?: any;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server rejected incident report.');
      }
      await fetchIssues();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Citizen upvote/confirmation handler
  const handleConfirmIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail })
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Verification action rejected.');
      }
      await fetchIssues();
    } catch (err: any) {
      alert(err.message || 'Verification upvote failed.');
    }
  };

  // Authority task progression update handler
  const handleUpdateStatus = async (
    issueId: string, 
    status: IssueStatus, 
    remarks: string, 
    repairedImage?: string
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/issues/${issueId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, repairedImage })
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to apply status updates.');
      }
      await fetchIssues();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Authority login action
  const handleLoginSuccess = (email: string, department: string) => {
    setAuthorityEmail(email);
    setAuthorityDept(department);
    setCurrentPage('dashboard');
  };

  // Authority logout action
  const handleLogout = () => {
    setAuthorityEmail(null);
    setAuthorityDept(null);
    setCurrentPage('home');
  };

  const handleSelectIssueAndOpenDetails = (issueId: string) => {
    setSelectedIssueId(issueId);
    setCurrentPage('details');
  };

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || null;

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-200 flex flex-col font-sans antialiased" id="mycity-app-root">
      
      {/* Dynamic Header Navbar */}
      <header className="border-b border-white/10 bg-[#09090B] sticky top-0 z-40 px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo Header */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-3 cursor-pointer group" 
          id="brand-logo"
        >
          <div className="w-9 h-9 bg-indigo-600 group-hover:bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 transition-all">
            M
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center space-x-1.5 font-sans">
              <span>MyCity</span>
              <span className="text-indigo-400 font-normal text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Civic Platform</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider">MUNICIPAL INTEGRITY PLATFORM</p>
          </div>
        </div>

        {/* Navigation Bar & Form controls */}
        <div className="flex flex-wrap items-center gap-4" id="primary-navigation-controls">
          
          {/* Main pages links */}
          <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold" id="top-nav-menu">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentPage === 'home' || currentPage === 'details' || currentPage === 'report' || currentPage === 'map'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Citizen
            </button>

            {authorityEmail ? (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  currentPage === 'dashboard'
                    ? 'bg-[#062F17]/40 text-emerald-400 shadow-sm border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentPage === 'login'
                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Authority Login
              </button>
            )}
          </nav>

          {/* Citizen custom email badge */}
          {currentPage !== 'dashboard' && (
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-mono text-slate-500 uppercase leading-none">Your Identity</span>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="text-[11px] text-slate-300 bg-transparent border-none focus:outline-none focus:ring-0 font-sans p-0 mt-0.5 max-w-[120px] font-semibold"
                  title="Modify identity email"
                />
              </div>
            </div>
          )}

          {/* Prominent Action Button */}
          <button
            onClick={() => setCurrentPage('report')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-95"
            id="global-report-action-btn"
          >
            + Report Issue
          </button>
        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 w-full px-4 lg:px-8 py-8" id="mycity-main-container">
        
        {/* Global Error Banner */}
        {error && (
          <div className="max-w-7xl mx-auto mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl flex items-center justify-between" id="global-error-banner">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchIssues}
              className="text-amber-400 underline font-semibold flex items-center space-x-1 hover:text-amber-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Re-sync</span>
            </button>
          </div>
        )}

        {/* Global Loading View */}
        {isLoading ? (
          <div className="max-w-md mx-auto text-center py-20 bg-[#09090B] border border-white/10 rounded-3xl" id="global-loading">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300 font-sans">Syncing City Database...</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Booting secure analytical pipeline</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {currentPage === 'home' && (
              <PageHome 
                issues={issues}
                onViewDetails={handleSelectIssueAndOpenDetails}
                onNavigateToReport={() => setCurrentPage('report')}
                onNavigateToMap={() => setCurrentPage('map')}
                onNavigateToLogin={() => setCurrentPage('login')}
                isAuthority={!!authorityEmail}
                onLogout={handleLogout}
                onConfirmIssue={handleConfirmIssue}
                userEmail={userEmail}
              />
            )}

            {currentPage === 'report' && (
              <PageReport 
                onReportIssue={handleReportIssue}
                isSubmitting={isSubmitting}
                userEmail={userEmail}
                onNavigateHome={() => setCurrentPage('home')}
              />
            )}

            {currentPage === 'details' && (
              <PageDetails 
                issue={selectedIssue}
                onNavigateBack={() => setCurrentPage('home')}
                onConfirmIssue={handleConfirmIssue}
                userEmail={userEmail}
              />
            )}

            {currentPage === 'login' && (
              <PageLogin 
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => setCurrentPage('home')}
              />
            )}

            {currentPage === 'dashboard' && authorityEmail && authorityDept && (
              <AuthorityDashboard 
                issues={issues}
                onUpdateStatus={handleUpdateStatus}
                isSubmitting={isSubmitting}
                selectedIssueId={selectedIssueId}
                setSelectedIssueId={setSelectedIssueId}
                authorityEmail={authorityEmail}
                authorityDept={authorityDept}
                onLogout={handleLogout}
                onViewDetails={handleSelectIssueAndOpenDetails}
              />
            )}

            {currentPage === 'map' && (
              <PageMap 
                issues={issues}
                onSelectIssue={handleSelectIssueAndOpenDetails}
                onNavigateHome={() => setCurrentPage('home')}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#09090B] px-4 py-8 mt-12 text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs">© 2026 MyCity. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors cursor-pointer">About</button>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
