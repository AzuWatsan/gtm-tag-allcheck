import type { AuditIssue } from "../types/audit";

function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function issuesToCsv(issues: AuditIssue[]): string {
  const header = ["severity", "type", "resourceType", "resourceId", "name", "detail", "recommendation"];
  const rows = issues.map((issue) => [
    issue.severity,
    issue.type,
    issue.resourceType,
    issue.resourceId ?? "",
    issue.name,
    issue.detail,
    issue.recommendation,
  ]);

  return "\uFEFF" + [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
}
