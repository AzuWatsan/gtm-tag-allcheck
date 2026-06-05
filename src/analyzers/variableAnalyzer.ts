import type { Analyzer, AnalyzerContext, AuditIssue } from "../types/audit";
import type { GtmVariable } from "../types/gtm";
import { walkStrings } from "../utils/deepWalk";
import { extractVariableReferences } from "../utils/variableReference";

function createUnusedVariableIssue(variable: GtmVariable): AuditIssue {
  return {
    id: `unused_variable_${variable.variableId ?? variable.name}`,
    type: "unused_variable",
    severity: "warning",
    resourceType: "variable",
    resourceId: variable.variableId,
    name: variable.name,
    detail: "この変数はタグ・トリガー・他の変数から参照されていません。",
    recommendation: "不要であれば削除候補です。過去施策や一時停止タグとの関係を確認してください。",
  };
}

export const variableAnalyzer: Analyzer = {
  analyze({ container }: AnalyzerContext): AuditIssue[] {
    const variableNames = new Set(container.variables.map((v) => v.name));
    const referenced = new Set<string>();

    // タグ・トリガー・変数を再帰走査して {{...}} 参照を収集
    const targets = [
      ...container.tags,
      ...container.triggers,
      ...container.variables,
    ];

    for (const resource of targets) {
      walkStrings(resource, (text) => {
        for (const ref of extractVariableReferences(text)) {
          referenced.add(ref);
        }
      });
    }

    return container.variables
      .filter((v) => variableNames.has(v.name) && !referenced.has(v.name))
      .map(createUnusedVariableIssue);
  },
};
