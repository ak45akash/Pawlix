export type TableSortOption = {
  value: string;
  label: string;
};

export function cmpString(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function cmpNumber(a: number, b: number) {
  return a - b;
}

export function cmpDate(a: string, b: string) {
  return a.localeCompare(b);
}

export function sortRows<T>(
  rows: readonly T[],
  value: string,
  sorters: Record<string, (a: T, b: T) => number>,
  fallback?: string,
): T[] {
  const key = sorters[value] ? value : (fallback ?? Object.keys(sorters)[0] ?? "");
  const compare = sorters[key];
  if (!compare) return [...rows];
  return [...rows].sort(compare);
}
