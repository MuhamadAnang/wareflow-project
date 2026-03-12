"use client";

import { updateQueryParam } from "@/lib/query-param";
import { parseQueryParams } from "@/lib/validation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import z, { ZodSchema } from "zod";
import { TSortCriterion } from "../_components/data-table/sort";
import { TFilterValue } from "../_components/data-table";
import { useDebounce } from "./use-debounce";

export const useFilters = (schema: ZodSchema) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const validFilters = useMemo(() => {
    const result = parseQueryParams(schema, Object.fromEntries(searchParams.entries()));
    return result.success ? result.data : {};
  }, [searchParams, schema]);

  const updateUrl = useCallback(
    (params: Record<string, z.infer<typeof schema>>) => {
      updateQueryParam(searchParams, pathname, router, params);
    },
    [searchParams, pathname, router],
  );

  const debouncedUpdateSearch = useDebounce((value: string) => {
    updateUrl({
      search: value || null,
      page: 1,
    });
  }, 500);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      debouncedUpdateSearch(searchTerm);
    },
    [debouncedUpdateSearch],
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      updateUrl({
        page: page > 0 ? page : null,
        pageSize: pageSize > 0 ? pageSize : null,
      });
    },
    [updateUrl],
  );

  const handleSortingChange = useCallback(
    (sorts: TSortCriterion[]) => {
      const sortValue = sorts.map((s) => `${s.key}:${s.direction}`).join(",");
      updateUrl({
        sort: sortValue || null,
        page: 1,
      });
    },
    [updateUrl],
  );

  const handleFilterChange = useCallback(
    (filters: Record<string, TFilterValue>) => {
      const updatedFilters: Record<string, z.infer<typeof schema>> = { page: 1 };

      Object.keys(validFilters).forEach((key) => {
        if (key !== "page" && key !== "pageSize" && key !== "search" && key !== "sort") {
          updatedFilters[key] = null;
        }
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          updatedFilters[key] = null;
        } else {
          updatedFilters[key] = value as z.infer<typeof schema>;
        }
      });

      updateUrl(updatedFilters);
    },
    [updateUrl, validFilters],
  );

  const pagination = useMemo(
    () => ({
      page: typeof validFilters.page === "number" && validFilters.page > 0 ? validFilters.page : 1,
      pageSize:
        typeof validFilters.pageSize === "number" && validFilters.pageSize > 0
          ? validFilters.pageSize
          : 10,
    }),
    [validFilters.page, validFilters.pageSize],
  );

  const handlers = useMemo(
    () => ({
      onFilterChange: handleFilterChange,
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onSearch: handleSearch,
    }),
    [handlePaginationChange, handleSearch, handleSortingChange, handleFilterChange],
  );

  useEffect(() => {
    let needsUpdate = false;

    Object.keys(validFilters).forEach((key) => {
      const value = validFilters[key];

      if (value === null || value === undefined) return;

      if (!searchParams.has(key)) {
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      updateUrl(validFilters);
    }
  }, [validFilters, searchParams, updateUrl]);

  return {
    search: typeof validFilters.search === "string" ? validFilters.search : "",
    handleChange: handlers,
    pagination,
    filters: validFilters,
  };
};
