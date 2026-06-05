import type { Analyzer, AnalyzerContext, AuditIssue } from "../types/audit";
import type { GtmTag } from "../types/gtm";

function createPausedTagIssue(tag: GtmTag): AuditIssue {
  return {
    id: `paused_tag_${tag.tagId ?? tag.name}`,
    type: "paused_tag",
    severity: "info",
    resourceType: "tag",
    resourceId: tag.tagId,
    name: tag.name,
    detail: "このタグは一時停止中です。",
    recommendation: "今後利用予定がなければ削除候補です。",
  };
}

export const pausedAnalyzer: Analyzer = {
  analyze({ container }: AnalyzerContext): AuditIssue[] {
    return container.tags
      .filter((tag) => tag.paused === true)
      .map(createPausedTagIssue);
  },
};
