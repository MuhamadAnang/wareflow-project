"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FilterInputFactory, TFilterItem } from "./filter-collections/factory";
import { TFilterValue } from ".";
import { useMemo, useState, ReactNode } from "react";
import { Badge } from "../ui/badge";
import { isValidFilterValue, EMPTY_VALUE } from "./filter-utils";

export interface IFilterTableProps {
  filterItems: TFilterItem[];
  onChange: (value: Record<string, TFilterValue>) => void;
  trigger?: ReactNode | ((count: number) => ReactNode);
  showCount?: boolean;
}

const initializeFilterValues = (filterItems: TFilterItem[]): Record<string, TFilterValue> => {
  return filterItems.reduce<Record<string, TFilterValue>>((acc, item) => {
    if (isValidFilterValue(item.value)) {
      acc[item.name] = item.value as TFilterValue;
    }
    return acc;
  }, {});
};

const resetFilterValues = (filterItems: TFilterItem[]): Record<string, TFilterValue> => {
  return filterItems.reduce<Record<string, TFilterValue>>((acc, item) => {
    acc[item.name] =
      item.defaultValue !== undefined ? (item.defaultValue as TFilterValue) : EMPTY_VALUE;
    return acc;
  }, {});
};

const FilterCountBadge = ({ count, showCount = true }: { count: number; showCount?: boolean }) => {
  if (!showCount || count === 0) return null;

  return (
    <Badge className="ml-1" variant={"info"}>
      {count}
    </Badge>
  );
};

export const FilterTable = (props: IFilterTableProps) => {
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, TFilterValue>>(() =>
    initializeFilterValues(props.filterItems),
  );

  const handleInputChange = (value: Record<string, TFilterValue>) => {
    setLocalFilterValues((prev) => ({ ...prev, ...value }));
  };

  const activeFilterCount = useMemo(() => {
    return props.filterItems.filter((item) => isValidFilterValue(item.value)).length;
  }, [props.filterItems]);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <ListFilter className="h-4 w-4" />
      Filter{" "}
      {props.showCount !== false && activeFilterCount > 0 && (
        <FilterCountBadge count={activeFilterCount} />
      )}
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {typeof props.trigger === "function"
          ? props.trigger(activeFilterCount)
          : props.trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="p-2 border-none rounded-none gap-1 shadow-none">
          <CardContent className="p-0 bg-transparent">
            <FilterInputFactory
              {...props}
              onChange={handleInputChange}
              filterValues={localFilterValues}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center p-0 mt-2">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                const resetValues = resetFilterValues(props.filterItems);
                props.onChange(resetValues);
                setLocalFilterValues(resetValues);
              }}
            >
              Reset
            </Button>
            <Button
              size={"sm"}
              onClick={() => {
                props.onChange(localFilterValues);
              }}
            >
              Apply
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
