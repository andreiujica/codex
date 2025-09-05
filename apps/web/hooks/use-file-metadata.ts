import { useCallback } from 'react'
import type { FileMetadata } from '@/types/api'

/**
 * Allowed file extensions for upload. For now, we only support PDF, Word, Excel, and PowerPoint.
 */
const ALLOWED_FILE_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
] as const


export interface UseFileMetadataReturn {
  parseFileMetadata: (file: File) => Promise<FileMetadata>
  validateFile: (file: File) => { isValid: boolean; error?: string }
  allowedExtensions: string[]
  maxFileSizeMB: number
}

export function useFileMetadata(): UseFileMetadataReturn {
  /**
   * Maximum file size: 50MB
   */
  const maxFileSizeMB = 50
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

  const allowedExtensions = [...ALLOWED_FILE_TYPES]

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    /**
     * Check file size and return an error if it exceeds the limit.
     */
    if (file.size > maxFileSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxFileSizeMB}MB limit`
      }
    }

    /**
     * Get file extension and check if it is allowed.
     */
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!allowedExtensions.includes(extension as any)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${allowedExtensions.join(', ')}`
      }
    }

    return { isValid: true }
  }, [allowedExtensions, maxFileSizeBytes, maxFileSizeMB])

  const parseFileMetadata = useCallback(async (file: File): Promise<FileMetadata> => {
    /**
     * First check whether the file is valid or not.
     */
    const validation = validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    /**
     * Extract file extension.
     */
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
