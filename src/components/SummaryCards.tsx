import type { AuditResult } from "../types/audit";

interface Props {
  result: AuditResult;
}

interface CardDef {
  label: string;
  value: number;
  style?: "warn" | "info" | "default";
}

export function SummaryCards({ result }: Props) {
  const { summary } = result;

  const cards: CardDef[] = [
    { label: "Tags", value: summary.totalTags },
    { label: "Triggers", value: summary.totalTriggers },
    { label: "Variables", value: summary.totalVariables },
    { label: "Unused triggers", value: summary.unusedTriggers, style: summary.unusedTriggers > 0 ? "warn" : "default" },
    { label: "Unused variables", value: summary.unusedVariables, style: summary.unusedVariables > 0 ? "warn" : "default" },
    { label: "Paused tags", value: summary.pausedTags, style: summary.pausedTags > 0 ? "info" : "default" },
  ];

  const valueColor = (style?: string) => {
    if (style === "warn") return "#92400E";
    if (style === "info") return "#1E40AF";
    return "#1A1917";
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4E2DC",
            borderRadius: "8px",
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6B6860", marginBottom: "6px", letterSpacing: "0.02em" }}>
            {card.label}
          </div>
          <div style={{ fontSize: "26px", fontWeight: 500, color: valueColor(card.style), fontFamily: "var(--font-mono)" }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
