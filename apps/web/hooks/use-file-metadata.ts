import { useCallback } from 'react'
import type { FileMetadata } from '@/types/api'

// Supported file types with their MIME types and extensions
const ALLOWED_FILE_TYPES = {
  // PDF
  'application/pdf': ['.pdf'],
  // Word documents
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  // Excel spreadsheets
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  // PowerPoint presentations
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
} as const


export interface UseFileMetadataReturn {
  parseFileMetadata: (file: File) => Promise<FileMetadata>
  validateFile: (file: File) => { isValid: boolean; error?: string }
  allowedExtensions: string[]
  maxFileSizeMB: number
}

export function useFileMetadata(): UseFileMetadataReturn {
  // Maximum file size: 50MB
  const maxFileSizeMB = 50
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

  // Get all allowed extensions
  const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat()

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxFileSizeMB}MB limit`
      }
    }

    // Get file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    // Check if extension is allowed
    if (!allowedExtensions.includes(extension as any)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${allowedExtensions.join(', ')}`
      }
    }

    return { isValid: true }
  }, [allowedExtensions, maxFileSizeBytes, maxFileSizeMB])

  const parseFileMetadata = useCallback(async (file: File): Promise<FileMetadata> => {
    // Validate file first
    const validation = validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    // Extract file extension
    const kind = file.name.split('.').pop()?.toLowerCase()!
    

    return {
      name: file.name,
      kind,
      sizeBytes: file.size,
    }
  }, [validateFile])

  return {
    parseFileMetadata,
    validateFile,
    allowedExtensions,
    maxFileSizeMB
  }
}
