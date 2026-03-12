"use client";

import { JSX } from "react";
import { DateRangePicker } from "./date-range-picker";
import { TFilterItem } from "./factory";
import { SelectFilter } from "./select";
import TimePicker from "./time-picker";
import { DateRange } from "react-day-picker";

const FilterCollections = {
  TimePicker: (item: Extract<TFilterItem, { type: "TimePicker" }>) => <TimePicker {...item} />,
  Select: (item: Extract<TFilterItem, { type: "Select" }>) => <SelectFilter {...item} />,
  DateRangePicker: (item: Extract<TFilterItem, { type: "DateRangePicker" }>) => (
    <DateRangePicker {...item} />
  ),
};

type TFilterItemMap = {
  TimePicker: Extract<TFilterItem, { type: "TimePicker" }>;
  Select: Extract<TFilterItem, { type: "Select" }>;
  DateRangePicker: Extract<TFilterItem, { type: "DateRangePicker" }>;
};

const FilterRenderers = {
  TimePicker: (item: TFilterItemMap["TimePicker"], onChange: (value: string) => void) => (
    <FilterCollections.TimePicker {...item} onChange={onChange} />
  ),

  Select: (
    item: TFilterItemMap["Select"] & { value?: string },
    onChange: (value: string) => void,
  ) => <FilterCollections.Select {...item} onChange={onChange} />,

  DateRangePicker: (
    item: TFilterItemMap["DateRangePicker"],
    onChange: (value: string | DateRange | undefined) => void,
  ) => <FilterCollections.DateRangePicker {...item} onChange={onChange} />,
} satisfies {
  [K in keyof TFilterItemMap]: (
    item: TFilterItemMap[K] | (TFilterItemMap[K] & { value?: string }),
    onChange: (value: string | DateRange | undefined) => void,
  ) => JSX.Element;
};

export { FilterRenderers, FilterCollections };
