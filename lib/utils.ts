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

export function convertUtcToLocalTime(
  params: IConvertUtcToLocalTimeParams & { format: string },
): string;
export function convertUtcToLocalTime(
  params: IConvertUtcToLocalTimeParams & { format?: undefined },
): Date;
export function convertUtcToLocalTime(params: IConvertUtcToLocalTimeParams): string | Date {
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

export function formatCustomerStatus(status: string) {
  switch (status) {
    case "CONTRACT":
      return "Kontrak";
    case "MOU":
      return "Langganan";
    case "NON-CONTRACT":
      return "Non Kontrak";
    default:
      return toTitleCase(status);
  }
}
