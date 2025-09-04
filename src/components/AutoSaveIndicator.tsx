import React from 'react'
import { Cloud, CloudOff, Save } from 'lucide-react'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
}

export function AutoSaveIndicator({ isSaving, lastSaved, hasUnsavedChanges }: AutoSaveIndicatorProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ${
        isSaving
          ? 'bg-[#94bbfb]/10 border border-[#94bbfb]/20'
          : hasUnsavedChanges
          ? 'bg-yellow-50 border border-yellow-200'
          : 'bg-[#11b981]/10 border border-[#11b981]/20'
      }`}>
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-[#94bbfb] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-[#94bbfb] font-medium">Saving...</span>
          </>
        ) : hasUnsavedChanges ? (
          <>
            <CloudOff className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700 font-medium">Unsaved changes</span>
          </>
        ) : (
          <>
            <Cloud className="w-4 h-4 text-[#11b981]" />
            <span className="text-sm text-[#11b981] font-medium">
              {lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : 'Auto-save enabled'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}