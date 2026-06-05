import { describe, it, expect } from "vitest";
import { pausedAnalyzer } from "../../analyzers/pausedAnalyzer";
import type { NormalizedGtmContainer } from "../../types/gtm";

function makeContainer(partial: Partial<NormalizedGtmContainer>): NormalizedGtmContainer {
  return { tags: [], triggers: [], variables: [], builtInVariables: [], metadata: {}, ...partial };
}

describe("pausedAnalyzer", () => {
  // TC-PAUSED-001
  it("paused:true のタグを検出する", () => {
    const container = makeContainer({
      tags: [{ tagId: "1", name: "Yahoo_CV_old", paused: true }],
    });
    const issues = pausedAnalyzer.analyze({ container });
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("paused_tag");
    expect(issues[0].name).toBe("Yahoo_CV_old");
    expect(issues[0].severity).toBe("info");
  });

  // TC-PAUSED-002
  it("paused:false のタグは検出しない", () => {
    const container = makeContainer({
      tags: [{ name: "Active Tag", paused: false }],
    });
    expect(pausedAnalyzer.analyze({ container })).toHaveLength(0);
  });

  // TC-PAUSED-003
  it("pausedフィールドがないタグは検出しない", () => {
    const container = makeContainer({
      tags: [{ name: "No Paused Field" }],
    });
    expect(pausedAnalyzer.analyze({ container })).toHaveLength(0);
  });

  it("複数の停止中タグをすべて検出する", () => {
    const container = makeContainer({
      tags: [
        { tagId: "1", name: "Paused A", paused: true },
        { tagId: "2", name: "Active", paused: false },
        { tagId: "3", name: "Paused B", paused: true },
      ],
    });
    const issues = pausedAnalyzer.analyze({ container });
    expect(issues).toHaveLength(2);
    expect(issues.map((i) => i.name)).toEqual(["Paused A", "Paused B"]);
  });
});
