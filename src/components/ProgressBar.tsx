import React from 'react'
import { Check } from 'lucide-react'
import { wizardSteps } from '../data/formConfig'
import { FormData } from '../hooks/useFormData'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  onStepClick?: (stepNumber: number) => void
  maxReachedStep: number
  formData: FormData
}

export function ProgressBar({ currentStep, totalSteps, stepTitles, onStepClick, maxReachedStep, formData }: ProgressBarProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  // Check if a step has any answered questions
  const stepHasAnswers = (stepNumber: number): boolean => {
    const step = wizardSteps[stepNumber - 1]
    if (!step) return false
    
    // Get all question IDs for this step
    const questionIds = step.sections.flatMap(section => 
      section.questions.map(question => question.id)
    )
    
    // Check if any question has a non-empty answer
    return questionIds.some(questionId => {
      const value = formData[questionId]
      if (value === null || value === undefined || value === '') return false
      if (Array.isArray(value)) return value.length > 0
      return true
    })
  }

  const handleStepClick = (stepNumber: number, isClickable: boolean) => {
    if (isClickable && onStepClick) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Step {currentStep} of {totalSteps}
        </h2>
        <span className="text-sm text-gray-600">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#38aa59] to-[#11b981] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-3">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1
            const hasAnswers = stepHasAnswers(stepNumber)
            const isCompleted = stepNumber < maxReachedStep || hasAnswers
            const isCurrent = stepNumber === currentStep
            const isClickable = hasAnswers || stepNumber <= maxReachedStep
            
            return (
              <div
                key={index}
                className={`flex flex-col items-center transition-all duration-300 ${
                  isCurrent ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#38aa59] text-white shadow-lg'
                      : isCurrent
                      ? 'bg-[#11b981] text-white shadow-lg ring-4 ring-[#11b981]/20'
                      : 'bg-gray-200 text-gray-600'
                  } ${isClickable ? 'cursor-pointer hover:scale-110' : ''}`}
                  onClick={() => handleStepClick(stepNumber, isClickable)}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-xs mt-2 text-center leading-tight max-w-16 ${
                  isCurrent ? 'text-[#38aa59] font-medium' : 'text-gray-500'
                }`}>
                  {title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}