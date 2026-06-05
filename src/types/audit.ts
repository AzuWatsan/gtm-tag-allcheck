// Audit Result Types

export type IssueSeverity = "info" | "warning" | "error";

export type AuditIssueType =
  | "unused_trigger"
  | "unused_variable"
  | "paused_tag"
  | "parse_warning";

export type ResourceType = "tag" | "trigger" | "variable" | "container";

export interface AuditIssue {
  id: string;
  type: AuditIssueType;
  severity: IssueSeverity;
  resourceType: ResourceType;
  resourceId?: string;
  name: string;
  detail: string;
  recommendation: string;
}

export interface AuditSummary {
  totalTags: number;
  totalTriggers: number;
  totalVariables: number;
  unusedTriggers: number;
  unusedVariables: number;
  pausedTags: number;
  warnings: number;
  errors: number;
}

export interface AuditMetadata {
  analyzedAt: string;
  fileName?: string;
  exportTime?: string;
  containerId?: string;
  accountId?: string;
}

export interface AuditResult {
  summary: AuditSummary;
  issues: AuditIssue[];
  metadata: AuditMetadata;
}

// Analyzer Interface
export interface AnalyzerContext {
  container: import("./gtm").NormalizedGtmContainer;
}

export interface Analyzer {
  analyze(context: AnalyzerContext): AuditIssue[];
}
