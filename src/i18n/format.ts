export function tf(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}

export function tfPlural(
  n: number,
  one: string,
  other: string,
  params: Record<string, string | number>
): string {
  return tf(n === 1 ? one : other, params);
}
