import React, { useState, useRef, useEffect } from 'react';
import { Issue, IssueStatus, SeverityLevel } from '../types';
import { 
  UploadCloud, MapPin, AlertCircle, Calendar, Sparkles, Check, CheckCircle, 
  Map, MessageSquare, Flame, CheckCircle2, ChevronRight, Search, Filter, 
  Eye, RefreshCw, ThumbsUp, AlertTriangle, ShieldCheck, X, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveMap from './InteractiveMap';
import AIVerificationCard from './AIVerificationCard';

interface CitizenDashboardProps {
  issues: Issue[];
  userEmail: string;
  onReportIssue: (data: { 
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
  }) => Promise<void>;
  onConfirmIssue: (issueId: string) => Promise<void>;
  isSubmitting: boolean;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
}

export default function CitizenDashboard({ 
  issues, 
  userEmail, 
  onReportIssue, 
  onConfirmIssue,
  isSubmitting,
  selectedIssueId,
  setSelectedIssueId
}: CitizenDashboardProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Reporting Form state
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Map & Location coordinates
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [locationType, setLocationType] = useState<string | undefined>(undefined);
  const [area, setArea] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [postalCode, setPostalCode] = useState<string | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);

  // Diagnostic Wizard State
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [preAnalysisReport, setPreAnalysisReport] = useState<any | null>(null);
  const [formStep, setFormStep] = useState<1 | 2>(1); // 1: Input details, 2: Review Diagnostic Audit

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await handleMapLocationChange(lat, lng);
        setIsLocating(false);
      },
      (geoError) => {
        console.error('GPS lookup rejected:', geoError);
        setError(`Location permission denied or unavailable. Please click on the map to set your location.`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle coordinates changes (from clicking/dragging map)
  const handleMapLocationChange = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setError(null);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      if (!res.ok) {
        throw new Error('Geocoding endpoint returned error');
      }
      const data = await res.json();
      if (data.address) setLocation(data.address);
      if (data.area) setArea(data.area);
      if (data.city) setCity(data.city);
      if (data.state) setState(data.state);
      if (data.postalCode) setPostalCode(data.postalCode);
      if (data.locationType) setLocationType(data.locationType);
    } catch (err) {
      console.error('Reverse geocode processing failed:', err);
      setLocation(`GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setLocationType('Residential Area');
    }
  };

  // Drag-and-drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image format support (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageBlob(event.target.result as string);
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

  // Step 1 -> Step 2: Trigger Gemini Diagnostics Report
  const handleRunDiagnostics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBlob) {
      setError('An image upload is required to perform AI Verification Diagnostics.');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the location address or select it on the map.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description of the incident.');
      return;
    }

    setError(null);
    setIsRunningDiagnostics(true);

    try {
      const res = await fetch('/api/issues/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBlob,
          location,
          description,
          latitude,
          longitude
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'AI pre-verification failed.');
      }

      const data = await res.json();
      if (data.report) {
        setPreAnalysisReport(data.report);
        setFormStep(2); // Go to step 2 review
      } else {
        throw new Error('Analysis report missing from response.');
      }
    } catch (err: any) {
      setError(err.message || 'AI verification failed. Please try again.');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  // Step 2 -> Submit: Commit report to database
  const handleFinalSubmit = async () => {
    if (!preAnalysisReport || !imageBlob) return;
    setError(null);

    try {
      await onReportIssue({
        image: imageBlob,
        location,
        description,
        latitude,
        longitude,
        area,
        city,
        state,
        postalCode,
        locationType,
        aiVerificationReport: preAnalysisReport
      });

      setSuccess(true);
      // Reset Form State
      setLocation('');
      setDescription('');
      setImageBlob(null);
      setLatitude(undefined);
      setLongitude(undefined);
      setArea(undefined);
      setCity(undefined);
      setState(undefined);
      setPostalCode(undefined);
      setLocationType(undefined);
      setPreAnalysisReport(null);
      setFormStep(1);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit the verified report.');
    }
  };

  // Priority styles
  const getPriorityInfo = (riskScore: number) => {
    if (riskScore >= 8) {
      return { label: 'HIGH', time: 'Within 24h', color: 'bg-red-500/15 text-red-400 border border-red-500/30' };
    } else if (riskScore >= 4) {
      return { label: 'MEDIUM', time: 'Within 3 days', color: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' };
    } else {
      return { label: 'LOW', time: 'Within 7 days', color: 'bg-green-500/15 text-green-400 border border-green-500/30' };
    }
  };

  // Filter list
  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch = issue.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (issue.area || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
      return matchesSearch && matchesStatus && matchesSeverity;
    })
    .sort((a, b) => {
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return b.confirmations - a.confirmations;
    });

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || filteredIssues[0] || issues[0] || null;

  // Auto focus first item on load if none selected
  useEffect(() => {
    if (!selectedIssueId && filteredIssues.length > 0) {
      setSelectedIssueId(filteredIssues[0].id);
    }
  }, [filteredIssues, selectedIssueId]);

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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="citizen-dashboard-grid">
      {/* LEFT COLUMN: Report form + list of issues */}
      <div className="xl:col-span-7 space-y-8">
        
        {/* Dynamic Wizard Form Panel */}
        <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl" id="citizen-reporting-form">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-white">Rapid Civic Diagnostic Portal</h3>
                <p className="text-xs text-slate-400 font-sans">Submit photographic evidence of infrastructure failures.</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
              <span className={`px-2 py-0.5 rounded-lg border ${formStep === 1 ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/10'}`}>1. Evidence</span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-lg border ${formStep === 2 ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/10'}`}>2. Audit Review</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formStep === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onSubmit={handleRunDiagnostics} 
                className="space-y-5"
              >
                {/* Visual Support Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Visual Evidence (Required)</label>
                  {!imageBlob ? (
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2.5 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-500/5' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <UploadCloud className="w-8 h-8 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">Drag & drop issue photograph, or <span className="text-indigo-400 underline">browse</span></p>
                        <p className="text-[11px] text-slate-500">PNG, JPG, JPEG, WEBP. Visual properties parsed by AI.</p>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-[180px] bg-black flex items-center justify-center">
                      <img src={imageBlob} alt="Visual defect evidence" className="object-cover max-h-[180px] w-full" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => setImageBlob(null)}
                        className="absolute top-2 right-2 bg-black/85 hover:bg-black border border-white/10 text-slate-400 hover:text-white p-1.5 rounded-full transition-all"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Coordinates & Location Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Incident Street Address</label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 transition-all flex items-center space-x-1"
                      >
                        {isLocating ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 animate-pulse" />
                            <span>Request GPS Permission</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. House 1424, Sector 15-D, Chandigarh"
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Interactive Leaflet Map Inside the Form */}
                  <div className="space-y-2">
                    <span className="block text-xs font-mono uppercase tracking-wider text-slate-400">Map Locator (Drag Marker or Click Map to Fine-Tune)</span>
                    <InteractiveMap 
                      latitude={latitude}
                      longitude={longitude}
                      onChangeLocation={handleMapLocationChange}
                      isDraggable={true}
                      height="220px"
                    />
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Brief Description of Problem</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Large pothole directly on Maple Avenue causing cars to swerve..."
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Incident reported and verified successfully! Active tracking order created.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRunningDiagnostics}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-98 shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunningDiagnostics ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gemini is running 12-factor structural audit diagnostics...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run AI Diagnostics & Audit Report</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                {/* Visual indicator of uploaded picture */}
                <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={imageBlob!} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm">{preAnalysisReport.category} Assessment</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Address: {location}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 italic">"{description}"</p>
                  </div>
                </div>

                {/* AI Verification audit results */}
                <AIVerificationCard 
                  report={preAnalysisReport}
                  onFocusExisting={(id) => {
                    setSelectedIssueId(id);
                    // scroll to details
                    const el = document.getElementById('selected-issue-detail-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onConfirmIssue={async (id) => {
                    await onConfirmIssue(id);
                    setPreAnalysisReport(null);
                    setFormStep(1);
                  }}
                  userEmail={userEmail}
                  issues={issues}
                />

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Final Submit action footer */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="flex-1 bg-[#09090B] border border-white/10 hover:bg-white/5 text-slate-300 font-sans font-semibold text-xs py-3 rounded-xl transition-all active:scale-98"
                  >
                    Back to Edit Details
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 active:scale-98 shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Filing report...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm & File Report</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Directory grid list */}
        <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl" id="citizen-reports-directory">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-md font-bold font-sans text-white uppercase tracking-wider">Active Infrastructure Grid</h3>
              <p className="text-xs text-slate-400 font-sans">Transparent lists of active reported city service problems</p>
            </div>
            
            <div className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              User ID: <span className="text-indigo-400 font-semibold">{userEmail}</span>
            </div>
          </div>

          {/* Filtering */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location or area..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-xs rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-0"
              />
            </div>

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#09090B] border border-white/10 hover:border-white/20 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported Only</option>
                <option value="started">Repairs Started</option>
                <option value="completed">Completed / Fixed</option>
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full bg-[#09090B] border border-white/10 hover:border-white/20 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Issue Rows */}
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-sans text-slate-400">No reported problems matched filters.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isSelected = selectedIssueId === issue.id;
                const priority = getPriorityInfo(issue.riskScore);
                return (
                  <div 
                    key={issue.id}
                    onClick={() => setSelectedIssueId(issue.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-white/10 border-indigo-500/40 shadow-xl shadow-indigo-950/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                    id={`issue-row-${issue.id}`}
                  >
                    <div className="flex items-start space-x-4 min-w-0 flex-1">
                      {/* Thumbnail photo */}
                      <div className="w-14 h-14 rounded-xl bg-[#09090B] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                        <img src={issue.image} alt={issue.category} className="object-cover w-full h-full animate-fade-in" referrerPolicy="no-referrer" />
                        <div className="absolute top-0 left-0 bg-black/75 px-1 py-0.5 rounded-br text-[8px] font-mono text-slate-400 border-r border-b border-white/5">
                          #{issue.id.split('-')[1]?.slice(-4) || issue.id}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-white tracking-tight">{issue.category}</span>
                          <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${priority.color}`}>
                            {priority.label} PRIORITY ({priority.time})
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-300 truncate mt-1 flex items-center font-sans">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{issue.location}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center">
                            <span className="text-slate-500 mr-1">Agency:</span>
                            <span className="text-slate-300 font-sans font-medium">{issue.department}</span>
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 text-slate-500 mr-1" />
                            <span>{issue.confirmations} validations</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge groups */}
                    <div className="flex items-center gap-3 justify-between md:justify-end border-t border-white/5 md:border-none pt-3 md:pt-0">
                      <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <Flame className={`w-3.5 h-3.5 ${issue.riskScore >= 8 ? 'text-red-400 animate-pulse' : issue.riskScore >= 4 ? 'text-amber-400' : 'text-green-400'}`} />
                        <div>
                          <p className="text-[8px] font-mono text-slate-500 uppercase leading-none">Risk Score</p>
                          <p className="text-xs font-bold text-white font-sans mt-0.5 leading-none">{issue.riskScore}/10</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full ${getSeverityStyle(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className={`text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full ${getStatusStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Details panel, AI summary + timeline */}
      <div className="xl:col-span-5">
        <AnimatePresence mode="wait">
          {selectedIssue ? (
            <motion.div 
              key={selectedIssue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="selected-issue-detail-panel"
            >
              {/* Info Card */}
              <div className="bg-[#09090B] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-48 bg-black flex items-center justify-center border-b border-white/10">
                  <img src={selectedIssue.image} alt="Reported problem" className="object-cover h-full w-full" referrerPolicy="no-referrer" />
                  
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full shadow-lg ${getSeverityStyle(selectedIssue.severity)}`}>
                      {selectedIssue.severity} Priority
                    </span>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full shadow-lg ${getStatusStyle(selectedIssue.status)}`}>
                      {selectedIssue.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/90 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2 shadow-xl">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-none">Risk Score</p>
                      <p className="text-md font-bold font-sans text-white leading-none mt-0.5">{selectedIssue.riskScore}/10</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">MUNICIPAL INCIDENT ORDER</p>
                    <h3 className="text-xl font-bold text-white font-sans mt-0.5">{selectedIssue.category}</h3>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 border-t border-white/5 pt-2.5">
                      <p className="text-xs text-slate-400 font-sans flex items-center min-w-0 max-w-[70%]">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{selectedIssue.location}</span>
                      </p>
                      
                      {/* GET DIRECTIONS BUTTON (GOOGLE MAPS NAVIGATION) */}
                      {selectedIssue.latitude !== undefined && selectedIssue.longitude !== undefined && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIssue.latitude},${selectedIssue.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/20 shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          <Navigation className="w-3 h-3 text-emerald-400" />
                          <span>Get Directions</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Citizen Description</p>
                    <p className="text-xs text-slate-300 font-sans italic">"{selectedIssue.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Assigned Agency</p>
                      <p className="text-slate-200 mt-1 font-semibold">{selectedIssue.department}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Reported On</p>
                      <p className="text-slate-200 mt-1">{new Date(selectedIssue.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Validation Actions */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                      <div>
                        <p className="text-xs font-semibold text-white">Does this problem still exist?</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Help prioritize: confirm if active.</p>
                      </div>
                      
                      <button
                        onClick={() => onConfirmIssue(selectedIssue.id)}
                        disabled={selectedIssue.confirmedByUsers.includes(userEmail)}
                        className={`px-3 py-2 rounded-lg font-sans font-semibold text-xs transition-all flex items-center space-x-1.5 ${
                          selectedIssue.confirmedByUsers.includes(userEmail)
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-600/20 active:scale-95'
                        }`}
                        id={`confirm-issue-btn-${selectedIssue.id}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{selectedIssue.confirmedByUsers.includes(userEmail) ? 'Verified' : 'Verify'} ({selectedIssue.confirmations})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive AI Audit Report Block */}
              {selectedIssue.aiVerificationReport ? (
                <AIVerificationCard 
                  report={selectedIssue.aiVerificationReport}
                  issues={issues}
                  userEmail={userEmail}
                />
              ) : selectedIssue.aiAnalysis ? (
                // Fallback rendering of older AI summaries
                <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">AI Assessment Details</h4>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedIssue.aiAnalysis.summary}</p>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs font-sans">
                    <span className="text-slate-500 text-[10px] font-mono block">Hazards</span>
                    <span className="text-slate-300 font-medium">{selectedIssue.aiAnalysis.hazards.join(', ')}</span>
                  </div>
                </div>
              ) : null}

              {/* Status Timeline History */}
              <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-6 border-b border-white/10 pb-2">Tracking Milestones</h4>
                <div className="relative border-l-2 border-white/10 ml-3 pl-6 space-y-6">
                  {selectedIssue.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <span className={`absolute -left-[31px] top-0.5 p-1 rounded-full border-2 ${
                        event.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                          : event.status === 'started'
                          ? 'bg-yellow-950 text-yellow-400 border-yellow-500'
                          : 'bg-indigo-950 text-indigo-400 border-indigo-500'
                      }`}>
                        {event.status === 'completed' ? (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        ) : (
                          <div className="w-1 h-1 bg-current rounded-full" />
                        )}
                      </span>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1 gap-1">
                          <span className="font-bold text-white font-sans">{event.title}</span>
                          <span className="text-[10px] font-mono text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed">{event.note}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 text-slate-400">
                            Logged by: {event.actor}
                          </span>
                        </div>

                        {event.status === 'completed' && event.image && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-h-[140px] bg-[#09090B] flex items-center justify-center">
                            <img src={event.image} alt="Repair completed proof" className="object-contain max-h-[140px] w-full" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="bg-[#09090B] border border-white/10 rounded-2xl p-8 text-center shadow-xl text-slate-500">
              <Eye className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-sans">No incident currently selected.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
