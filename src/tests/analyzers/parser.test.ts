import { describe, it, expect } from "vitest";
import { parseGtmExport } from "../../parser/gtmParser";
import sampleJson from "../fixtures/sample.json";

describe("parseGtmExport", () => {
  // TC-PARSE-001: 最小有効コンテナ
  it("valid minimal container: 空配列で正規化される", () => {
    const result = parseGtmExport({ containerVersion: {} });
    expect(result.tags).toEqual([]);
    expect(result.triggers).toEqual([]);
    expect(result.variables).toEqual([]);
    expect(result.builtInVariables).toEqual([]);
  });

  // TC-PARSE-002: containerVersionなし
  it("containerVersionが存在しない場合はエラーをthrow", () => {
    expect(() => parseGtmExport({})).toThrow("containerVersion が見つかりません");
  });

  // TC-PARSE-003: tagがオブジェクト(非配列)の場合
  it("tagが配列でない場合は空配列として扱う", () => {
    const result = parseGtmExport({
      containerVersion: { tag: {}, trigger: null, variable: "string" },
    });
    expect(result.tags).toEqual([]);
    expect(result.triggers).toEqual([]);
    expect(result.variables).toEqual([]);
  });

  // TC-PARSE-004: 無効なJSON (※UIテストのため、文字列入力をシミュレート)
  it("rootがオブジェクトでない場合はエラーをthrow", () => {
    expect(() => parseGtmExport("invalid")).toThrow("JSON形式が不正です");
    expect(() => parseGtmExport(null)).toThrow("JSON形式が不正です");
    expect(() => parseGtmExport(123)).toThrow("JSON形式が不正です");
  });

  // サンプルfixture: 正常パース確認
  it("sampleフィクスチャを正しくパースできる", () => {
    const result = parseGtmExport(sampleJson);
    expect(result.tags).toHaveLength(3);
    expect(result.triggers).toHaveLength(4);
    expect(result.variables).toHaveLength(3);
    expect(result.builtInVariables).toHaveLength(2);
    expect(result.metadata.containerId).toBe("GTM-ABCDEF");
    expect(result.metadata.accountId).toBe("123456");
    expect(result.metadata.exportTime).toBe("2026-06-05 10:00:00");
  });

  // メタデータ: exportTimeがない場合はundefined
  it("exportTimeがない場合はundefined", () => {
    const result = parseGtmExport({ containerVersion: {} });
    expect(result.metadata.exportTime).toBeUndefined();
    expect(result.metadata.accountId).toBeUndefined();
    expect(result.metadata.containerId).toBeUndefined();
  });

  // containerVersionがnullの場合
  it("containerVersionがnullの場合はエラー", () => {
    expect(() => parseGtmExport({ containerVersion: null })).toThrow(
      "containerVersion が見つかりません"
    );
  });
});
