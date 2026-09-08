const ALLOWED = new Set(['type','description','properties','required','items','enum','format','nullable']);
export function toGeminiSchema(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(toGeminiSchema);
  const source = value as Record<string, unknown>; const out: Record<string, unknown> = {};
  for (const key of Object.keys(source)) if (ALLOWED.has(key)) {
    if (key === 'properties' && source[key] && typeof source[key] === 'object') {
      const props: Record<string, unknown> = {};
      for (const [name, schema] of Object.entries(source[key] as Record<string, unknown>)) props[name] = toGeminiSchema(schema);
      out[key] = props;
    } else out[key] = toGeminiSchema(source[key]);
  }
  if (typeof out.type === 'string') out.type = out.type.toUpperCase();
  return out;
}