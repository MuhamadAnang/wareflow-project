"use client";

import { useState } from "react";
import { Clock, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";

type TTimeFormat = "24h" | "12h";

export type TTimePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  format?: TTimeFormat;
  allowClear?: boolean;
};

export default function TimePicker({
  value,
  onChange,
  format = "12h",
  allowClear = false,
}: TTimePickerProps) {
  const emptyValue = "-- : -- : --";
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(value || emptyValue);
  const [isHovered, setIsHovered] = useState(false);
  const [isHourSet, setIsHourSet] = useState(value && value !== emptyValue);
  const [isMinuteSet, setIsMinuteSet] = useState(value && value !== emptyValue);
  const [isSecondSet, setIsSecondSet] = useState(value && value !== emptyValue);

  const parseTime = (timeStr: string) => {
    if (timeStr === emptyValue) {
      return { hours: 0, minutes: 0, seconds: 0, period: format === "12h" ? "AM" : "" };
    }

    if (format === "24h") {
      const [h, m, s] = timeStr.split(":").map(Number);
      return { hours: h || 0, minutes: m || 0, seconds: s || 0, period: "" };
    } else {
      const parts = timeStr.split(" ");
      const timePart = parts[0] || "12:00:00";
      const period = parts[1] || "AM";
      const [h, m, s] = timePart.split(":").map(Number);
      return { hours: h, minutes: m, seconds: s, period };
    }
  };

  const { hours, minutes, seconds, period } = parseTime(time);

  const generateTimeOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const handleHourChange = (hour: number) => {
    setIsHourSet(true);
    const minuteStr = isMinuteSet ? formatNumber(minutes) : "--";
    const secondStr = isSecondSet ? formatNumber(seconds) : "--";

    let newTime: string;
    if (format === "24h") {
      newTime = `${formatNumber(hour)}:${minuteStr}:${secondStr}`;
    } else {
      newTime = `${formatNumber(hour)}:${minuteStr}:${secondStr} ${period}`;
    }
    setTime(newTime);
    onChange?.(newTime);
  };

  const handleMinuteChange = (minute: number) => {
    setIsMinuteSet(true);
    const hourStr = isHourSet ? formatNumber(hours) : "--";
    const secondStr = isSecondSet ? formatNumber(seconds) : "--";

    let newTime: string;
    if (format === "24h") {
      newTime = `${hourStr}:${formatNumber(minute)}:${secondStr}`;
    } else {
      newTime = `${hourStr}:${formatNumber(minute)}:${secondStr} ${period}`;
    }
    setTime(newTime);
    onChange?.(newTime);
  };

  const handleSecondChange = (second: number) => {
    setIsSecondSet(true);
    const hourStr = isHourSet ? formatNumber(hours) : "--";
    const minuteStr = isMinuteSet ? formatNumber(minutes) : "--";

    let newTime: string;
    if (format === "24h") {
      newTime = `${hourStr}:${minuteStr}:${formatNumber(second)}`;
    } else {
      newTime = `${hourStr}:${minuteStr}:${formatNumber(second)} ${period}`;
    }
    setTime(newTime);
    onChange?.(newTime);
  };

  const handlePeriodChange = (newPeriod: string) => {
    const hourStr = isHourSet ? formatNumber(hours) : "--";
    const minuteStr = isMinuteSet ? formatNumber(minutes) : "--";
    const secondStr = isSecondSet ? formatNumber(seconds) : "--";
    const newTime = `${hourStr}:${minuteStr}:${secondStr} ${newPeriod}`;
    setTime(newTime);
    onChange?.(newTime);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d:\s]/g, "");
    setTime(inputValue);

    if (inputValue.length === 8 && inputValue.match(/\d{2}:\d{2}:\d{2}/)) {
      const [h, m, s] = inputValue.split(":").map(Number);

      if (format === "24h") {
        if (h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60) {
          const newTime = `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
          setTime(newTime);
          setIsHourSet(true);
          setIsMinuteSet(true);
          setIsSecondSet(true);
          onChange?.(newTime);
        }
      } else {
        if (h > 0 && h <= 12 && m >= 0 && m < 60 && s >= 0 && s < 60) {
          const newTime = `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)} ${period}`;
          setTime(newTime);
          setIsHourSet(true);
          setIsMinuteSet(true);
          setIsSecondSet(true);
          onChange?.(newTime);
        }
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTime(emptyValue);
    setIsHourSet(false);
    setIsMinuteSet(false);
    setIsSecondSet(false);
    onChange?.(emptyValue);
    setIsHovered(false);
  };

  const hourOptions = format === "24h" ? generateTimeOptions(0, 23) : generateTimeOptions(1, 12);
  const minuteSecondOptions = generateTimeOptions(0, 59);
  const placeholder = "-- : -- : --";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            value={time}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="cursor-pointer pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-l-none rounded-r-md focus-visible:ring-0 focus-visible:shadow-none shadow-none hover:bg-transparent absolute right-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              if (allowClear && isHovered && time !== emptyValue) {
                handleClear(e);
              } else {
                setOpen((prev) => !prev);
              }
            }}
          >
            {allowClear && isHovered && time !== emptyValue ? (
              <X className="cursor-pointer pointer-events-auto h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex gap-2 w-full">
          {/* Hours */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold mb-2">Hours</h4>
            <div className="flex flex-col w-full gap-1 max-h-48 overflow-y-auto no-scrollbar">
              {hourOptions.map((hour) => (
                <Button
                  key={hour}
                  variant={isHourSet && hours === hour ? "default" : "outline"}
                  size="sm"
                  className="px-0 w-12"
                  onClick={() => handleHourChange(hour)}
                >
                  {formatNumber(hour)}
                </Button>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold mb-2">Minutes</h4>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
              {minuteSecondOptions.map((minute) => (
                <Button
                  key={minute}
                  variant={isMinuteSet && minutes === minute ? "default" : "outline"}
                  size="sm"
                  className="w-12 px-0"
                  onClick={() => handleMinuteChange(minute)}
                >
                  {formatNumber(minute)}
                </Button>
              ))}
            </div>
          </div>

          {/* Seconds */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold mb-2">Seconds</h4>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
              {minuteSecondOptions.map((second) => (
                <Button
                  key={second}
                  variant={isSecondSet && seconds === second ? "default" : "outline"}
                  size="sm"
                  className="w-12 px-0"
                  onClick={() => handleSecondChange(second)}
                >
                  {formatNumber(second)}
                </Button>
              ))}
            </div>
          </div>

          {/* AM/PM - Only show if format is 12h */}
          {format === "12h" && (
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold mb-2">Period</h4>
              <div className="flex flex-col gap-1">
                <Button
                  variant={period === "AM" ? "default" : "outline"}
                  size="sm"
                  className="w-12 px-0"
                  onClick={() => handlePeriodChange("AM")}
                >
                  AM
                </Button>
                <Button
                  variant={period === "PM" ? "default" : "outline"}
                  size="sm"
                  className="w-12 px-0"
                  onClick={() => handlePeriodChange("PM")}
                >
                  PM
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
