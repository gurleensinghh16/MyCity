import React from 'react';
import { Issue } from '../types';
import InteractiveMap from './InteractiveMap';
import { Map, Info, Compass, ShieldAlert, CheckCircle } from 'lucide-react';

interface PageMapProps {
  issues: Issue[];
  onSelectIssue: (issueId: string) => void;
  onNavigateHome: () => void;
}

export default function PageMap({
  issues,
  onSelectIssue,
  onNavigateHome
}: PageMapProps) {
  return (
    <div className="space-y-6" id="page-map-root">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Map className="w-5 h-5 text-indigo-400" />
            <span className="font-sans uppercase tracking-wider">City Infrastructure Defect Map</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Geospatial visualization of active complaints across Chandigarh sectors. Click any dot to see defect assessments.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg active:scale-95 cursor-pointer self-start"
        >
          ← Back to Home
        </button>
      </div>

      {/* Map Guidelines Overlay info bars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl text-xs space-y-1.5 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full mt-1 border border-white/20" />
          <div>
            <span className="font-bold text-slate-200 block font-sans">Resolved Incidents</span>
            <span className="text-[10px] text-slate-400">Green dots indicate closed tasks.</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl text-xs space-y-1.5 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full mt-1 border border-white/20" />
          <div>
            <span className="font-bold text-slate-200 block font-sans">High Priority Risks</span>
            <span className="text-[10px] text-slate-400">Red dots represent Risk Score 8-10.</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl text-xs space-y-1.5 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full mt-1 border border-white/20" />
          <div>
            <span className="font-bold text-slate-200 block font-sans">Medium Risks</span>
            <span className="text-[10px] text-slate-400">Yellow dots represent Risk Score 4-7.</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl text-xs space-y-1.5 flex items-start space-x-2.5">
          <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full mt-1 border border-white/20" />
          <div>
            <span className="font-bold text-slate-200 block font-sans">Low Risks</span>
            <span className="text-[10px] text-slate-400">Blue dots represent Risk Score 1-3.</span>
          </div>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="bg-[#09090B] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-4">
        <InteractiveMap 
          issues={issues}
          onSelectIssue={onSelectIssue}
          height="550px"
          zoom={13}
        />
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="font-sans leading-none">Clicking "View Details" on the marker popups will open the comprehensive triage diagnostic report page for that issue.</span>
        </div>
      </div>

    </div>
  );
}
