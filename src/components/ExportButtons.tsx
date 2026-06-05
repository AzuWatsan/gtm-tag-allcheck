import type { AuditResult } from "../types/audit";
import { issuesToCsv } from "../utils/csv";
import { downloadText } from "../utils/download";

interface Props {
  result: AuditResult;
  fileName?: string;
}

export function ExportButtons({ result, fileName }: Props) {
  const baseName = fileName?.replace(/\.json$/, "") ?? "gtm-audit";

  function handleCsv() {
    const csv = issuesToCsv(result.issues);
    downloadText(csv, `${baseName}-audit.csv`, "text/csv;charset=utf-8;");
  }

  function handleJson() {
    const json = JSON.stringify(result, null, 2);
    downloadText(json, `${baseName}-audit.json`, "application/json");
  }

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #E4E2DC",
    background: "#FFFFFF",
    color: "#1A1917",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "background 0.1s",
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        style={btnStyle}
        onClick={handleCsv}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F3")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
      >
        CSV 出力
      </button>
      <button
        style={btnStyle}
        onClick={handleJson}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F3")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
      >
        JSON 出力
      </button>
    </div>
  );
}
