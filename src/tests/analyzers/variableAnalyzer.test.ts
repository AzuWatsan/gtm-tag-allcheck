import { describe, it, expect } from "vitest";
import { variableAnalyzer } from "../../analyzers/variableAnalyzer";
import { extractVariableReferences } from "../../utils/variableReference";
import { walkStrings } from "../../utils/deepWalk";
import type { NormalizedGtmContainer } from "../../types/gtm";

function makeContainer(partial: Partial<NormalizedGtmContainer>): NormalizedGtmContainer {
  return {
    tags: [],
    triggers: [],
    variables: [],
    builtInVariables: [],
    metadata: {},
    ...partial,
  };
}

describe("extractVariableReferences", () => {
  it("{{Variable}} を抽出する", () => {
    expect(extractVariableReferences("{{My Variable}}")).toEqual(["My Variable"]);
  });

  it("スペース付き {{ Variable }} も抽出する", () => {
    expect(extractVariableReferences("{{ My Variable }}")).toEqual(["My Variable"]);
  });

  it("複数参照 {{A}}-{{B}} を抽出する", () => {
    expect(extractVariableReferences("{{A}}-{{B}}")).toEqual(["A", "B"]);
  });

  it("prefix-{{Variable}}-suffix も抽出する", () => {
    expect(extractVariableReferences("prefix-{{Variable}}-suffix")).toEqual(["Variable"]);
  });

  it("参照がなければ空配列", () => {
    expect(extractVariableReferences("plain text")).toEqual([]);
  });
});

describe("walkStrings", () => {
  it("文字列を直接コールバックする", () => {
    const results: string[] = [];
    walkStrings("hello", (s) => results.push(s));
    expect(results).toEqual(["hello"]);
  });

  it("配列を再帰走査する", () => {
    const results: string[] = [];
    walkStrings(["a", "b"], (s) => results.push(s));
    expect(results).toEqual(["a", "b"]);
  });

  it("オブジェクトを再帰走査する", () => {
    const results: string[] = [];
    walkStrings({ key: "value", nested: { deep: "text" } }, (s) => results.push(s));
    expect(results).toContain("value");
    expect(results).toContain("text");
  });
});

describe("variableAnalyzer", () => {
  // TC-VAR-001
  it("参照されていない変数を検出する", () => {
    const container = makeContainer({
      variables: [{ variableId: "1", name: "Old Variable" }],
    });
    const issues = variableAnalyzer.analyze({ container });
    expect(issues).toHaveLength(1);
    expect(issues[0].name).toBe("Old Variable");
    expect(issues[0].type).toBe("unused_variable");
  });

  // TC-VAR-002
  it("タグのparameterで参照されている変数は未使用にしない", () => {
    const container = makeContainer({
      tags: [{
        name: "HTML Tag",
        parameter: [{ key: "html", value: "<script>{{My Variable}}</script>" }],
      }],
      variables: [{ variableId: "1", name: "My Variable" }],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-VAR-003
  it("トリガーのfilterで参照されている変数は未使用にしない", () => {
    const container = makeContainer({
      triggers: [{ name: "Trigger", filter: [{ value: "{{Page Variable}}" }] }],
      variables: [{ variableId: "1", name: "Page Variable" }],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-VAR-004
  it("別の変数から参照されている変数は未使用にしない", () => {
    const container = makeContainer({
      variables: [
        { variableId: "1", name: "Base Var" },
        { variableId: "2", name: "Wrapper Var", parameter: [{ value: "{{Base Var}}" }] },
      ],
    });
    const issues = variableAnalyzer.analyze({ container });
    expect(issues.map((i) => i.name)).not.toContain("Base Var");
  });

  // TC-VAR-005
  it("{{ スペース付き }} も参照として検出する", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", parameter: [{ value: "{{ My Variable }}" }] }],
      variables: [{ variableId: "1", name: "My Variable" }],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-VAR-006
  it("複数参照 {{A}}{{B}} を両方検出する", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", parameter: [{ value: "{{A}}-{{B}}" }] }],
      variables: [
        { variableId: "1", name: "A" },
        { variableId: "2", name: "B" },
      ],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-VAR-007
  it("builtInVariableは未使用チェック対象外", () => {
    const container = makeContainer({
      builtInVariables: [{ type: "PAGE_URL", name: "Page URL" }],
      variables: [],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-VAR-008
  it("変数名をそのままテキストで含む文字列は参照とみなさない", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", parameter: [{ value: "My Variable" }] }],
      variables: [{ variableId: "1", name: "My Variable" }],
    });
    expect(variableAnalyzer.analyze({ container })).toHaveLength(1);
  });
});
