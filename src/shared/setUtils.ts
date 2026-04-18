export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}

export function matrixBy<T>(
  items: T[],
  rowFunc: (item: T) => string,
  colFunc: (item: T) => string,
): Record<string, Record<string, T>> {
  const matrix: Record<string, Record<string, T>> = {};
  items.forEach((item) => {
    const col = colFunc(item);
    const row = rowFunc(item);
    if (!matrix[row]) matrix[row] = {};
    matrix[row][col] = item;
  });
  return matrix;
}

export function uniqueBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];
  items.forEach((item) => {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  });
  return result;
}

export const sortBy = <T>(items: T[], keyFn: (item: T) => string | number): T[] => {
  return [...items].sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
};
