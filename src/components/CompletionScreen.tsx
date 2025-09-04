import React from 'react'
import { CheckCircle, Download, Mail, Calendar } from 'lucide-react'

interface CompletionScreenProps {
  companyName?: string
  email?: string
  onRestart: () => void
}

export function CompletionScreen({ companyName, email, onRestart }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] via-white to-[#c3defe] flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#38aa59] to-[#11b981] rounded-full mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you {companyName ? `${companyName} team` : ''} for completing the comprehensive cultivation facility assessment. Your insights will help drive industry improvements.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What Happens Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#bdb0f9]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Download className="w-8 h-8 text-[#bdb0f9]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analysis Report</h3>
              <p className="text-sm text-gray-600">
                Receive a detailed analysis of your facility performance and recommendations within 48 hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#94bbfb]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-8 h-8 text-[#94bbfb]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Insights</h3>
              <p className="text-sm text-gray-600">
                Get monthly industry benchmarks and best practices delivered to your inbox
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#11b981]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-[#11b981]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-sm text-gray-600">
                Schedule a follow-up consultation to discuss optimization opportunities
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 border-2 border-[#38aa59] text-[#38aa59] rounded-lg font-medium hover:bg-[#38aa59] hover:text-white transition-all duration-200"
          >
            Take Another Assessment
          </button>
          
          <button className="px-6 py-3 bg-gradient-to-r from-[#38aa59] to-[#11b981] text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
            Schedule Consultation
          </button>
        </div>

        {email && (
          <p className="text-sm text-gray-500 mt-6">
            Results will be sent to: <span className="font-medium text-gray-700">{email}</span>
          </p>
        )}
      </div>
    </div>
  )
}