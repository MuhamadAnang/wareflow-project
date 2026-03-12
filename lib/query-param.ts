import { TSortCriterion } from "@/app/_components/data-table/sort";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export const updateQueryParam = (
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  router: AppRouterInstance,
  newParams: Record<string, string | number | null>,
) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null || value === "") {
      /* eslint-disable drizzle/enforce-delete-with-where */
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  router.push(`${pathname}?${params.toString()}`);
};

export function parseSortParams(searchParams: URLSearchParams): string | undefined {
  const sortMap: Record<number, Partial<TSortCriterion>> = {};

  for (const [paramKey, value] of searchParams.entries()) {
    const match = /^sort\[(\d+)\]\[(key|direction)\]$/.exec(paramKey);

    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!sortMap[index]) {
      sortMap[index] = {};
    }

    if (field === "key") {
      sortMap[index].key = value;
    }

    if (field === "direction" && (value === "asc" || value === "desc")) {
      sortMap[index].direction = value;
    }
  }

  const result: TSortCriterion[] = [];

  for (const item of Object.values(sortMap)) {
    if (item.key && item.direction) {
      result.push({
        key: item.key,
        direction: item.direction,
      });
    }
  }

  const finalResult = result.map(({ key, direction }) => `${key}:${direction}`);

  return finalResult.length > 0 ? finalResult.join(",") : undefined;
}
