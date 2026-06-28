import React, { useState } from 'react';
import { Issue, IssueStatus } from '../types';
import { MapPin, ThumbsUp, Calendar, Building, Navigation, Check, ZoomIn, X, Clock, HelpCircle, RefreshCw } from 'lucide-react';
import InteractiveMap from './InteractiveMap';

interface PageDetailsProps {
  issue: Issue | null;
  onNavigateBack: () => void;
  onConfirmIssue: (issueId: string) => Promise<void>;
  userEmail: string;
}

export default function PageDetails({
  issue,
  onNavigateBack,
  onConfirmIssue,
  userEmail
}: PageDetailsProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-[#09090B] border border-white/10 rounded-2xl animate-fade-in" id="details-not-found">
        <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-sans">Issue not found or has been removed.</p>
        <button
          onClick={onNavigateBack}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirmIssue(issue.id);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  const getStatusStyle = (status: IssueStatus) => {
    switch (status) {
      case 'reported': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'started': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getPriorityStyle = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s === 'high') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (s === 'medium') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  // Check if there are completed timeline events with after images
  const completedEvent = issue.timeline.find(e => e.status === 'completed');
  const showBeforeAfter = issue.status === 'completed' || !!issue.repairedImage || (completedEvent && !!completedEvent.image);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" id="page-details-root">
      
      {/* Back button header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button
          onClick={onNavigateBack}
          className="text-xs font-semibold text-slate-300 hover:text-white transition-all font-mono uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-xl active:scale-95 cursor-pointer"
        >
          &larr; Back to Registry
        </button>
        <div className="text-xs font-mono text-slate-500 uppercase">
          Ticket ID: <span className="text-white font-semibold">#{issue.id.split('-')[1]?.toUpperCase() || issue.id}</span>
        </div>
      </div>

      <div className="space-y-6 bg-[#09090B] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
        
        {/* 1. Large Issue Image */}
        <div className="space-y-2" id="detail-image-section">
          <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-inner group">
            <img 
              src={issue.image} 
              alt={issue.category} 
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setIsZoomed(true)} 
              className="absolute top-4 right-4 bg-black/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white font-mono flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Zoom Image</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono text-right">Photo evidence submitted by citizen</p>
        </div>

        {/* 2. Issue Description */}
        <div className="border-t border-white/5 pt-6" id="detail-description-section">
          <h1 className="text-2xl font-bold text-white tracking-tight">{issue.category}</h1>
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Citizen Complaint & Description</h4>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm leading-relaxed text-slate-200">
              "{issue.description}"
            </div>
          </div>
        </div>

        {/* 3. Location */}
        <div className="border-t border-white/5 pt-6 space-y-3" id="detail-location-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Location</h4>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-start space-x-2.5">
              <span className="text-indigo-400 font-bold text-lg mt-0.5">📍</span>
              <div>
                <p className="text-sm font-semibold text-white">{issue.location}</p>
                {issue.locationType && (
                  <p className="text-xs text-slate-400 mt-0.5">Zone Type: <strong className="text-slate-300">{issue.locationType}</strong></p>
                )}
              </div>
            </div>
            {issue.latitude !== undefined && issue.longitude !== undefined && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-all shadow active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Get Directions</span>
              </a>
            )}
          </div>

          {issue.latitude !== undefined && issue.longitude !== undefined && (
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <InteractiveMap 
                latitude={issue.latitude}
                longitude={issue.longitude}
                height="220px"
                zoom={15}
              />
            </div>
          )}
        </div>

        {/* 4. Assigned Department */}
        <div className="border-t border-white/5 pt-6 space-y-2" id="detail-department-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Responsible Agency</h4>
          <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <Building className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">{issue.department}</p>
              <p className="text-xs text-slate-400">Assigned department for resolution and operations</p>
            </div>
          </div>
        </div>

        {/* 5. Current Status */}
        <div className="border-t border-white/5 pt-6 space-y-2" id="detail-status-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Current Status</h4>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-mono font-bold uppercase px-3.5 py-1.5 rounded-full ${getStatusStyle(issue.status)}`}>
              {issue.status === 'started' ? 'IN PROGRESS' : issue.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-500" /> Reported on: {new Date(issue.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* 6. Priority */}
        <div className="border-t border-white/5 pt-6 space-y-2" id="detail-priority-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Risk Priority Level</h4>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-mono font-bold uppercase px-3.5 py-1.5 rounded-full ${getPriorityStyle(issue.severity)}`}>
              {issue.severity.toUpperCase()} PRIORITY
            </span>
            <p className="text-xs text-slate-400 font-sans">Level of urgency determined by department triage parameters</p>
          </div>
        </div>

        {/* 7. Timeline */}
        <div className="border-t border-white/5 pt-6 space-y-4" id="detail-timeline-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-400" /> Resolution Milestones & Log
          </h4>
          <div className="relative border-l-2 border-white/10 ml-3 pl-6 space-y-6">
            {issue.timeline.map((event) => (
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
                    <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  )}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="font-bold text-white font-sans">{event.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{event.note}</p>
                  
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                    <span>Logged by:</span>
                    <span className="text-slate-300">{event.actor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Community Verifications */}
        <div className="border-t border-white/5 pt-6 space-y-4" id="detail-verifications-section">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Community Verification</h4>
          <div className="bg-gradient-to-br from-indigo-950/10 to-black/40 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-semibold text-white font-sans">Does this problem still exist?</h4>
              <p className="text-xs text-slate-400 leading-normal">Help prioritize this ticket: validate that the defect is still present on site.</p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 ${
                issue.confirmedByUsers.includes(userEmail)
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 active:scale-95 cursor-pointer'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-600/25 active:scale-95 cursor-pointer'
              }`}
              id="confirm-issue-details-btn"
            >
              {confirming ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : issue.confirmedByUsers.includes(userEmail) ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ThumbsUp className="w-3.5 h-3.5" />
              )}
              <span>{issue.confirmedByUsers.includes(userEmail) ? 'Verified' : 'Verify Defect'} ({issue.confirmations})</span>
            </button>
          </div>
        </div>

        {/* 9. Authority Updates */}
        {issue.remarks && (
          <div className="border-t border-white/5 pt-6 space-y-2" id="detail-remarks-section">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Authority Updates & Remarks</h4>
            <div className="bg-[#121215] border border-white/10 rounded-xl p-4 text-xs leading-relaxed">
              <span className="font-mono text-[9px] text-slate-500 uppercase block">OFFICIAL OPERATIONS NOTES</span>
              <p className="text-slate-300 mt-1 leading-relaxed italic">"{issue.remarks}"</p>
            </div>
          </div>
        )}

        {/* 10. Before / After Repair Images */}
        {showBeforeAfter && (
          <div className="border-t border-white/5 pt-6 space-y-3" id="detail-visual-proof-section">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Before / After Repair Images</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#121215] border border-white/10 p-5 rounded-xl">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Before Repair</span>
                <div className="aspect-video rounded-lg overflow-hidden bg-black border border-white/5">
                  <img src={issue.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Before repair proof" />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-500 block uppercase font-bold">After Repair</span>
                <div className="aspect-video rounded-lg overflow-hidden bg-black border border-white/5">
                  <img src={issue.repairedImage || (completedEvent && completedEvent.image) || issue.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="After repair proof" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Full screen Lightbox zoom overlay modal */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          id="zoom-lightbox-modal"
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={issue.image} 
            alt="Expanded visual evidence" 
            className="max-h-full max-w-full object-contain rounded shadow-2xl animate-scale-up"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

    </div>
  );
}
