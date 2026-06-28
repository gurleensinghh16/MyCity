/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Issue, DashboardStats } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Users, Hammer, BarChart3 } from 'lucide-react';

interface DashboardStatsProps {
  issues: Issue[];
}

export default function DashboardStatsPanel({ issues }: DashboardStatsProps) {
  // Compute Stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'completed').length;
  const inProgressIssues = issues.filter(i => i.status === 'started').length;
  const unresolvedIssues = issues.filter(i => i.status === 'reported').length;
  const communityConfirmations = issues.reduce((acc, i) => acc + i.confirmations, 0);

  // Group by Category
  const categoryMap: { [key: string]: number } = {};
  issues.forEach(i => {
    categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
  });
  const byCategory = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Group by Department
  const deptMap: { [key: string]: number } = {};
  issues.forEach(i => {
    deptMap[i.department] = (deptMap[i.department] || 0) + 1;
  });
  const byDepartment = Object.entries(deptMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Group by Severity
  const severityMap: { [key in 'Low' | 'Medium' | 'High']?: number } = {
    Low: 0,
    Medium: 0,
    High: 0
  };
  issues.forEach(i => {
    if (i.severity in severityMap) {
      severityMap[i.severity] = (severityMap[i.severity] || 0) + 1;
    }
  });
  const bySeverity = Object.entries(severityMap).map(([name, count]) => ({ name, count: count || 0 }));

  // Helper colors
  const severityColors: { [key: string]: string } = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const severityBarColors: { [key: string]: string } = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-orange-500'
  };

  return (
    <div className="space-y-6" id="mycity-stats-container">
      {/* 3-Column Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total reported */}
        <div className="bg-[#09090B] border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between" id="stat-total">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Reports</p>
              <h3 className="text-3xl font-bold font-sans tracking-tight text-white mt-1.5">{totalIssues}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 w-fit">
            <span>{communityConfirmations} citizens verified reported issues</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-[#09090B] border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between" id="stat-resolved">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Resolved</p>
              <h3 className="text-3xl font-bold font-sans tracking-tight text-emerald-500 mt-1.5">{resolvedIssues}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 w-fit">
            <span>Fixes completed successfully</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-[#09090B] border border-white/10 p-5 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between" id="stat-progress">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">In Progress</p>
              <h3 className="text-3xl font-bold font-sans tracking-tight text-amber-500 mt-1.5">{inProgressIssues}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
              <Hammer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-amber-500/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 w-fit">
            <span>Active cases in mitigation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
