import { useState } from "react";
import { UploadArea } from "./components/UploadArea";
import { SummaryCards } from "./components/SummaryCards";
import { ResultTable } from "./components/ResultTable";
import { ExportButtons } from "./components/ExportButtons";
import { parseGtmExport } from "./parser/gtmParser";
import { runAudit } from "./analyzers";
import type { AuditResult } from "./types/audit";

type AppState = "idle" | "ready" | "done" | "error";

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [fileName, setFileName] = useState<string>();
  const [parseError, setParseError] = useState<string>();
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  function handleFile(file: File) {
    setParseError(undefined);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // パース検証
        parseGtmExport(json);
        setParsedJson(json);
        setFileName(file.name);
        setState("ready");
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "JSONの読み込みに失敗しました");
        setState("error");
      }
    };
    reader.readAsText(file);
  }

  function handleAudit() {
    if (!parsedJson) return;
    try {
      const container = parseGtmExport(parsedJson);
      const auditResult = runAudit(container, { fileName });
      setResult(auditResult);
      setState("done");
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "解析中にエラーが発生しました");
      setState("error");
    }
  }

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 500,
    color: "#9B9890",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  };

  const section: React.CSSProperties = {
    marginBottom: "28px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", paddingBottom: "80px" }}>
      {/* ヘッダー */}
      <div style={{
        borderBottom: "1px solid #E4E2DC",
        background: "#FFFFFF",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        height: "52px",
        gap: "12px",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", color: "#1A1917" }}>
          GTM Container Audit
        </span>
        <span style={{
          fontSize: "10px",
          fontFamily: "var(--font-mono)",
          background: "#F7F6F3",
          border: "1px solid #E4E2DC",
          color: "#9B9890",
          padding: "2px 7px",
          borderRadius: "4px",
        }}>
          v1.0
        </span>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* アップロード */}
        <div style={section}>
          <div style={sectionLabel}>コンテナ JSON</div>
          <UploadArea
            onFile={handleFile}
            fileName={state !== "idle" && state !== "error" ? fileName : undefined}
            error={state === "error" ? parseError : undefined}
          />
        </div>

        {/* Run Audit */}
        <div style={section}>
          <button
            disabled={state !== "ready" && state !== "done"}
            onClick={handleAudit}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              background: state === "ready" || state === "done" ? "#1A1917" : "#E4E2DC",
              color: state === "ready" || state === "done" ? "#FFFFFF" : "#9B9890",
              cursor: state === "ready" || state === "done" ? "pointer" : "not-allowed",
              fontFamily: "var(--font-sans)",
              transition: "opacity 0.15s",
            }}
          >
            Run Audit
          </button>
        </div>

        {/* 結果表示 */}
        {result && (
          <>
            {/* メタ情報 */}
            <div style={{ marginBottom: "28px" }}>
              <div style={sectionLabel}>解析情報</div>
              <div style={{
                fontSize: "11px",
                color: "#9B9890",
                fontFamily: "var(--font-mono)",
                background: "#FFFFFF",
                border: "1px solid #E4E2DC",
                borderRadius: "6px",
                padding: "10px 14px",
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
              }}>
                {result.metadata.containerId && (
                  <span>Container: {result.metadata.containerId}</span>
                )}
                {result.metadata.exportTime && (
                  <span>Export: {result.metadata.exportTime}</span>
                )}
                <span>Analyzed: {new Date(result.metadata.analyzedAt).toLocaleString("ja-JP")}</span>
                <span style={{ color: result.summary.warnings > 0 ? "#92400E" : "#9B9890" }}>
                  Issues: {result.issues.length} 件
                </span>
              </div>
            </div>

            {/* サマリー */}
            <div style={section}>
              <div style={sectionLabel}>サマリー</div>
              <SummaryCards result={result} />
            </div>

            {/* 結果テーブル */}
            <div style={section}>
              <div style={sectionLabel}>監査結果</div>
              <ResultTable issues={result.issues} />
            </div>

            {/* エクスポート */}
            <div style={section}>
              <div style={sectionLabel}>エクスポート</div>
              <ExportButtons result={result} fileName={fileName} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
