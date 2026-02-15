'use client'

import { format, parseISO, isPast, differenceInDays } from 'date-fns'
import { Calendar, Clock, AlertCircle, CheckCircle2, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExtractedDate {
  id: string
  type: 'payment' | 'renewal' | 'termination' | 'delivery'
  date: string
  description: string
  amount?: string
}

interface Contract {
  id: string
  name: string
  vendor: string
  uploadDate: string
  extractedDates: ExtractedDate[]
  status: 'active' | 'expired' | 'pending'
  totalValue?: string
}

interface ContractCardProps {
  contract: Contract
  onDelete: (id: string) => void
  onExport: (contract: Contract) => void
}

export function ContractCard({ contract, onDelete, onExport }: ContractCardProps) {
  const getDateIcon = (type: string) => {
    switch (type) {
      case 'payment': return <Clock className="w-3.5 h-3.5" />
      case 'renewal': return <Calendar className="w-3.5 h-3.5" />
      case 'termination': return <AlertCircle className="w-3.5 h-3.5" />
      case 'delivery': return <CheckCircle2 className="w-3.5 h-3.5" />
      default: return <Calendar className="w-3.5 h-3.5" />
    }
  }

  const getDateStyles = (type: string) => {
    switch (type) {
      case 'payment': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case 'renewal': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
      case 'termination': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'delivery': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      default: return 'text-text-secondary bg-bg-hover'
    }
  }

  return (
    <div className="group bg-bg-raised border border-border-default rounded-lg p-4 hover:border-border-strong transition-all duration-150">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary text-sm truncate">{contract.name}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{contract.vendor}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onExport(contract)}
            className="p-1.5 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
            title="Export to Calendar"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contract.id)}
            className="p-1.5 text-text-tertiary hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {contract.extractedDates.slice(0, 3).map((date) => {
          const isPastDate = isPast(parseISO(date.date))
          const daysUntil = differenceInDays(parseISO(date.date), new Date())
          
          return (
            <div
              key={date.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded border text-xs",
                getDateStyles(date.type),
                isPastDate && "opacity-40"
              )}
            >
              {getDateIcon(date.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{date.description}</div>
                <div className="opacity-80 text-[10px]">
                  {format(parseISO(date.date), 'MMM d')}
                  {date.amount && ` • ${date.amount}`}
                </div>
              </div>
              {!isPastDate && daysUntil <= 14 && (
                <span className="shrink-0 text-[10px] font-medium">
                  {daysUntil}d
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border-default flex items-center justify-between text-xs text-text-tertiary">
        <span>Added {format(parseISO(contract.uploadDate), 'MMM d')}</span>
        {contract.totalValue && <span className="font-medium">{contract.totalValue}</span>}
      </div>
    </div>
  )
}