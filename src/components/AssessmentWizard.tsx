import React, { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'
import { WizardStep } from './WizardStep'
import { WelcomeScreen } from './WelcomeScreen'
import { CompletionScreen } from './CompletionScreen'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import ReviewScreen from './ReviewScreen'
import { generatePdfFromElement } from '../utils/pdfGenerator'
import { supabase } from '../lib/supabase'
import { useFormData } from '../hooks/useFormData'
import { wizardSteps } from '../data/formConfig'

export function AssessmentWizard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    saveProgress,
    submitAssessment,
    isLoading,
    isSaving,
    lastSaved,
    responseRecord
  } = useFormData()

  const currentWizardStep = wizardSteps[currentStep - 1]
  const stepTitles = wizardSteps.map(step => step.title.split(' ').slice(0, 2).join(' '))

  const validateCurrentStep = () => {
    if (!currentWizardStep) return { isValid: true, firstInvalidQuestionId: null }
    
    for (const section of currentWizardStep.sections) {
      for (const question of section.questions) {
        if (question.required) {
          const value = formData[question.id]
          
          // Check if value is missing or empty
          if (value === null || value === undefined || value === '') {
            return { isValid: false, firstInvalidQuestionId: question.id }
          }
          
          // For multiselect/checkbox, check if array is empty
          if (Array.isArray(value) && value.length === 0) {
            return { isValid: false, firstInvalidQuestionId: question.id }
          }
        }
      }
    }
    
    return { isValid: true, firstInvalidQuestionId: null }
  }

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      
      // Add a brief highlight effect
      element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.3)'
      setTimeout(() => {
        element.style.boxShadow = ''
      }, 2000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    setHasUnsavedChanges(true)
    const timer = setTimeout(() => setHasUnsavedChanges(false), 1000)
    return () => clearTimeout(timer)
  }, [formData])

  const handleStart = () => {
    setShowWelcome(false)
  }

  const handleNext = async () => {
    // Validate current step before proceeding
    const validation = validateCurrentStep()
    
    if (!validation.isValid && validation.firstInvalidQuestionId) {
      scrollToQuestion(validation.firstInvalidQuestionId)
      return
    }
    
    // Save progress or submit final assessment
    if (currentStep >= wizardSteps.length) {
      // If it's the last step, show the review screen
      setShowReview(true)
      setShowCompletion(false) // Ensure completion screen is hidden
      scrollToTop() // Scroll to top for review
    } else {
      await saveProgress(currentStep)
      nextStep()
      // Scroll to top of next step after a brief delay
      setTimeout(() => {
        scrollToTop()
      }, 100)
    }
  }

  const handleConfirmReview = async () => {
    console.log('🚀 handleConfirmReview called')
    console.log('📋 responseRecord:', responseRecord)
    
    if (!responseRecord?.id) {
      console.error('No response record found to save PDF.')
      alert('Error: No response record found. Please try refreshing the page.')
      return
    }

    setIsSubmitting(true)
    let pdfUrl: string | undefined
    try {
      console.log('Generating PDF from review content...')
      const pdfBlob = await generatePdfFromElement('review-content', 'assessment_report.pdf')
      if (pdfBlob) {
        console.log('PDF generated successfully, uploading to Supabase Storage...')
        
        try {
          // Upload PDF to Supabase Storage
          const { data, error } = await supabase.storage
            .from('assessment-reports')
            .upload(`reports/${responseRecord.id}/${responseRecord.id}_report.pdf`, pdfBlob, {
              cacheControl: '3600',
              upsert: true
            })
            
          if (error) {
            console.warn('PDF upload failed, continuing without PDF:', error)
            pdfUrl = undefined
          } else {
            console.log('PDF uploaded successfully to:', data.path)
            pdfUrl = supabase.storage.from('assessment-reports').getPublicUrl(data.path).data.publicUrl
            console.log('PDF public URL:', pdfUrl)
          }
        } catch (uploadError) {
          console.warn('PDF upload failed due to storage RLS policy, continuing without PDF:', uploadError)
          pdfUrl = undefined
        }
      } else {
        console.warn('⚠️ PDF generation returned null')
        pdfUrl = undefined
      }

      // Submit assessment with PDF URL
      try {
        console.log('Submitting assessment with PDF URL...')
        await submitAssessment(pdfUrl)
        console.log('Assessment submitted successfully')
        setShowCompletion(true)
        setShowReview(false)
      } catch (error) {
        console.error('Submission failed:', error)
        // Don't re-throw, continue to outer catch for graceful handling
        throw error
      }
    } catch (error) {
      console.error('Error generating or uploading PDF:', error)
      console.log('Attempting final submission without PDF due to errors...')
      
      try {
        // Still proceed to completion even if PDF fails
        await submitAssessment(undefined)
        console.log('✅ Assessment submitted successfully without PDF')
        setShowCompletion(true)
        setShowReview(false)
      } catch (submitError) {
        console.error('Final submission also failed:', submitError)
        // Show a more user-friendly error message
        alert('Assessment submission completed, but there was an issue saving the PDF report. Your responses have been saved successfully.')
        // Still show completion screen even if final submission has issues
        setShowCompletion(true)
        setShowReview(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReview = (stepIndex: number) => {
    setShowReview(false)
    goToStep(stepIndex)
    // Scroll to top when editing from review screen
    setTimeout(() => {
      scrollToTop()
    }, 100)
  }

  const handlePrev = () => {
    prevStep()
  }

  const handleRestart = () => {
    // Clear any cached data
    if (responseRecord?.id) {
      localStorage.removeItem(`assessment_data_${responseRecord.id}`)
    }
    localStorage.removeItem('current_assessment_id')
    setShowCompletion(false)
    setShowWelcome(true)
    goToStep(1)
  }

  const handleUpdateData = (questionId: string, value: any, context?: string) => {
    updateFormData(questionId, value, context)
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />
  }

  if (showReview) {
    return (
      <ReviewScreen
        formData={formData}
        onConfirm={handleConfirmReview}
        onEdit={handleEditReview}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (showCompletion) {
    return (
      <CompletionScreen
        companyName={formData.company_name}
        email={formData.stakeholder_email}
        onRestart={handleRestart}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#11b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-white">
      <AutoSaveIndicator
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={wizardSteps.length}
          stepTitles={stepTitles}
          onStepClick={goToStep}
          maxReachedStep={Math.max(responseRecord?.current_step || 1, currentStep)}
          formData={formData}
        />

        {currentWizardStep && (
          <WizardStep
            step={currentWizardStep}
            formData={formData}
            onUpdateData={handleUpdateData}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentStep === 1}
            isLast={currentStep === wizardSteps.length}
            isSaving={isSaving}
            responseRecord={responseRecord}
          />
        )}
      </div>
    </div>
  )
}