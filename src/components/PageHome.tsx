import React, { useState } from 'react';
import { Issue, IssueStatus } from '../types';
import DashboardStatsPanel from './DashboardStats';
import { MapPin, Flame, ThumbsUp, ChevronRight, Search, Sparkles, Map, Landmark, Check, RefreshCw } from 'lucide-react';

interface PageHomeProps {
  issues: Issue[];
  onViewDetails: (issueId: string) => void;
  onNavigateToReport: () => void;
  onNavigateToMap: () => void;
  onNavigateToLogin: () => void;
  isAuthority: boolean;
  onLogout: () => void;
  onConfirmIssue?: (issueId: string) => Promise<void>;
  userEmail?: string;
}

export default function PageHome({
  issues,
  onViewDetails,
  onNavigateToReport,
  onNavigateToMap,
  onNavigateToLogin,
  isAuthority,
  onLogout,
  onConfirmIssue,
  userEmail = 'citizen@mycity.gov'
}: PageHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (issueId: string) => {
    if (!onConfirmIssue) return;
    setVerifyingId(issueId);
    try {
      await onConfirmIssue(issueId);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  const getPriorityInfo = (riskScore: number) => {
    if (riskScore >= 8) {
      return { label: 'HIGH', color: 'bg-red-500/15 text-red-400 border border-red-500/30' };
    } else if (riskScore >= 4) {
      return { label: 'MEDIUM', color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' };
    } else {
      return { label: 'LOW', color: 'bg-green-500/15 text-green-400 border border-green-500/30' };
    }
  };

  const getStatusStyle = (status: IssueStatus) => {
    switch (status) {
      case 'reported': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'started': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  // Filter list
  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch = issue.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (issue.area || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-10" id="page-home-root">
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#0D0D11] to-[#040407] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 animate-fade-in">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Report Civic Issues.<br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Track Their Resolution.</span>
          </h1>
          <p className="text-sm lg:text-base text-slate-400 leading-relaxed font-sans">
            Making City Services Transparent and Accountable. Report local municipal complaints directly to public service departments and track repair lifecycles in real time.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onNavigateToReport}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer active:scale-95 flex items-center space-x-2"
              id="hero-report-button"
            >
              <span>Report Civic Issue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wider font-mono uppercase">Live City Infrastructure Analytics</h2>
          <p className="text-xs text-slate-400 font-sans">Aggregate statistics across municipal departments and priority levels</p>
        </div>
        <DashboardStatsPanel issues={issues} />
      </section>

      {/* Recent Issues Directory */}
      <section className="bg-[#09090B] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wider font-mono uppercase">Recent Civic Incident Reports</h2>
            <p className="text-xs text-slate-400 font-sans">Live transparent feed of infrastructure defects logged by community members</p>
          </div>
          <button
            onClick={onNavigateToReport}
            className="sm:self-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer active:scale-95"
          >
            + Report New Issue
          </button>
        </div>

        {/* Directory Search (Clean, simple search) */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by category, description or address..."
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-xs rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all font-sans"
          />
        </div>

        {/* Directory Cards List (Premium layout, horizontal side-by-side with large thumbnails) */}
        <div className="space-y-6">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-sans">No recent reported issues match your filter criteria.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const priority = getPriorityInfo(issue.riskScore);
              return (
                <div 
                  key={issue.id}
                  className="bg-[#121215] hover:bg-[#16161C] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-stretch gap-6 transition-all duration-300 group shadow-lg"
                  id={`home-issue-card-${issue.id}`}
                >
                  {/* Large Image on Left */}
                  <div className="w-full sm:w-60 h-44 sm:h-auto rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 relative shadow-inner">
                    <img 
                      src={issue.image} 
                      alt={issue.category} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-white/10 shadow">
                      #{issue.id.split('-')[1]?.slice(-4).toUpperCase() || issue.id}
                    </div>
                  </div>

                  {/* Info in Middle / Right */}
                  <div className="flex-1 flex flex-col justify-between gap-6 py-1">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-white tracking-tight">{issue.category}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${priority.color}`}>
                            {priority.label} Priority
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${getStatusStyle(issue.status)}`}>
                            {issue.status === 'started' ? 'IN PROGRESS' : issue.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-300">
                        <p className="flex items-center gap-2 min-w-0">
                          <span className="text-indigo-400 font-bold">📍</span>
                          <span className="truncate" title={issue.location}>{issue.location}</span>
                        </p>
                        <p className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                          <span>📅</span>
                          <span>{new Date(issue.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-indigo-400">🏢</span>
                          <span className="truncate">Dept: <strong className="text-slate-200">{issue.department}</strong></span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-indigo-400">👥</span>
                          <span>{issue.confirmations} citizen confirmations</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer with CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                      {onConfirmIssue && (
                        <button
                          onClick={() => handleVerify(issue.id)}
                          disabled={verifyingId === issue.id}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            issue.confirmedByUsers?.includes(userEmail)
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 active:scale-95 cursor-pointer'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-600/25 active:scale-95 cursor-pointer'
                          }`}
                          id={`verify-defect-btn-${issue.id}`}
                        >
                          {verifyingId === issue.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : issue.confirmedByUsers?.includes(userEmail) ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ThumbsUp className="w-3.5 h-3.5" />
                          )}
                          <span>{issue.confirmedByUsers?.includes(userEmail) ? 'Verified' : 'Verify Defect'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onViewDetails(issue.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer active:scale-95 flex items-center space-x-1.5 ml-auto"
                      >
                        <span>View Details</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}
