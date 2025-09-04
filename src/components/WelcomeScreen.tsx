import React from 'react'
import { Leaf, TrendingUp, Shield, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] via-white to-[#c3defe] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#38aa59] to-[#11b981] rounded-full mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cannabis Cultivation
            <span className="text-[#38aa59]"> Assessment</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive evaluation of your cultivation facility to identify optimization opportunities and benchmark performance against industry standards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-[#bdb0f9]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-[#bdb0f9]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Insights</h3>
            <p className="text-gray-600 text-sm">
              Benchmark your yields, costs, and efficiency against industry leaders
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-[#94bbfb]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-[#94bbfb]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment</h3>
            <p className="text-gray-600 text-sm">
              Identify contamination risks and compliance vulnerabilities
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-[#11b981]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-[#11b981]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization</h3>
            <p className="text-gray-600 text-sm">
              Receive actionable recommendations to improve operations
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#38aa59] rounded-full"></div>
              <span>~15 minutes</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#11b981] rounded-full"></div>
              <span>Auto-save enabled</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#bdb0f9] rounded-full"></div>
              <span>Confidential & secure</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-10 py-4 bg-gradient-to-r from-[#38aa59] to-[#11b981] text-white text-lg font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
        >
          Begin Assessment
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Your responses are automatically saved as you progress through the assessment.
        </p>
      </div>
    </div>
  )
}