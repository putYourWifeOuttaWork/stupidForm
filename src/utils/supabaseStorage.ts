import { supabase } from '../lib/supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Promise with upload result
 */
export async function uploadFile(file: File, bucket: string, path: string): Promise<UploadResult> {
  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - The storage bucket name
 * @param basePath - Base path for files (will append timestamp and filename)
 * @returns Promise with array of upload results
 */
export async function uploadMultipleFiles(files: File[], bucket: string, basePath: string): Promise<UploadResult[]> {
  const timestamp = Date.now()
  
  const uploadPromises = files.map((file, index) => {
    const fileExtension = file.name.split('.').pop() || ''
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const path = `${basePath}/${timestamp}_${index}_${sanitizedFileName}`
    
    return uploadFile(file, bucket, path)
  })

  const results = await Promise.all(uploadPromises)
  return results
}

/**
 * Generate a safe file path for uploading
 * @param responseId - The response ID
 * @param fileName - Original file name
 * @param type - Type of document (facility or financial)
 * @returns Safe file path
 */
export function generateFilePath(responseId: string, fileName: string, type: 'facility' | 'financial'): string {
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `assessments/${responseId}/${type}/${timestamp}_${sanitizedFileName}`
}