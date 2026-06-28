/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IssueStatus = 'reported' | 'started' | 'completed';

export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface TimelineEvent {
  id: string;
  status: IssueStatus;
  timestamp: string;
  title: string;
  note: string;
  actor: 'Citizen' | 'Authority' | 'System' | 'AI Assistant';
  image?: string;
}

export interface AIAnalysis {
  summary: string;
  hazards: string[];
  priorityReasoning: string;
}

export interface AIVerificationReport {
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  severityExplanation: string;
  department: string;
  aiSummary: string;
  riskScore: number;
  priority: 'Low' | 'Medium' | 'High';
  imageQuality: string;
  authenticityAnalysis: string;
  locationValidation: string;
  duplicateDetected: {
    exists: boolean;
    issueId?: string;
    category?: string;
  };
  safetyImpact: string;
  authorityRecommendation: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  image: string; // Base64 representation of original report photo
  repairedImage?: string; // Base64 representation of repair confirmation photo
  location: string; // full address
  latitude?: number;
  longitude?: number;
  area?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  locationType?: string;
  category: string;
  department: string;
  severity: SeverityLevel;
  riskScore: number; // 1-10 scale
  description: string;
  remarks?: string;
  confirmations: number;
  confirmedByUsers: string[]; // List of user emails who verified this issue
  status: IssueStatus;
  timeline: TimelineEvent[];
  aiAnalysis?: AIAnalysis;
  aiVerificationReport?: AIVerificationReport;
  createdAt: string;
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  unresolvedIssues: number;
  communityConfirmations: number;
  byCategory: { name: string; count: number }[];
  byDepartment: { name: string; count: number }[];
  bySeverity: { name: string; count: number }[];
}
