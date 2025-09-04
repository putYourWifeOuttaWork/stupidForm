import React, { useState } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadInputProps {
  value: string[]
  onChange: (urls: string[]) => void
  onUpload: (files: File[]) => Promise<string[]>
  fileType: 'facility' | 'financial'
  multiple?: boolean
  accept?: string
  maxFiles?: number
  className?: string
}

export function FileUploadInput({ 
  value = [], 
  onChange, 
  onUpload,
  fileType,
  multiple = true, 
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
  maxFiles = 5,
  className = ""
}: FileUploadInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // Check file limits
    if (value.length + fileArray.length > maxFiles) {
      setUploadErrors([`Maximum ${maxFiles} files allowed`])
      return
    }

    setUploadErrors([])
    const uploadingFiles = fileArray.map(f => f.name)
    setUploading(uploadingFiles)

    try {
      // Upload files to Supabase Storage
      const newUrls = await onUpload(fileArray)

      onChange([...value, ...newUrls])
    } catch (error) {
      console.error('Upload error:', error)
      setUploadErrors(['Upload failed. Please try again.'])
    }

    setUploading([])
  }

  const removeFile = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove))
  }

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('_').slice(1).join('_') || 'Unknown file'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragging
            ? 'border-[#11b981] bg-[#11b981]/5'
            : 'border-gray-300 hover:border-[#11b981] hover:bg-[#11b981]/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-[#11b981] hover:text-[#38aa59] cursor-pointer font-medium">
            browse
            <input
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">
          Supports: {accept} (max {maxFiles} files)
        </p>
      </div>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {uploadErrors[0]}
        </div>
      )}

      {/* Uploading Files */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((fileName) => (
            <div key={fileName} className="flex items-center gap-3 p-3 bg-[#94bbfb]/10 rounded-lg">
              <div className="w-4 h-4 border-2 border-[#94bbfb] border-t-transparent rounded-full animate-spin"></div>
              <File className="w-4 h-4 text-[#94bbfb]" />
              <span className="text-sm text-gray-700 flex-1">{fileName}</span>
              <span className="text-xs text-[#94bbfb]">Uploading...</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h6 className="text-sm font-medium text-gray-700">Uploaded Files</h6>
          {value.map((url, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#11b981]/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#11b981]" />
              <File className="w-4 h-4 text-[#38aa59]" />
              <span className="text-sm text-gray-700 flex-1">{getFileName(url)}</span>
              <button
                onClick={() => removeFile(url)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}