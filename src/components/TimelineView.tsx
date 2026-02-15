"use client";

import { useMemo } from "react";
import { format, addDays, isBefore, isAfter, differenceInDays } from "date-fns";
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contract } from "@/types";

interface TimelineViewProps {
  contracts: Contract[];
}

export function TimelineView({ contracts }: TimelineViewProps) {
  const allDates = useMemo(() => {
    const dates: Array<{
      date: Date;
      entry: { type: string; date: string; description: string };
      contract: Contract;
      isReminder?: boolean;
    }> = [];

    contracts.forEach(contract => {
      contract.extractedDates.forEach(entry => {
        const baseDate = new Date(entry.date);
        dates.push({
          date: baseDate,
          entry,
          contract,
        });
        
        if (entry.type === "Renewal") {
          const reminderDate = addDays(baseDate, -30);
          if (isAfter(reminderDate, new Date())) {
            dates.push({
              date: reminderDate,
              entry: { ...entry, type: "Renewal Reminder", description: `30 days before renewal` },
              contract,
              isReminder: true,
            });
          }
        }
      });
    });

    return dates.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 20);
  }, [contracts]);

  const today = new Date();

  return (
    <div className="space-y-1">
      {allDates.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No dates to display</p>
        </div>
      ) : (
        allDates.map((item, idx) => {
          const isPast = isBefore(item.date, today);
          const isToday = differenceInDays(item.date, today) === 0;
          const isUpcoming = isAfter(item.date, today) && differenceInDays(item.date, today) <= 7;
          
          return (
            <div
              key={`${item.contract.id}-${idx}`}
              className={cn(
                "flex items-start gap-4 p-3 rounded-md border border-transparent",
                "hover:bg-bg-raised hover:border-border-default transition-colors",
                isToday && "bg-accent/5 border-accent/20",
                item.isReminder && "opacity-75"
              )}
            >
              <div className={cn(
                "flex flex-col items-center min-w-[60px] pt-1",
                isPast ? "text-text-tertiary" : "text-text-primary"
              )}>
                <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  {format(item.date, "MMM")}
                </span>
                <span className={cn(
                  "text-lg font-semibold tabular-nums leading-none",
                  isToday && "text-accent"
                )}>
                  {format(item.date, "d")}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    item.entry.type === "Payment Due" && "bg-error/10 text-error",
                    item.entry.type === "Renewal" && "bg-accent/10 text-accent",
                    item.entry.type === "Delivery Date" && "bg-success/10 text-success",
                    item.entry.type === "Termination Window" && "bg-warning/10 text-warning",
                    item.isReminder && "bg-text-secondary/10 text-text-secondary"
                  )}>
                    {item.entry.type}
                  </span>
                  {isToday && (
                    <span className="text-xs font-medium text-accent">Today</span>
                  )}
                  {isUpcoming && !isToday && (
                    <span className="text-xs font-medium text-warning">
                      {differenceInDays(item.date, today)} days
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-text-primary font-medium truncate">
                  {item.contract.name}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {item.entry.description}
                </p>
              </div>
              
              <div className="pt-1 flex-shrink-0">
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : isUpcoming ? (
                  <AlertCircle className="w-4 h-4 text-warning" />
                ) : (
                  <Clock className="w-4 h-4 text-text-tertiary" />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}