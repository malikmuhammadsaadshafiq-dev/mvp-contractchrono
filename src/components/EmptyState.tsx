'use client'

import { FileText, Upload } from 'lucide-react'

interface EmptyStateProps {
  onUpload: () => void
  hasSearchQuery?: boolean
}

export function EmptyState({ onUpload, hasSearchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-bg-raised border border-border-default flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-text-tertiary" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-1">
        {hasSearchQuery ? 'No contracts found' : 'No contracts yet'}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {hasSearchQuery 
          ? 'Try adjusting your search terms to find what you are looking for.' 
          : 'Upload your first contract PDF to automatically extract critical dates, payment deadlines, and renewal clauses.'}
      </p>
      {!hasSearchQuery && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg-base rounded-md py-2 px-4 text-sm font-semibold transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Your First Contract
        </button>
      )}
    </div>
  )
}