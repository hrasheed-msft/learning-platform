/**
 * Safely extract options from round content.
 * Handles cases where options is a stringified JSON array (double-encoded in DB).
 */
export function getOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not valid JSON
    }
  }
  return [];
}
