import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateICSContent(
  events: Array<{
    title: string;
    date: string;
    description?: string;
    location?: string;
  }>
): string {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ContractChrono//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ].join("\n");

  events.forEach((event, idx) => {
    ics += "\n" + [
      "BEGIN:VEVENT",
      `UID:${idx}@contractchrono.app`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      `DTSTART:${formatDate(event.date)}`,
      `DTEND:${formatDate(event.date)}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description}` : "",
      event.location ? `LOCATION:${event.location}` : "",
      "END:VEVENT",
    ].filter(Boolean).join("\n");
  });

  ics += "\nEND:VCALENDAR";
  return ics;
}