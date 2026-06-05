import { describe, it, expect } from "vitest";
import { issuesToCsv } from "../../utils/csv";
import type { AuditIssue } from "../../types/audit";

const sampleIssue: AuditIssue = {
  id: "test_1",
  type: "unused_trigger",
  severity: "warning",
  resourceType: "trigger",
  resourceId: "11",
  name: "Old Thanks",
  detail: "どのタグからも参照されていません。",
  recommendation: "削除候補です。",
};

describe("issuesToCsv", () => {
  // TC-CSV-001
  it("ヘッダー行が含まれる", () => {
    const csv = issuesToCsv([]);
    expect(csv).toContain("severity");
    expect(csv).toContain("recommendation");
  });

  // TC-CSV-002
  it("UTF-8 BOMで始まる", () => {
    const csv = issuesToCsv([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  // TC-CSV-003
  it("カンマを含む値はダブルクォートで囲まれる", () => {
    const issue: AuditIssue = { ...sampleIssue, detail: "a,b,c" };
    const csv = issuesToCsv([issue]);
    expect(csv).toContain('"a,b,c"');
  });

  // TC-CSV-004
  it('ダブルクォートは "" にエスケープされる', () => {
    const issue: AuditIssue = { ...sampleIssue, detail: '"test"' };
    const csv = issuesToCsv([issue]);
    expect(csv).toContain('""test""');
  });

  // TC-CSV-005
  it("日本語テキストが含まれる", () => {
    const csv = issuesToCsv([sampleIssue]);
    expect(csv).toContain("どのタグからも参照されていません。");
  });

  it("resourceIdが空の場合は空文字", () => {
    const issue: AuditIssue = { ...sampleIssue, resourceId: undefined };
    const csv = issuesToCsv([issue]);
    // resourceId列が空文字("")であることを確認
    expect(csv).toContain('""');
  });
});
