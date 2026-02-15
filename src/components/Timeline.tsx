'use client'

import { format, parseISO, isFuture, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  date: string
  type: 'payment' | 'renewal' | 'termination' | 'delivery'
  description: string
  contractName: string
  amount?: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = events
    .filter(e => isFuture(parseISO(e.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)

  const getColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-amber-400'
      case 'renewal': return 'bg-cyan-400'
      case 'termination': return 'bg-red-400'
      case 'delivery': return 'bg-emerald-400'
      default: return 'bg-text-secondary'
    }
  }

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, idx) => {
        const daysUntil = differenceInDays(parseISO(event.date), new Date())
        
        return (
          <div key={event.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={cn("w-2 h-2 rounded-full", getColor(event.type))} />
              {idx !== sortedEvents.length - 1 && (
                <div className="w-px h-full bg-border-default my-1" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-text-primary">
                  {format(parseISO(event.date), 'MMM d, yyyy')}
                </span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  daysUntil <= 7 ? "bg-red-400/10 text-red-400" : "bg-bg-hover text-text-secondary"
                )}>
                  {daysUntil} days
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-0.5">{event.contractName}</p>
              <p className="text-xs text-text-tertiary">{event.description}</p>
              {event.amount && (
                <p className="text-xs text-accent mt-1">{event.amount}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}