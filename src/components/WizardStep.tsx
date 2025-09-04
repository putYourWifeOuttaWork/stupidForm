import React from 'react'
import { WizardStep as WizardStepType } from '../types/assessment'
import { QuestionRenderer } from './QuestionRenderer'
import { FormData } from '../hooks/useFormData'
import { FormResponse } from '../types/assessment'

interface WizardStepProps {
  step: WizardStepType
  formData: FormData
  onUpdateData: (questionId: string, value: any, context?: string) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  responseRecord?: FormResponse | null
}

export function WizardStep({ 
  step, 
  formData, 
  onUpdateData, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  isSaving,
  responseRecord
}: WizardStepProps) {
  const handleNext = () => {
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h1>
        <p className="text-lg text-gray-600">{step.subtitle}</p>
      </div>

      <div className="space-y-8">
        {step.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#f3f4f6] to-[#c3defe] px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              <p className="text-gray-600 mt-1">{section.description}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {section.questions.map((question) => (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  formData={formData}
                  onUpdateData={onUpdateData}
                  onContextChange={(context) => onUpdateData(question.id, formData[question.id], context)}
                  context={formData[`${question.id}_context`]}
                  responseRecord={responseRecord}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isFirst
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
          }`}
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-[#11b981] border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          )}
          
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-[#38aa59] to-[#11b981] text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            {isLast ? 'Complete Assessment' : 'Continue'}
            {!isLast && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}