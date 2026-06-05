import { useState, useMemo } from "react";
import type { AuditIssue, AuditIssueType, IssueSeverity } from "../types/audit";

interface Props {
  issues: AuditIssue[];
}

const TYPE_LABELS: Record<AuditIssueType, string> = {
  unused_trigger: "未使用トリガー",
  unused_variable: "未使用変数",
  paused_tag: "停止中タグ",
  parse_warning: "パース警告",
};

const SEVERITY_STYLE: Record<IssueSeverity, { bg: string; color: string; label: string }> = {
  warning: { bg: "#FEF3C7", color: "#92400E", label: "warning" },
  info:    { bg: "#DBEAFE", color: "#1E40AF", label: "info" },
  error:   { bg: "#FEE2E2", color: "#991B1B", label: "error" },
};

const FILTERS: { label: string; value: AuditIssueType | "all" }[] = [
  { label: "すべて", value: "all" },
  { label: "未使用トリガー", value: "unused_trigger" },
  { label: "未使用変数", value: "unused_variable" },
  { label: "停止中タグ", value: "paused_tag" },
];

export function ResultTable({ issues }: Props) {
  const [typeFilter, setTypeFilter] = useState<AuditIssueType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      if (typeFilter !== "all" && issue.type !== typeFilter) return false;
      if (search && !issue.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [issues, typeFilter, search]);

  const th: React.CSSProperties = {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#6B6860",
    borderBottom: "1px solid #E4E2DC",
    whiteSpace: "nowrap",
    background: "#FAFAF8",
  };

  const td: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "12px",
    borderBottom: "1px solid #F0EFE9",
    verticalAlign: "top",
    color: "#1A1917",
  };

  return (
    <div>
      {/* フィルター行 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="名前で検索…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            fontSize: "12px",
            padding: "5px 10px",
            border: "1px solid #E4E2DC",
            borderRadius: "6px",
            background: "#FFFFFF",
            color: "#1A1917",
            outline: "none",
            width: "180px",
            fontFamily: "var(--font-sans)",
          }}
        />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            style={{
              fontSize: "11px",
              padding: "4px 12px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: typeFilter === f.value ? "#1A1917" : "#E4E2DC",
              background: typeFilter === f.value ? "#1A1917" : "#FFFFFF",
              color: typeFilter === f.value ? "#FFFFFF" : "#6B6860",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-sans)",
            }}
          >
            {f.label}
          </button>
        ))}
        <span style={{ fontSize: "12px", color: "#9B9890", marginLeft: "auto" }}>
          {filtered.length} 件
        </span>
      </div>

      {/* テーブル */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E4E2DC",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9B9890", fontSize: "13px" }}>
            該当するIssueはありません
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: "80px" }}>深刻度</th>
                  <th style={{ ...th, width: "120px" }}>種別</th>
                  <th style={{ ...th, width: "70px" }}>対象</th>
                  <th style={{ ...th, width: "180px" }}>名前</th>
                  <th style={th}>詳細</th>
                  <th style={{ ...th, width: "200px" }}>推奨対応</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((issue) => {
                  const sev = SEVERITY_STYLE[issue.severity];
                  return (
                    <tr key={issue.id} style={{ transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={td}>
                        <span style={{
                          display: "inline-block",
                          fontSize: "10px",
                          fontWeight: 500,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: sev.bg,
                          color: sev.color,
                          fontFamily: "var(--font-mono)",
                        }}>
                          {sev.label}
                        </span>
                      </td>
                      <td style={td}>
                        <span style={{
                          fontSize: "10px",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: "#F7F6F3",
                          border: "1px solid #E4E2DC",
                          color: "#6B6860",
                          fontFamily: "var(--font-mono)",
                          whiteSpace: "nowrap",
                        }}>
                          {TYPE_LABELS[issue.type] ?? issue.type}
                        </span>
                      </td>
                      <td style={{ ...td, color: "#6B6860" }}>{issue.resourceType}</td>
                      <td style={{ ...td, fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: "11px", wordBreak: "break-all" }}>
                        {issue.name}
                      </td>
                      <td style={{ ...td, color: "#6B6860" }}>{issue.detail}</td>
                      <td style={{ ...td, color: "#6B6860" }}>{issue.recommendation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
