"use client";

import { ReactNode } from "react";
import { Label } from "../../ui/label";
import { IFilterTableProps } from "../filter";
import { TFilterValue } from "../index";
import { FilterCollections, FilterRenderers } from ".";
import { TTimePickerProps } from "./time-picker";
import { TSelectFilterProps } from "./select";
import { TDateRangePickerProps } from "./date-range-picker";

type TBaseFilterItem<P extends Record<string, unknown>> = P & {
  name: string;
  label: string;
  defaultValue?: unknown;
};

type TTypedFilterItem<
  P extends Record<string, unknown>,
  T extends keyof typeof FilterCollections,
> = TBaseFilterItem<P> & {
  type: T;
};

export type TFilterItem =
  | TTypedFilterItem<TTimePickerProps, "TimePicker">
  | TTypedFilterItem<TSelectFilterProps, "Select">
  | TTypedFilterItem<TDateRangePickerProps, "DateRangePicker">;

interface IComponentFilterProps<T extends TFilterItem> {
  item: T;
  content: ReactNode;
}

const ComponentFilter = <T extends TFilterItem>({ item, content }: IComponentFilterProps<T>) => {
  return (
    <div className="mb-2 last:mb-0">
      <Label className="mb-1">{item.label}</Label>
      {content}
    </div>
  );
};

export const FilterInputFactory = (
  props: IFilterTableProps & { filterValues?: Record<string, TFilterValue> },
) => {
  const { filterItems, onChange, filterValues = {} } = props;

  return filterItems.map((filterItem) => {
    switch (filterItem.type) {
      case "TimePicker":
        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.TimePicker(filterItem, (value) => {
              onChange({ [filterItem.name]: value });
            })}
          />
        );

      case "Select":
        const selectItem = {
          ...filterItem,
          value: (filterValues[filterItem.name] as string) || "",
        };

        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.Select(selectItem, (value) =>
              onChange({ [filterItem.name]: value }),
            )}
          />
        );

      case "DateRangePicker":
        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.DateRangePicker(filterItem, (value) =>
              onChange({ [filterItem.name]: value }),
            )}
          />
        );
    }
  });
};
