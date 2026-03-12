import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dateFnsFormat } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import env from "@/common/config/environtment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IConvertUtcToLocalTimeParams {
  utcDateStr: string;
  format?: string;
}

export function convertUtcToLocalTime(params: IConvertUtcToLocalTimeParams) {
  const { utcDateStr, format } = params;

  const date = new Date(utcDateStr);

  const localDate = toZonedTime(date, env.NEXT_PUBLIC_NODE_TZ);

  return format ? dateFnsFormat(localDate, format) : localDate;
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};
