import { describe, it, expect } from "vitest";
import { triggerAnalyzer } from "../../analyzers/triggerAnalyzer";
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

describe("triggerAnalyzer", () => {
  // TC-TRIGGER-001
  it("参照されていないトリガーを検出する", () => {
    const container = makeContainer({
      tags: [{ name: "GA4_PageView", firingTriggerId: ["10"] }],
      triggers: [
        { triggerId: "10", name: "All Pages" },
        { triggerId: "11", name: "Old Thanks" },
      ],
    });
    const issues = triggerAnalyzer.analyze({ container });
    expect(issues).toHaveLength(1);
    expect(issues[0].name).toBe("Old Thanks");
    expect(issues[0].type).toBe("unused_trigger");
  });

  // TC-TRIGGER-002
  it("全トリガーが使用済みなら0件", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", firingTriggerId: ["10"] }],
      triggers: [{ triggerId: "10", name: "All Pages" }],
    });
    expect(triggerAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-TRIGGER-003
  it("blockingTriggerIdも使用済みとして扱う", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", firingTriggerId: ["10"], blockingTriggerId: ["11"] }],
      triggers: [
        { triggerId: "10", name: "Firing" },
        { triggerId: "11", name: "Blocking" },
      ],
    });
    expect(triggerAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-TRIGGER-004
  it("タグが0件なら全トリガーが未使用", () => {
    const container = makeContainer({
      tags: [],
      triggers: [
        { triggerId: "10", name: "Trigger A" },
        { triggerId: "11", name: "Trigger B" },
      ],
    });
    expect(triggerAnalyzer.analyze({ container })).toHaveLength(2);
  });

  // TC-TRIGGER-005
  it("トリガーが0件なら0件", () => {
    const container = makeContainer({
      tags: [{ name: "Tag", firingTriggerId: ["10"] }],
      triggers: [],
    });
    expect(triggerAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-TRIGGER-006
  it("triggerIdがないトリガーはスキップしてもクラッシュしない", () => {
    const container = makeContainer({
      tags: [],
      triggers: [{ name: "No ID Trigger" }], // triggerIdなし
    });
    expect(() => triggerAnalyzer.analyze({ container })).not.toThrow();
    expect(triggerAnalyzer.analyze({ container })).toHaveLength(0);
  });
});
