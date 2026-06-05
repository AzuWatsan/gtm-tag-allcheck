import type { Analyzer, AnalyzerContext, AuditIssue } from "../types/audit";
import type { GtmTrigger } from "../types/gtm";

function createUnusedTriggerIssue(trigger: GtmTrigger): AuditIssue {
  return {
    id: `unused_trigger_${trigger.triggerId ?? trigger.name}`,
    type: "unused_trigger",
    severity: "warning",
    resourceType: "trigger",
    resourceId: trigger.triggerId,
    name: trigger.name,
    detail: "このトリガーはどのタグからも参照されていません。",
    recommendation: "不要であれば削除候補です。公開前に担当者へ確認してください。",
  };
}

export const triggerAnalyzer: Analyzer = {
  analyze({ container }: AnalyzerContext): AuditIssue[] {
    // triggerId を持つトリガーのみ対象
    const allTriggers = new Map<string, GtmTrigger>();
    for (const trigger of container.triggers) {
      if (typeof trigger.triggerId === "string") {
        allTriggers.set(trigger.triggerId, trigger);
      }
    }

    // タグのfiring/blockingから参照済みIDを収集
    const usedIds = new Set<string>();
    for (const tag of container.tags) {
      for (const id of tag.firingTriggerId ?? []) {
        usedIds.add(id);
      }
      for (const id of tag.blockingTriggerId ?? []) {
        usedIds.add(id);
      }
    }

    return [...allTriggers.entries()]
      .filter(([id]) => !usedIds.has(id))
      .map(([, trigger]) => createUnusedTriggerIssue(trigger));
  },
};
