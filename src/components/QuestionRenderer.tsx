import React, { useState, useEffect } from 'react'
import { Question } from '../types/assessment'
import { Info } from 'lucide-react'
import { MultiSelectDropdown } from './MultiSelectDropdown'
import { FileUploadInput } from './FileUploadInput'
import { RoomDimensionsInput } from './RoomDimensionsInput'
import { FormData } from '../hooks/useFormData'
import { FormResponse } from '../types/assessment'
import { uploadMultipleFiles } from '../utils/supabaseStorage'

interface QuestionRendererProps {
  question: Question
  formData: FormData
  onUpdateData: (questionId: string, value: any, context?: string) => void
  onContextChange?: (context: string) => void
  context?: string
  responseRecord?: FormResponse | null
}

export function QuestionRenderer({ 
  question, 
  formData, 
  onUpdateData, 
  onContextChange, 
  context,
  responseRecord
}: QuestionRendererProps) {
  const [displayValue, setDisplayValue] = useState<string>(String(formData[question.id] || ''))
  const [showSliderInput, setShowSliderInput] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Get the current question's value from formData
  const value = formData[question.id]

  // Determine if context field should be shown
  const shouldShowContext = () => {
    // Don't show context if explicitly disabled
    if (question.disableContext) return false

    if (!onContextChange) return false
    
    // Show context if question has a value
    if (value !== null && value !== undefined && value !== '') {
      // For multiselect/checkbox, check if array has items
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return true
    }
    
    // For select/radio, also show if "Other" is selected
    if ((question.type === 'select' || question.type === 'radio') && value === 'Other') {
      return true
    }
    
    return false
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
      case 'email':
        useEffect(() => {
          // Update displayValue when formData changes, but only if it's not currently being edited
          if (String(formData[question.id] || '') !== displayValue) {
            setDisplayValue(String(formData[question.id] || ''))
          }
        }, [formData[question.id]])

        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value
          setDisplayValue(newValue)

          if (question.validation?.pattern) {
            const regex = new RegExp(question.validation.pattern)
            if (!regex.test(newValue) && newValue !== '') {
              setIsValid(false)
              setErrorMessage(question.validation.message || 'Invalid input.')
            } else {
              setIsValid(true)
              setErrorMessage('')
              onUpdateData(question.id, newValue === '' ? null : newValue) // Save valid data or null if empty
            }
          } else {
            onUpdateData(question.id, newValue === '' ? null : newValue)
          }
        }
        return (
          <input
            type={question.type}
            value={displayValue}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#11b981] focus:border-transparent transition-all duration-200 ${!isValid ? 'border-red-500 validation-error' : 'border-gray-300'}`}
            required={question.required}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onUpdateData(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11b981] focus:border-transparent transition-all duration-200 resize-none"
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onUpdateData(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11b981] focus:border-transparent transition-all duration-200 bg-white"
            required={question.required}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onUpdateData(question.id, e.target.value)}
                  className="w-4 h-4 text-[#11b981] border-gray-300 focus:ring-[#11b981]"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        
        // Use dropdown for options with more than 5 items
        if (question.options && question.options.length > 5) {
          return (
            <MultiSelectDropdown
              options={question.options}
              value={selectedValues}
              onChange={(newValue) => onUpdateData(question.id, newValue)}
              placeholder="Select options..."
            />
          )
        }
        
        // Use traditional checkboxes for 5 or fewer options
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onUpdateData(question.id, [...selectedValues, option])
                    } else {
                      onUpdateData(question.id, selectedValues.filter((v: string) => v !== option))
                    }
                  }}
                  className="w-4 h-4 text-[#11b981] border-gray-300 rounded focus:ring-[#11b981]"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.min}</span>
              {showSliderInput && (
                <input
                  type="number"
                  min={question.min}
                  max={question.max}
                  step={question.step || 1}
                  value={value || question.min}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    if (newValue >= (question.min || 0) && newValue <= (question.max || 100)) {
                      onUpdateData(question.id, newValue)
                    }
                  }}
                  className="w-20 px-2 py-1 text-center font-medium text-[#38aa59] bg-white border border-gray-300 rounded focus:ring-2 focus:ring-[#11b981] focus:border-transparent"
                />
              )}
              <span>{question.max}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step || 1}
              value={value || question.min}
              onChange={(e) => {
                setShowSliderInput(true)
                onUpdateData(question.id, Number(e.target.value))
              }}
              onMouseDown={() => setShowSliderInput(true)}
              onTouchStart={() => setShowSliderInput(true)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #11b981 0%, #11b981 ${((value || question.min!) - question.min!) / (question.max! - question.min!) * 100}%, #e5e7eb ${((value || question.min!) - question.min!) / (question.max! - question.min!) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        )
      case 'file':
        const handleFileUpload = async (files: File[]): Promise<string[]> => {
          if (!responseRecord?.id) return []
          
          try {
            const type = question.id === 'facility_documentation' ? 'facility' : 'financial'
            const bucket = question.id === 'facility_documentation' ? 'facility-docs' : 'financial-docs'
            const uploadResults = await uploadMultipleFiles(files, bucket, `assessments/${responseRecord.id}/${type}`)
            
            const successfulUploads = uploadResults
              .filter(result => !result.error)
              .map(result => result.url)
            
            return successfulUploads
          } catch (error) {
            console.error('File upload error:', error)
            return []
          }
        }

        return (
          <FileUploadInput
            value={Array.isArray(value) ? value : []}
            onChange={(newValue) => onUpdateData(question.id, newValue)}
            onUpload={handleFileUpload}
            fileType={question.id === 'facility_documentation' ? 'facility' : 'financial'}
            multiple={true}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            maxFiles={5}
          />
        )

      default:
        return null
    }
  }

  return (
    <div id={question.id} className="question-container">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            {question.label}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {question.tooltip && (
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#11b981]" />
              <span className="text-sm text-gray-600">{question.tooltip}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        {renderQuestion()}
        
        {/* Dynamic room dimensions for num_rooms question */}
        {question.id === 'num_rooms' && value > 0 && (
          <RoomDimensionsInput
            numRooms={value}
            roomData={Array.isArray(formData.room_details) ? formData.room_details : []}
            onChange={(rooms) => onUpdateData('room_details', rooms)}
          />
        )}
      </div>
      {!isValid && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}

      {shouldShowContext() && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={context || ''}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Add any additional context or notes..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#11b981] focus:border-transparent text-sm"
          />
        </div>
      )}
    </div>
  )
}