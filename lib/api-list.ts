type DataContainer<T> = {
  data?: T[] | DataContainer<T>;
};

export function getApiList<T>(source: unknown): T[] {
  if (!source) return [];
  if (Array.isArray(source)) return source as T[];

  const data = (source as DataContainer<T>).data;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const nestedData = (data as DataContainer<T>).data;
    if (Array.isArray(nestedData)) return nestedData;
  }

  return [];
}
