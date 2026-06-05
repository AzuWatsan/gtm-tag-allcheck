/** オブジェクト・配列を再帰的に走査し、文字列値にcallbackを呼ぶ */
export function walkStrings(value: unknown, callback: (s: string) => void): void {
  if (typeof value === "string") {
    callback(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkStrings(item, callback);
    }
    return;
  }
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) {
      walkStrings(child, callback);
    }
  }
}
