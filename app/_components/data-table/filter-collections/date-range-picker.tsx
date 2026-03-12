"use client";

import { type DateRange } from "react-day-picker";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useRef, useState } from "react";
import { ArrowLeftRight, Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";

export type TDateRangePickerProps = {
  onChange?: (dateRange: DateRange | undefined) => void;
  defaultValue?: DateRange;
  format?: string;
  value?: DateRange;
};

export const DateRangePicker = ({
  onChange,
  defaultValue,
  format: dateFormat = "MM/dd/yyyy",
}: TDateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultValue);
  const [isHovered, setIsHovered] = useState(false);
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const [activeField, setActiveField] = useState<"start" | "end" | null>(null);
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    setDateRange(undefined);
    onChange?.(undefined);
  };

  const handleEndDateClick = (e: React.MouseEvent) => {
    if (!dateRange?.from) {
      e.preventDefault();
      e.stopPropagation();
      setActiveField("start");
      startInputRef.current?.click();
    } else {
      setActiveField("end");
    }
  };

  const normalizeRange = (
    range: DateRange | undefined,
    prev: DateRange | undefined,
  ): DateRange | undefined => {
    if (!range) return undefined;

    if (!prev?.from && range.from && range.to) {
      return { from: range.from, to: undefined };
    }

    if (prev?.from && range.to) {
      return range;
    }

    return range;
  };

  const handleStartFocus = () => {
    if (dateRange?.from && dateRange?.to) {
      setDateRange(undefined);
      onChange?.(undefined);
    }
    setActiveField("start");
  };

  const handleStartClick = () => {
    if (dateRange?.from && dateRange?.to) {
      setDateRange(undefined);
      onChange?.(undefined);
    }
    setActiveField("start");
  };

  const handleOnSelect = (range: DateRange | undefined) => {
    let next = normalizeRange(range, dateRange);

    if (activeField === "start") {
      next = {
        from: range?.from,
        to: undefined,
      };
    }

    setDateRange(next);
    onChange?.(next);

    if (next?.from && !next?.to) {
      setActiveField("end");
    }

    if (next?.from && next?.to) {
      setActiveField(null);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={
            "flex items-center h-9 rounded-md border bg-transparent shadow-xs outline-none"
          }
          onClick={() => setOpen((prev) => !prev)}
        >
          <Input
            ref={startInputRef}
            readOnly
            placeholder="Start date"
            className={cn(
              "relative border-0 rounded-l-md rounded-r-none shadow-none focus-visible:ring-0",
              "bg-[linear-gradient(var(--color-primary)_0_0)] bg-no-repeat",
              "bg-size-[0_2px] bg-position-[0_100%]",
              "transition-[background-size] duration-300 ease-out",
              activeField === "start" && "bg-size-[100%_2px]",
            )}
            value={dateRange?.from ? format(dateRange.from, dateFormat) : ""}
            onClick={handleStartClick}
            onFocus={handleStartFocus}
          />
          <div className="px-2 py-2 text-muted-foreground">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <Input
            readOnly
            placeholder="End date"
            className={cn(
              "relative border-0 rounded-none shadow-none focus-visible:ring-0",
              "bg-[linear-gradient(var(--color-primary)_0_0)] bg-no-repeat",
              "bg-size-[0_2px] bg-position-[0_100%]",
              "transition-[background-size] duration-300 ease-out",
              activeField === "end" && "bg-size-[100%_2px]",
            )}
            value={dateRange?.to ? format(dateRange.to, dateFormat) : ""}
            onClick={handleEndDateClick}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-l-none rounded-r-md focus-visible:ring-0 focus-visible:shadow-none shadow-none hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && dateRange ? (
              <X className="h-4 w-4" />
            ) : (
              <CalendarIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={dateRange}
          animate
          onSelect={handleOnSelect}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};
