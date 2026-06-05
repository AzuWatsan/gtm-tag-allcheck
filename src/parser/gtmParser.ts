import type { NormalizedGtmContainer, GtmTag, GtmTrigger, GtmVariable, GtmBuiltInVariable } from "../types/gtm";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * GTMエクスポートJSONをパースし、正規化されたコンテナを返す。
 * - containerVersionが存在しない場合はエラーをthrow
 * - tag/trigger/variable/builtInVariableが配列でない場合は空配列として扱う
 */
export function parseGtmExport(input: unknown): NormalizedGtmContainer {
  if (!isObject(input)) {
    throw new Error("JSON形式が不正です");
  }

  const cv = input["containerVersion"];
  if (!isObject(cv)) {
    throw new Error("containerVersion が見つかりません");
  }

  return {
    tags: Array.isArray(cv["tag"]) ? (cv["tag"] as GtmTag[]) : [],
    triggers: Array.isArray(cv["trigger"]) ? (cv["trigger"] as GtmTrigger[]) : [],
    variables: Array.isArray(cv["variable"]) ? (cv["variable"] as GtmVariable[]) : [],
    builtInVariables: Array.isArray(cv["builtInVariable"])
      ? (cv["builtInVariable"] as GtmBuiltInVariable[])
      : [],
    metadata: {
      exportTime: typeof input["exportTime"] === "string" ? input["exportTime"] : undefined,
      accountId: typeof cv["accountId"] === "string" ? cv["accountId"] : undefined,
      containerId: typeof cv["containerId"] === "string" ? cv["containerId"] : undefined,
    },
  };
}
