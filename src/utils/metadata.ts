import { ResponseMetadata } from '../types/assessment'

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Collect visitor metadata
export async function collectVisitorMetadata(): Promise<ResponseMetadata['visitor']> {
  const sessionId = generateSessionId()
  
  // Get screen resolution
  const screenResolution = `${window.screen.width}x${window.screen.height}`
  
  // Get referrer
  const referrer = document.referrer || 'direct'
  
  // Get user agent
  const userAgent = navigator.userAgent
  
  // Get timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  let geoData = {}
  
  try {
    // Get IP and location data from ipapi.co (free tier)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      geoData = {
        ip_address: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city
      }
    }
  } catch (error) {
    console.log('Could not fetch location data:', error)
    // Fallback to basic data only
  }
  
  return {
    ...geoData,
    timezone,
    user_agent: userAgent,
    screen_resolution: screenResolution,
    referrer,
    session_id: sessionId
  }
}

// Calculate assessment completion percentage
export function calculateCompletionPercentage(formData: any, allQuestions: any[]): number {
  const answeredQuestions = allQuestions.filter(q => {
    const value = formData[q.id]
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value !== null && value !== undefined && value !== ''
  })
  
  return Math.round((answeredQuestions.length / allQuestions.length) * 100)
}