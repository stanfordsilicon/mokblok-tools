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
