const VARIABLE_REFERENCE_REGEX = /\{\{\s*([^}]+?)\s*\}\}/g;

/** 文字列中の {{Variable Name}} 形式の参照を抽出する */
export function extractVariableReferences(value: string): string[] {
  const results: string[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(VARIABLE_REFERENCE_REGEX.source, "g");

  while ((match = regex.exec(value)) !== null) {
    results.push(match[1].trim());
  }

  return results;
}
