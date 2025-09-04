import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FormResponse, ResponseMetadata } from '../types/assessment'
import { wizardSteps } from '../data/formConfig'
import { collectVisitorMetadata, calculateCompletionPercentage } from '../utils/metadata'
import { uploadMultipleFiles } from '../utils/supabaseStorage'

export interface FormData {
  [key: string]: any
}

export function useFormData(initialResponseId?: string) {
  const [formData, setFormData] = useState<FormData>({}) // For forms table data
  const [sessionAnswers, setSessionAnswers] = useState<FormData>({}) // For sessions table answers
  const [currentStep, setCurrentStep] = useState(1)
  const [responseRecord, setResponseRecord] = useState<FormResponse | null>(null) // The forms record
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null) // The current session ID
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [sessionStartTime] = useState<Date>(new Date()) // Start time of the current session
  const [stepStartTimes, setStepStartTimes] = useState<{ [stepId: string]: Date }>({})
  const initialized = useRef(false)

  // Define which questions belong to the 'forms' table
  const formsTableQuestions = [
    'company_name',
    'stakeholder_email',
    'facility_documentation',
    'financial_documentation'
  ]

  // Initialize response record and load data
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      console.log('🚀 Initializing assessment (useEffect)')
      initializeAssessment()
    }
  }, [initialResponseId])

  const initializeAssessment = async () => {
    console.log('📋 initializeAssessment called')
    setIsLoading(true)
    
    try {
      let targetResponseId = initialResponseId
      
      // If no responseId provided, check localStorage for existing assessment
      if (!targetResponseId) {
        console.log('🔍 Checking localStorage for existing assessment')
        const cachedResponseId = localStorage.getItem('current_assessment_id')
        if (cachedResponseId) {
          console.log('📦 Found cached response ID:', cachedResponseId)
          // Verify this response still exists in database
          const { data: existingResponse } = await supabase
            .from('forms')
            .select('id')
            .eq('id', cachedResponseId)
            .maybeSingle()
          
          if (existingResponse) {
            console.log('✅ Existing response verified in database')
            targetResponseId = cachedResponseId
          } else {
            console.log('🗑️ Cached response no longer exists, cleaning up')
            // Clean up invalid cached ID
            localStorage.removeItem('current_assessment_id')
          }
        }
      }
      
      if (targetResponseId) {
        console.log('📖 Loading existing data for:', targetResponseId)
        await loadExistingData(targetResponseId)
      } else {
        console.log('🆕 Creating new assessment')
        await initializeNewAssessment()
      }
    } catch (error) {
      console.error('Error initializing assessment:', error)
    }
    
    setIsLoading(false)
  }

  const initializeNewAssessment = async () => {
    console.log('✨ Creating new assessment record in database')
    try {
      // Collect visitor metadata
      const visitorData = await collectVisitorMetadata()
      
      const initialMetadata: ResponseMetadata = {
        visitor: visitorData,
        performance: {
          start_time: sessionStartTime.toISOString()
        },
        assessment: {
          revision_count: 0,
          completion_percentage: 0
        }
      }

      const { data: newResponse, error } = await supabase
        .from('forms')
        .insert({
          completion_status: 'draft',
          current_step: 1,
          metadata: initialMetadata
        })
        .select()
        .single()

      if (error) throw error
      console.log('🎉 New response created:', newResponse.id)
      setResponseRecord(newResponse)
      
      // Store response ID in localStorage for session persistence
      localStorage.setItem('current_assessment_id', newResponse.id)
      
      // Create initial session for this form
      await createNewSession(newResponse.id, visitorData)
    } catch (error) {
      console.error('Error creating response record:', error)
    }
  }

  const createNewSession = async (formId: string, visitorMetadata: any) => {
    console.log('🆕 Creating new session for form:', formId)
    try {
      const { data: newSession, error } = await supabase
        .from('sessions')
        .insert({
          form_id: formId,
          visitor_metadata: visitorMetadata,
          answers: {}
        })
        .select()
        .single()

      if (error) throw error
      console.log('✨ New session created:', newSession.id)
      setCurrentSessionId(newSession.id)
      setSessionAnswers({})
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const loadExistingData = async (id: string) => {
    console.log('📥 Loading existing data for response:', id)
    try {
      // Store response ID in localStorage for session persistence
      localStorage.setItem('current_assessment_id', id)
      
      // Load response record from database
      const { data: response } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single()

      if (response) {
        setResponseRecord(response)
        setCurrentStep(response.current_step || 1)
        
        // Set forms table data
        setFormData({
          company_name: response.company_name,
          stakeholder_email: response.stakeholder_email,
          facility_documentation: response.facility_docs || [],
          financial_documentation: response.financial_docs || []
        })

        // Load the latest session for this form
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('form_id', id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (sessions && sessions.length > 0) {
          const latestSession = sessions[0]
          setCurrentSessionId(latestSession.id)
          setSessionAnswers(latestSession.answers || {})
        } else {
          // No session exists, create one
          const visitorData = await collectVisitorMetadata()
          await createNewSession(id, visitorData)
        }
      }

      // Load cached data from localStorage if available
      const cachedData = localStorage.getItem(`assessment_data_${id}`)
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData)
          
          // Separate forms table data from session answers
          const formsTableData: FormData = {}
          const sessionTableData: FormData = {}
          
          Object.keys(parsedData).forEach(key => {
            if (key.startsWith('_')) return // Skip metadata keys
            
            if (formsTableQuestions.includes(key) || key.endsWith('_context')) {
              formsTableData[key] = parsedData[key]
            } else {
              sessionTableData[key] = parsedData[key]
            }
          })
          
          setFormData(prev => ({ ...prev, ...formsTableData }))
          setSessionAnswers(prev => ({ ...prev, ...sessionTableData }))
          setLastSaved(new Date(parsedData._lastSaved || Date.now()))
        } catch (e) {
          console.warn('Error parsing cached data:', e)
        }
      }
    } catch (error) {
      console.error('Error loading form data:', error)
    }
  }

  const updateFormData = useCallback((questionId: string, value: any, context?: string) => {
    // Determine which table this question belongs to
    if (formsTableQuestions.includes(questionId)) {
      setFormData(prev => ({
        ...prev,
        [questionId]: value,
        ...(context && { [`${questionId}_context`]: context })
      }))
    } else {
      setSessionAnswers(prev => ({
        ...prev,
        [questionId]: value,
        ...(context && { [`${questionId}_context`]: context })
      }))
    }
    
    // Track step start time for performance metrics
    const currentStepId = wizardSteps[currentStep - 1]?.id
    if (currentStepId && !stepStartTimes[currentStepId]) {
      setStepStartTimes(prev => ({
        ...prev,
        [currentStepId]: new Date()
      }))
    }
  }, [currentStep, stepStartTimes, formsTableQuestions])

  const handleFileUpload = async (questionId: string, files: File[]) => {
    if (!responseRecord?.id) return
    
    try {
      const type = questionId === 'facility_documentation' ? 'facility' : 'financial'
      const bucket = questionId === 'facility_documentation' ? 'facility-docs' : 'financial-docs'
      const uploadResults = await uploadMultipleFiles(files, bucket, `assessments/${responseRecord.id}/${type}`)
      
      const successfulUploads = uploadResults
        .filter(result => !result.error)
        .map(result => result.url)
      
      if (successfulUploads.length > 0) {
        const currentFiles = formData[questionId] || []
        setFormData(prev => ({
          ...prev,
          [questionId]: [...currentFiles, ...successfulUploads]
        }))
      }
      
      return successfulUploads
    } catch (error) {
      console.error('File upload error:', error)
      return []
    }
  }

  // Auto-save to localStorage only
  const saveToCache = useCallback(() => {
    if (!responseRecord?.id) return
    
    const dataToCache = {
      ...formData, // Forms table data
      ...sessionAnswers, // Sessions table data
      _lastSaved: new Date().toISOString(),
      _currentStep: currentStep
    }
    
    localStorage.setItem(`assessment_data_${responseRecord.id}`, JSON.stringify(dataToCache))
    setLastSaved(new Date())
  }, [formData, sessionAnswers, currentStep, responseRecord])

  // Save progress to database (step changes only)
  const saveProgress = useCallback(async (step: number) => {
    if (!responseRecord?.id || !currentSessionId) return
    
    setIsSaving(true)
    try {
      console.log('💾 Saving progress for step:', step)
      
      // Calculate step duration
      const currentStepId = wizardSteps[currentStep - 1]?.id
      const stepDuration = stepStartTimes[currentStepId] 
        ? Date.now() - stepStartTimes[currentStepId].getTime()
        : 0

      // Get all questions for completion calculation (merge both data sources)
      const allQuestions = wizardSteps.flatMap(s => s.sections.flatMap(sec => sec.questions))
      const mergedFormData = { ...formData, ...sessionAnswers }
      const completionPercentage = calculateCompletionPercentage(mergedFormData, allQuestions)

      // Update metadata with performance and assessment data
      const updatedMetadata: ResponseMetadata = {
        ...(responseRecord.metadata || {}),
        performance: {
          ...(responseRecord.metadata?.performance || {}),
          step_durations: {
            ...(responseRecord.metadata?.performance?.step_durations || {}),
            [currentStepId]: stepDuration
          }
        },
        assessment: {
          ...(responseRecord.metadata?.assessment || {}),
          completion_percentage: completionPercentage,
          last_question_answered: Object.keys(mergedFormData).pop(),
          revision_count: (responseRecord.metadata?.assessment?.revision_count || 0) + 1
        }
      }
      
      // Update the main forms record
      const { error: formError } = await supabase
        .from('forms')
        .update({
          current_step: step,
          completion_status: completionPercentage >= 100 ? 'complete' : 'partial',
          metadata: updatedMetadata,
          stakeholder_email: formData.stakeholder_email,
          company_name: formData.company_name,
          facility_docs: formData.facility_documentation,
          financial_docs: formData.financial_documentation
        })
        .eq('id', responseRecord.id)
      
      if (formError) {
        console.error('Error updating form record:', formError)
        throw formError
      }

      // Update the current session with answers
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({
          answers: sessionAnswers,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSessionId)
      
      if (sessionError) {
        console.error('Error updating session:', sessionError)
        throw sessionError
      }
      
      // Save to cache
      saveToCache()
      
      console.log('Progress saved successfully')
    } catch (error) {
      console.error('Error saving progress:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [formData, sessionAnswers, currentStep, responseRecord, currentSessionId, stepStartTimes, saveToCache])

  const submitAssessment = useCallback(async (reportPdfUrl?: string) => {
    if (!responseRecord?.id || !currentSessionId) return
    
    console.log('🎯 Final submission started')
    setIsSaving(true)
    
    try {
      // Calculate total duration
      const totalDuration = Date.now() - sessionStartTime.getTime()
      
      // Get all questions for completion calculation
      const allQuestions = wizardSteps.flatMap(s => s.sections.flatMap(sec => sec.questions))
      const mergedFormData = { ...formData, ...sessionAnswers }
      const completionPercentage = calculateCompletionPercentage(mergedFormData, allQuestions)
      
      // Final metadata update
      const finalMetadata: ResponseMetadata = {
        ...(responseRecord.metadata || {}),
        performance: {
          ...(responseRecord.metadata?.performance || {}),
          total_duration: totalDuration
        },
        assessment: {
          ...(responseRecord.metadata?.assessment || {}),
          completion_percentage: completionPercentage,
          revision_count: (responseRecord.metadata?.assessment?.revision_count || 0) + 1
        }
      }
      
      // Final update to forms record
      const updateData: any = {
        completion_status: 'complete',
        current_step: wizardSteps.length,
        metadata: finalMetadata,
        stakeholder_email: formData.stakeholder_email,
        company_name: formData.company_name,
        facility_docs: formData.facility_documentation,
        financial_docs: formData.financial_documentation
      }
      
      // Add PDF URL if provided
      if (reportPdfUrl) {
        updateData.readout_url = reportPdfUrl
      }
      
      const { error: finalError } = await supabase
        .from('forms')
        .update(updateData)
        .eq('id', responseRecord.id)
      
      if (finalError) {
        console.error('Final submission error:', finalError)
        throw finalError
      }
      
      // Update session with final answers
      try {
        const { error: sessionError } = await supabase
          .from('sessions')
          .update({
            answers: sessionAnswers,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSessionId)
        
        if (sessionError) {
          console.error('Error updating final session:', sessionError)
          throw sessionError
        }
      } catch (error) {
        // Try without completed_at column if it doesn't exist
        console.warn('Retrying session update without completed_at column')
        const { error: fallbackError } = await supabase
          .from('sessions')
          .update({
            answers: sessionAnswers,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSessionId)
        
        if (fallbackError) {
          console.error('Error updating final session (fallback):', fallbackError)
          throw fallbackError
        }
      }
      
      // Clear localStorage cache after successful submission
      localStorage.removeItem(`assessment_data_${responseRecord.id}`)
      localStorage.removeItem('current_assessment_id')
      
      console.log('🎉 Assessment submitted successfully')
    } catch (error) {
      console.error('Submission error:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [formData, sessionAnswers, responseRecord, currentSessionId, sessionStartTime])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, wizardSteps.length))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= wizardSteps.length) {
      setCurrentStep(step)
    }
  }, [])

  return {
    formData: { ...formData, ...sessionAnswers }, // Merge for easy access
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
  }
}
        