import React from 'react';
import { AIVerificationReport, Issue } from '../types';
import { 
  Sparkles, CheckCircle, AlertTriangle, ShieldCheck, 
  Clock, Eye, Camera, ThumbsUp, AlertCircle, MapPin
} from 'lucide-react';

interface AIVerificationCardProps {
  report?: AIVerificationReport;
  onFocusExisting?: (issueId: string) => void;
  onConfirmIssue?: (issueId: string) => void;
  userEmail?: string;
  issues?: Issue[];
}

export default function AIVerificationCard({
  report,
  onFocusExisting,
  onConfirmIssue,
  userEmail,
  issues
}: AIVerificationCardProps) {
  if (!report) return null;

  const isDuplicate = report.duplicateDetected?.exists;
  const duplicateId = report.duplicateDetected?.issueId;
  const duplicateIssue = duplicateId ? issues?.find(i => i.id === duplicateId) : null;

  // Badge styles based on values
  const getQualityBadgeColor = (val: string) => {
    const v = val.toLowerCase();
    if (v.includes('blurry') || v.includes('poor') || v.includes('low') || v.includes('dark')) {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const getAuthenticityBadgeColor = (val: string) => {
    const v = val.toLowerCase();
    if (v.includes('suspicious') || v.includes('warning') || v.includes('internet') || v.includes('edited')) {
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const getLocationBadgeColor = (val: string) => {
    const v = val.toLowerCase();
    if (v.includes('not') || v.includes('unverified') || v.includes('fail') || v.includes('poor')) {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  return (
    <div className="bg-gradient-to-b from-indigo-950/20 to-black/30 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden" id="ai-verification-report-card">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-500/10 pb-4 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Gemini AI Audit Report</h4>
            <p className="text-[10px] text-slate-500 font-mono">STANDARDIZED CIVIC VERIFICATION SYSTEM</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-1 rounded-xl">
          Verified on {new Date(report.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Duplicate detection warning */}
      {isDuplicate && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs p-4 rounded-xl space-y-3" id="duplicate-warning-banner">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-slate-100">Duplicate Incident Warning Detected</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                This issue matches a previously reported live incident nearby (within 500 meters) categorised under "{report.duplicateDetected.category || report.category}".
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {onFocusExisting && duplicateId && (
              <button
                type="button"
                onClick={() => onFocusExisting(duplicateId)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg font-sans shadow transition-all cursor-pointer active:scale-95 flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Existing Issue</span>
              </button>
            )}
            {onConfirmIssue && duplicateId && userEmail && duplicateIssue && (
              <button
                type="button"
                disabled={duplicateIssue.confirmedByUsers.includes(userEmail)}
                onClick={() => onConfirmIssue(duplicateId)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg font-sans border transition-all cursor-pointer active:scale-95 flex items-center space-x-1 ${
                  duplicateIssue.confirmedByUsers.includes(userEmail)
                    ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow shadow-emerald-600/10'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{duplicateIssue.confirmedByUsers.includes(userEmail) ? 'Already Validated' : 'Validate Existing Instead'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Analysis Summary Block */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Verdicts Summary</span>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {report.aiSummary}
        </p>
      </div>

      {/* Grid of three diagnostic checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>Image Quality Check</span>
          </div>
          <p className="font-semibold text-slate-200 text-[11px] truncate leading-tight">{report.imageQuality.split('.')[0]}</p>
          <span className={`inline-block text-[8px] font-mono px-1.5 py-0.5 rounded ${getQualityBadgeColor(report.imageQuality)}`}>
            {report.imageQuality.toLowerCase().includes('clear') ? 'PASS' : 'REVIEW'}
          </span>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Authenticity Analysis</span>
          </div>
          <p className="font-semibold text-slate-200 text-[11px] truncate leading-tight">{report.authenticityAnalysis.split('.')[0]}</p>
          <span className={`inline-block text-[8px] font-mono px-1.5 py-0.5 rounded ${getAuthenticityBadgeColor(report.authenticityAnalysis)}`}>
            {report.authenticityAnalysis.toLowerCase().includes('suspicious') ? 'WARNING' : 'SECURE'}
          </span>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Location Validation</span>
          </div>
          <p className="font-semibold text-slate-200 text-[11px] truncate leading-tight">{report.locationValidation.split('.')[0]}</p>
          <span className={`inline-block text-[8px] font-mono px-1.5 py-0.5 rounded ${getLocationBadgeColor(report.locationValidation)}`}>
            {report.locationValidation.toLowerCase().includes('not') ? 'UNVERIFIED' : 'VERIFIED'}
          </span>
        </div>
      </div>

      {/* Bottom details block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-indigo-500/10 text-xs">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Estimated Safety Impacts</span>
          <div className="flex flex-wrap gap-1">
            {report.safetyImpact.split(',').map((impact, i) => (
              <span key={i} className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-lg bg-red-500/5 text-red-300 border border-red-500/10">
                ⚠️ {impact.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/15 rounded-xl p-3.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block mb-1">AI Recommendation</span>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed italic">
            "{report.authorityRecommendation}"
          </p>
        </div>
      </div>
    </div>
  );
}
