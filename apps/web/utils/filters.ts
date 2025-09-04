/**
 * Filters files and folders based on a search query
 * @param files - Array of files to filter
 * @param folders - Array of folders to filter
 * @param searchQuery - The search query string
 * @returns Object containing filtered files and folders
 */
export const filterFilesAndFolders = <F extends { name: string }, T extends { name: string }>(
  files: F[],
  folders: T[],
  searchQuery: string
): { files: F[]; folders: T[] } => {
  if (!searchQuery.trim()) {
    return { files, folders }
  }

  const query = searchQuery.toLowerCase().trim()

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(query)
  )

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(query)
  )

  return { files: filteredFiles, folders: filteredFolders }
}

/**
 * Filters files by search query (used for all-folders search)
 * @param files - Array of files to filter
 * @param searchQuery - The search query string
 * @returns Filtered array of files
 */
export const filterFiles = <F extends { name: string }>(
  files: F[],
  searchQuery: string
): F[] => {
  if (!searchQuery.trim()) {
    return files
  }

  const query = searchQuery.toLowerCase().trim()

  return files.filter(file =>
    file.name.toLowerCase().includes(query)
  )
}