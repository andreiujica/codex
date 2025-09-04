/**
 * Formats a file size in bytes into a human readable string.
 * @param bytes - The file size in bytes.
 * @returns The formatted file size in KB, MB, GB, etc.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Formats a date string into a human readable string.
 * @param dateString - The date string to format.
 * @returns The formatted date string in the format of MM/DD/YYYY.
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}