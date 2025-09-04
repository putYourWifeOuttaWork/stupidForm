import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

interface MultiSelectDropdownProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectDropdown({ 
  options, 
  value = [], 
  onChange, 
  placeholder = "Select options...",
  className = ""
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== option))
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full min-h-[3rem] px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#11b981] focus-within:border-transparent transition-all duration-200 bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((selectedOption) => (
            <span
              key={selectedOption}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#11b981]/10 text-[#38aa59] rounded-md text-sm font-medium"
            >
              {selectedOption}
              <button
                onClick={(e) => removeOption(selectedOption, e)}
                className="hover:bg-[#11b981]/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`${value.length > 0 ? 'text-gray-600' : 'text-gray-400'} text-sm`}>
            {value.length > 0 ? `${value.length} selected` : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#11b981] focus:border-transparent text-sm"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleOption(option)}
                >
                  <span className="text-gray-700">{option}</span>
                  {value.includes(option) && (
                    <Check className="w-4 h-4 text-[#11b981]" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}