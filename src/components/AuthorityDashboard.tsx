import React, { useState, useRef, useEffect } from 'react';
import { Issue, IssueStatus, SeverityLevel } from '../types';
import { 
  Hammer, CheckCircle, Clock, AlertTriangle, Building, MapPin, 
  MessageSquare, Save, UploadCloud, Flame, Check, RefreshCw, Sparkles, X, Eye, Navigation, ChevronRight, LogOut 
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import AIVerificationCard from './AIVerificationCard';

interface AuthorityDashboardProps {
  issues: Issue[];
  onUpdateStatus: (issueId: string, status: IssueStatus, remarks: string, repairedImage?: string) => Promise<void>;
  isSubmitting: boolean;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  authorityEmail: string;
  authorityDept: string;
  onLogout: () => void;
  onViewDetails: (issueId: string) => void;
}

const REALISTIC_DEPARTMENTS = [
  'All Departments',
  'Public Works Department (PWD)',
  'Municipal Corporation',
  'Water Supply Department',
  'Electricity Department',
  'Sanitation Department',
  'Traffic Police'
];

export default function AuthorityDashboard({ 
  issues, 
  onUpdateStatus,
  isSubmitting,
  selectedIssueId,
  setSelectedIssueId,
  authorityEmail,
  authorityDept,
  onLogout,
  onViewDetails
}: AuthorityDashboardProps) {
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Completed submission state (per issue inline form)
  const [activeCompletingId, setActiveCompletingId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [repairedImageBlob, setRepairedImageBlob] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPriorityInfo = (riskScore: number) => {
    if (riskScore >= 8) {
      return { level: 'high', label: 'HIGH', color: 'bg-red-500/15 text-red-400 border border-red-500/30' };
    } else if (riskScore >= 4) {
      return { level: 'medium', label: 'MEDIUM', color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' };
    } else {
      return { level: 'low', label: 'LOW', color: 'bg-green-500/15 text-green-400 border border-green-500/30' };
    }
  };

  // Filter issues based on criteria
  const filteredIssues = issues
    .filter(issue => {
      const matchesDept = issue.department === authorityDept;
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      return matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      // Prioritize high risk scores, then newest
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || filteredIssues[0] || null;

  // Sync details panel scroll
  useEffect(() => {
    if (!selectedIssueId && filteredIssues.length > 0) {
      setSelectedIssueId(filteredIssues[0].id);
    }
  }, [filteredIssues, selectedIssueId]);

  // Handle start work order action
  const handleStartWork = async (issueId: string) => {
    setErrorMsg(null);
    try {
      await onUpdateStatus(issueId, 'started', 'Work order initiated by authority dispatch officer.');
      setSuccessMsg('Work order has been successfully initiated and status changed to In Progress!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to start work order.');
    }
  };

  // Drag & drop handlers for repair photo
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file support.');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRepairedImageBlob(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Submit complete status change with proof of repair
  const handleCompleteSubmit = async (issueId: string) => {
    if (!repairedImageBlob) {
      setErrorMsg('A resolved condition photograph is strictly required to mark this task as completed.');
      return;
    }
    setErrorMsg(null);
    try {
      await onUpdateStatus(
        issueId,
        'completed',
        remarks || 'Repair completed successfully on site. Verification photo attached.',
        repairedImageBlob
      );
      setSuccessMsg('Incident marked completed and proof of repair logged successfully!');
      setActiveCompletingId(null);
      setRemarks('');
      setRepairedImageBlob(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update work order.');
    }
  };

  const getSeverityStyle = (level: SeverityLevel) => {
    switch (level) {
      case 'Low': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    }
  };

  const getStatusStyle = (status: IssueStatus) => {
    switch (status) {
      case 'reported': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'started': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-8" id="authority-dashboard-root">
      
      {/* Header Panel with Logged In User Info */}
      <div className="bg-[#09090B] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Building className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-md font-bold text-white font-mono uppercase tracking-wider">Authority Dispatch Control Panel</h1>
            <p className="text-xs text-slate-400 font-sans">
              Welcome back, <strong className="text-indigo-400">{authorityEmail}</strong> | Primary Agency: <strong className="text-white">{authorityDept}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-xs font-semibold text-red-400 hover:text-red-300 transition-all font-mono uppercase bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg active:scale-95 cursor-pointer flex items-center space-x-1.5 self-start md:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Console</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Queue & Filter Controls (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Dispatch Filters */}
          <div className="bg-[#09090B] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 gap-2">
              <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Queue Work Status</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider font-semibold w-fit">
                {authorityDept}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Pending', value: 'reported' },
                  { label: 'In Progress', value: 'started' },
                  { label: 'Completed', value: 'completed' },
                ].map((opt) => {
                  const active = statusFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatusFilter(opt.value)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/15'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:border-white/15'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Queue Feed */}
          <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">Active Work Order Queue ({filteredIssues.length})</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Dispatched failure events awaiting completion</p>
            </div>

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl mb-4 flex items-center space-x-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl mb-4 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                  <CheckCircle className="w-8 h-8 text-emerald-500/20 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-sans">No dispatched tasks match criteria. All clear!</p>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;
                  const priority = getPriorityInfo(issue.riskScore);
                  return (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isSelected 
                          ? 'bg-white/10 border-indigo-500/40 shadow-xl' 
                          : 'bg-[#121215] border-white/5 hover:border-white/10 hover:bg-[#16161C]'
                      }`}
                      id={`authority-card-${issue.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                          <img src={issue.image} alt={issue.category} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                          <div className="absolute top-0 left-0 bg-black/80 px-1 py-0.5 rounded-br text-[8px] font-mono text-slate-400 border-r border-b border-white/5">
                            #{issue.id.split('-')[1]?.slice(-4) || issue.id}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">{issue.category}</span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${priority.color}`}>
                              {priority.label} (RISK: {issue.riskScore})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 truncate font-sans">
                            📍 {issue.location}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Logged: {new Date(issue.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Info & Badges footer */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] font-mono">
                        <div className="text-slate-400">
                          Agency: <span className="text-slate-200 font-sans font-semibold">{issue.department.replace(' Department', '')}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${getSeverityStyle(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${getStatusStyle(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                      </div>

                      {/* Operational dispatcher action buttons on authority issue card */}
                      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(issue.id);
                          }}
                          className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] font-bold py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>View Details</span>
                        </button>

                        {issue.status === 'reported' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartWork(issue.id);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer shadow"
                          >
                            <RefreshCw className="w-3 h-3 animate-pulse" />
                            <span>Start Work</span>
                          </button>
                        ) : issue.status === 'started' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCompletingId(issue.id);
                              setSelectedIssueId(issue.id);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center space-x-1 cursor-pointer shadow"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-slate-500/10 text-slate-500 border border-slate-500/20 text-[10px] font-bold py-1.5 rounded-lg text-center flex items-center justify-center space-x-1 cursor-not-allowed"
                          >
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Completed</span>
                          </button>
                        )}

                        {/* Directions Link */}
                        {issue.latitude !== undefined && issue.longitude !== undefined ? (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[10px] font-bold py-1.5 rounded-lg text-center flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                          >
                            <Navigation className="w-3 h-3 text-emerald-400 animate-pulse" />
                            <span>Navigate</span>
                          </a>
                        ) : (
                          <button disabled className="bg-slate-500/5 text-slate-600 text-[10px] py-1.5 rounded-lg cursor-not-allowed">N/A</button>
                        )}
                      </div>

                      {/* Inline Form to Mark Completed with Image Upload */}
                      {activeCompletingId === issue.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="mt-2.5 p-4 bg-black/60 border border-emerald-500/30 rounded-xl space-y-3 shadow-inner"
                        >
                          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Complete Repair Proof logs</span>
                            <button 
                              type="button" 
                              onClick={() => setActiveCompletingId(null)}
                              className="text-slate-500 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <label className="block text-[10px] font-mono text-slate-400 uppercase">Remarks & Completion note</label>
                            <input
                              type="text"
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                              placeholder="Describe actions taken (e.g., filled pothole with cold mix asphalt...)"
                              className="w-full bg-[#121214] border border-white/10 text-xs rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Image upload proof */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono text-slate-400 uppercase">Proof of Repair Photo (Required)</label>
                            
                            {!repairedImageBlob ? (
                              <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                                  isDragging 
                                    ? 'border-emerald-500 bg-emerald-500/5' 
                                    : 'border-white/10 bg-white/5 hover:border-white/15'
                                }`}
                              >
                                <UploadCloud className="w-6 h-6 text-slate-500" />
                                <p className="text-[9px] text-slate-300">Click to upload resolved proof photograph</p>
                                <input 
                                  type="file" 
                                  ref={fileInputRef}
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </div>
                            ) : (
                              <div className="relative rounded-lg overflow-hidden border border-white/10 max-h-[110px] bg-black flex items-center justify-center">
                                <img src={repairedImageBlob} alt="Repair proof" className="object-contain max-h-[110px] w-full" referrerPolicy="no-referrer" />
                                <button 
                                  type="button" 
                                  onClick={() => setRepairedImageBlob(null)}
                                  className="absolute top-1 right-1 bg-black/80 border border-white/10 text-slate-400 hover:text-white p-1 rounded-full"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveCompletingId(null)}
                              className="flex-1 bg-[#121214] hover:bg-white/5 text-slate-400 py-1.5 rounded-lg text-[10px] font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleCompleteSubmit(issue.id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1"
                            >
                              {isSubmitting ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Submit Completion</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Operational Details & AI Diagnostics (7 Cols) */}
        <div className="xl:col-span-7">
          {selectedIssue ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dispatch-view-panel">
              {/* Image & Map Details (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#09090B] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative h-44 bg-black flex items-center justify-center border-b border-white/5">
                    <img src={selectedIssue.image} alt="Defect" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 bg-black/70 border border-white/5 text-[9px] px-2 py-0.5 rounded font-mono text-slate-300">
                      Citizen Evidence
                    </div>
                  </div>

                  <div className="p-4 space-y-3.5 text-xs">
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase leading-none">INCIDENT CODE</p>
                      <h4 className="text-white font-mono mt-1 font-semibold">{selectedIssue.id}</h4>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">STREET ADDRESS LOCATION</p>
                      <p className="text-slate-300 font-sans leading-relaxed">{selectedIssue.location}</p>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">CITIZEN DESCRIPTION STATEMENT</p>
                      <p className="text-slate-300 font-sans leading-relaxed italic">"{selectedIssue.description}"</p>
                    </div>
                  </div>
                </div>

                {/* Dispatch Location Coordinates Map */}
                {selectedIssue.latitude !== undefined && selectedIssue.longitude !== undefined && (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Dispatch Locator Coordinates</span>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <InteractiveMap 
                        latitude={selectedIssue.latitude}
                        longitude={selectedIssue.longitude}
                        height="180px"
                        zoom={14}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Triage Assessments & Gemini Audits (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* AI Auditing reports */}
                {selectedIssue.aiVerificationReport ? (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Gemini 12-factor Audit Diagnostics</span>
                    <AIVerificationCard report={selectedIssue.aiVerificationReport} />
                  </div>
                ) : selectedIssue.aiAnalysis ? (
                  <div className="bg-[#09090B] border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-3">
                    <div className="flex items-center space-x-1.5 border-b border-white/5 pb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <h4 className="font-bold text-white uppercase tracking-wider font-mono">Gemini AI Diagnostics</h4>
                    </div>

                    <div>
                      <p className="font-mono text-slate-400 uppercase text-[9px]">Calculated Risk Score</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${selectedIssue.riskScore * 10}%` }} />
                        </div>
                        <span className="font-bold text-orange-400 font-mono text-xs">{selectedIssue.riskScore}/10</span>
                      </div>
                    </div>

                    <div className="pt-1.5">
                      <p className="font-mono text-slate-400 uppercase text-[9px] mb-1">Identified Hazards</p>
                      <ul className="space-y-1 text-slate-300 font-sans">
                        {selectedIssue.aiAnalysis.hazards.map((h, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {/* Milestone audit tracker */}
                <div className="bg-[#09090B] border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-4">
                  <div className="flex items-center space-x-1.5 border-b border-white/5 pb-2.5">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white font-mono uppercase tracking-wider">Timeline Milestones logged</span>
                  </div>

                  <div className="relative border-l border-white/10 ml-2 pl-4 space-y-4">
                    {selectedIssue.timeline.map((event) => (
                      <div key={event.id} className="relative">
                        <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-black shadow" />
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white font-sans">{event.title}</span>
                            <span className="text-[9px] font-mono text-slate-500">{new Date(event.timestamp).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-400 font-sans mt-0.5 leading-normal">{event.note}</p>
                          <p className="text-[9px] font-mono text-slate-500 mt-1">Logged by: {event.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-[#09090B] border border-white/10 rounded-2xl p-12 text-center text-slate-500">
              <Building className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs">No issue currently focused in right column details dispatcher pane.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
