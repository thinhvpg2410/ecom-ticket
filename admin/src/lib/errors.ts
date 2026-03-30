/**
 * Supabase/PostgREST trả về object `{ message, code, details, hint }` — không phải `Error`,
 * nên `String(err)` thành "[object Object]".
 */
export function formatSupabaseError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (err && typeof err === "object") {
    const o = err as {
      message?: string;
      code?: string;
      details?: string;
      hint?: string;
    };
    if (typeof o.message === "string" && o.message.length > 0) {
      const parts: string[] = [o.message];
      if (o.code) {
        parts.push(`(mã ${o.code})`);
      }
      if (o.details) {
        parts.push(o.details);
      }
      if (o.hint) {
        parts.push(`Gợi ý: ${o.hint}`);
      }
      return parts.join(" ");
    }
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
