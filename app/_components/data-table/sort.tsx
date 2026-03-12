"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";

export type TSortDirection = "asc" | "desc";

export type TSortOption = {
  label: string;
  key: string;
  options: Array<{
    label: string;
    direction: TSortDirection;
  }>;
};

export type TSortCriterion = {
  key: string;
  direction: TSortDirection;
};

interface ISortButtonProps {
  sortOptions: TSortOption[];
  defaultValue?: TSortCriterion[];
  onSortChange?: (sorts: TSortCriterion[]) => void;
}

export const SortButton = ({ sortOptions, defaultValue, onSortChange }: ISortButtonProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    transformSortCriterionToString(defaultValue),
  );

  const handleSelect = (key: string, direction: TSortDirection) => {
    const newValue = `${key}:${direction}`;

    setSelectedValues((prev) => {
      if (prev.includes(newValue)) {
        return prev.filter((v) => v !== newValue);
      }

      const cleanPrev = prev.filter((item) => !item.startsWith(`${key}:`));

      return [...cleanPrev, newValue];
    });
  };

  const getActiveSortCount = useMemo(() => {
    return () => {
      return defaultValue ? defaultValue.length : 0;
    };
  }, [defaultValue]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownUp className="h-4 w-4" />
          Sort{" "}
          {getActiveSortCount() > 0 && (
            <Badge className="ml-1" variant={"info"}>
              {getActiveSortCount()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="p-2 border-none rounded-none gap-1 shadow-none">
          <CardContent className="p-0 bg-transparent">
            {sortOptions.map((sortOption) => (
              <DropdownMenuGroup key={sortOption.key}>
                <DropdownMenuLabel>{sortOption.label}</DropdownMenuLabel>

                {sortOption.options.map((option) => {
                  const itemValue = `${sortOption.key}:${option.direction}`;
                  const isChecked = selectedValues.includes(itemValue);

                  return (
                    <DropdownMenuCheckboxItem
                      key={`${sortOption.key}:${option.direction}`}
                      checked={isChecked}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleSelect(sortOption.key, option.direction);
                      }}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  );
                })}

                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center p-0">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                onSortChange?.([]);
                setSelectedValues([]);
              }}
            >
              Reset
            </Button>
            <Button
              size={"sm"}
              onClick={() => {
                const sorts: TSortCriterion[] = selectedValues.map((value) => {
                  const [key, direction] = value.split(":") as [string, TSortDirection];
                  return { key, direction };
                });
                onSortChange?.(sorts);
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

const transformSortCriterionToString = (sorts: TSortCriterion[] | undefined): string[] => {
  if (!sorts) return [];
  return sorts.map((sort) => `${sort.key}:${sort.direction}`);
};
