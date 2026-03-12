"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  type Table as TableType,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useMemo } from "react";
import Loading from "../loading";
import { useIsMobile } from "../../_hooks/use-mobile";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SortButton, TSortCriterion, TSortOption } from "./sort";
import { Search } from "./search";
import { TFilterItem } from "./filter-collections/factory";
import { FilterTable } from "./filter";
import { DateRange } from "react-day-picker";
import { TPaginationResponse } from "@/types/meta";

export type TFilterValue =
  | string
  | number
  | boolean
  | DateRange
  | undefined
  | Array<string | number>;

interface IDataTableProps<TData, TValue = unknown> {
  source?: TPaginationResponse<TData>;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  placeholderSearch?: string;
  search?: string;
  pagination: {
    page: number;
    pageSize: number;
  };
  isSearchable?: boolean;
  filterComponents?: TFilterItem[];
  handleChange: {
    onFilterChange: (value: Record<string, TFilterValue>) => void;
    onSortingChange: (sorts: TSortCriterion[]) => void;
    onPaginationChange: (page: number, pageSize: number) => void;
    onSearch: (searchTerm: string) => void;
  };
  sortOptions?: Array<TSortOption>;
  sortDefaultValue?: TSortCriterion[];
  selectable?: boolean;
}

const DataTable = <TData, TValue = unknown>(props: IDataTableProps<TData, TValue>) => {
  const {
    columns,
    source,
    pagination,
    isLoading,
    isSearchable,
    filterComponents,
    handleChange,
    search,
    sortOptions,
    sortDefaultValue,
    placeholderSearch,
    selectable,
  } = props;
  const { data = [], meta } = source || {};
  const { page, pageSize } = pagination;
  const { total } = meta || {};

  const pageCount = useMemo(() => {
    if (!total || !pageSize) return 0;
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
    },
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });

  const showHeader = useMemo(() => {
    return isSearchable || Boolean(filterComponents) || Boolean(sortOptions);
  }, [isSearchable, filterComponents, sortOptions]);

  return (
    <Card className="gap-3 shadow-none">
      {showHeader && (
        <CardHeader className="flex gap-2">
          {isSearchable && (
            <Search
              search={search || ""}
              placeholderSearch={placeholderSearch}
              onSearchChange={handleChange.onSearch}
            />
          )}

          {sortOptions && (
            <SortButton
              sortOptions={sortOptions}
              defaultValue={sortDefaultValue}
              onSortChange={handleChange.onSortingChange}
            />
          )}

          {filterComponents && (
            <FilterTable filterItems={filterComponents} onChange={handleChange.onFilterChange} />
          )}
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-background border-none" key={headerGroup.id}>
                {headerGroup.headers
                  .filter((header) => !(header.id === "select" && !selectable))
                  .map((header, index) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={index === 0 ? "pl-6" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading && <TableLoading colSpan={columns.length} />}
          {!isLoading && data && data.length === 0 && <TableEmpty colSpan={columns.length} />}
          {!isLoading && data && data.length > 0 && (
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row
                    .getVisibleCells()
                    .filter((cell) => !(cell.column.id === "select" && !selectable))
                    .map((cell, index) => (
                      <TableCell key={cell.id} className={index === 0 ? "pl-6" : ""}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
      <TablePagination
        table={table}
        onPageChange={handleChange.onPaginationChange}
        totalItems={total}
      />
    </Card>
  );
};

const TableLoading = ({ colSpan }: { colSpan: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24">
          <Loading isFullscreen={false} />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

const TableEmpty = ({ colSpan }: { colSpan: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          No data found.
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

interface IPaginationProps<TData> {
  table: TableType<TData>;
  pageSizeOptions?: number[];
  onPageChange: (page: number, pageSize: number) => void;
  totalItems?: number;
}

const TablePagination = <TData,>(props: IPaginationProps<TData>) => {
  const { table, pageSizeOptions = [10, 20, 30, 40, 50], onPageChange, totalItems } = props;
  const { getState, getPageCount } = table;
  const { pageIndex, pageSize } = getState().pagination;
  const pageCount = getPageCount();

  const isMobile = useIsMobile();
  const pageRange = isMobile ? 1 : 2;
  const start = pageIndex * pageSize - pageSize + 1;
  const hasData = (totalItems ?? 0) > 0;

  const generatePageNumbers = (): (number | string)[] => {
    const maxVisiblePages = !isMobile ? 3 : 6;

    if (pageCount <= maxVisiblePages) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (pageIndex <= pageRange + 1) {
      pages.push(...Array.from({ length: pageRange + 2 }, (_, i) => i + 1), "...");
    } else if (pageIndex >= pageCount - pageRange) {
      pages.push(
        "...",
        ...Array.from({ length: pageRange + 2 }, (_, i) => pageCount - pageRange - 1 + i),
      );
    } else {
      pages.push("...", pageIndex - pageRange, pageIndex, pageIndex + pageRange, "...");
    }

    return pages;
  };

  const handleEllipsisClick = (index: number) => {
    const isFirstEllipsis = index === 0;
    const jumpAmount = Math.floor(pageCount / 3);
    const newPage = isFirstEllipsis
      ? Math.max(1, pageIndex - jumpAmount)
      : Math.min(pageCount, pageIndex + jumpAmount);
    onPageChange?.(newPage, pageSize);
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (typeof page === "number") {
      return (
        <Button
          variant={pageIndex === page ? "default" : "outline"}
          className="h-8 w-8"
          onClick={() => onPageChange?.(page, pageSize)}
          disabled={!hasData}
        >
          {page}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="h-8 w-8"
        onClick={() => handleEllipsisClick(index)}
        disabled={!hasData}
      >
        {page}
      </Button>
    );
  };

  return (
    <CardFooter className="flex w-full flex-col items-center justify-center gap-5 lg:flex-row lg:justify-between">
      <div className="flex w-full items-center justify-center gap-3 lg:w-max">
        <div className="w-20">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageChange?.(pageIndex, Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={pageSize || 0} />
            </SelectTrigger>
            <SelectContent position="popper">
              {!pageSizeOptions.includes(pageSize) && (
                <SelectItem key={pageSize} value={String(pageSize)} hidden>
                  {pageSize || 0}
                </SelectItem>
              )}
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size || 0}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-3 lg:w-min lg:flex-row">
        <p className="lg:w-max lg:flex-1">{`${Math.min(start || 1, totalItems || 0)}-${Math.min(start + pageSize - 1, totalItems || 0)} of ${totalItems || 0} items`}</p>
        <Pagination className="lg:flex-1">
          <PaginationContent className="max-lg:flex max-lg:flex-wrap">
            <PaginationItem>
              <Button
                variant="outline"
                className="h-8 w-8"
                onClick={() => onPageChange(1, pageSize)}
                disabled={pageIndex === 1 || !hasData}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                className="h-8 w-8"
                onClick={() => onPageChange(pageIndex - 1, pageSize)}
                disabled={pageIndex === 1 || !hasData}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>

            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>{renderPageButton(page, index)}</PaginationItem>
            ))}

            <PaginationItem>
              <Button
                variant="outline"
                className="h-8 w-8"
                onClick={() => onPageChange(pageIndex + 1, pageSize)}
                disabled={pageIndex === pageCount || !hasData}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                className="h-8 w-8"
                onClick={() => onPageChange(pageCount, pageSize)}
                disabled={pageIndex === pageCount || !hasData}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </CardFooter>
  );
};

export default DataTable;
