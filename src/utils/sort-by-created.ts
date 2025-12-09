// Small utility to sort arrays by `created` timestamp (most recent first)
export function sortMostRecentFirst<T extends { created?: string }>(items: T[] | undefined): T[] {
  if (!items || items.length === 0) return [];
  return items.slice().sort((a, b) => {
    const ta = new Date(a.created ?? 0).getTime();
    const tb = new Date(b.created ?? 0).getTime();
    return tb - ta;
  });
}

