import type {
  AuditIssue,
  AuditResult,
  AuditSummary,
  AuditMetadata,
  Analyzer,
  AnalyzerContext,
} from "../types/audit";
import type { NormalizedGtmContainer } from "../types/gtm";
import { triggerAnalyzer } from "./triggerAnalyzer";
import { variableAnalyzer } from "./variableAnalyzer";
import { pausedAnalyzer } from "./pausedAnalyzer";

export type { Analyzer, AnalyzerContext };

const ANALYZERS: Analyzer[] = [
  triggerAnalyzer,
  variableAnalyzer,
  pausedAnalyzer,
];

function buildSummary(container: NormalizedGtmContainer, issues: AuditIssue[]): AuditSummary {
  return {
    totalTags: container.tags.length,
    totalTriggers: container.triggers.length,
    totalVariables: container.variables.length,
    unusedTriggers: issues.filter((i) => i.type === "unused_trigger").length,
    unusedVariables: issues.filter((i) => i.type === "unused_variable").length,
    pausedTags: issues.filter((i) => i.type === "paused_tag").length,
    warnings: issues.filter((i) => i.severity === "warning").length,
    errors: issues.filter((i) => i.severity === "error").length,
  };
}

export function runAudit(
  container: NormalizedGtmContainer,
  metadata?: Partial<AuditMetadata>
): AuditResult {
  const context: AnalyzerContext = { container };
  const issues: AuditIssue[] = [];

  for (const analyzer of ANALYZERS) {
    issues.push(...analyzer.analyze(context));
  }

  const summary = buildSummary(container, issues);
  const auditMetadata: AuditMetadata = {
    analyzedAt: new Date().toISOString(),
    ...container.metadata,
    ...metadata,
  };

  return { summary, issues, metadata: auditMetadata };
}
