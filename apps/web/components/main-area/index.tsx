"use client"

import { api } from "@/lib/ky"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useProjectStore } from "@/stores/projects"
import { useToolbarStore } from "@/stores/toolbar"
import { useQuery } from "@tanstack/react-query"
import type { FolderContents, File } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"
import { filterFilesAndFolders, filterFiles } from "@/utils/filters"
import { useMemo } from "react"
import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";

export function MainArea() {
  const { viewMode } = useToolbarStore();
  const { activeProjectId } = useProjectStore()
  const { activeFolderId, setActiveFolderId, addToFolderHistory } = useFileExplorerStore()
  const { searchQuery, searchMode } = useToolbarStore()
  
  /**
   * Debounce search query for better performance
   */
  const debouncedSearchQuery = useDebounce(searchQuery, 200)
  
  /**
   * The data we want to display here will either be the current folder contents, so 
   * both files and folders, or the global files, both filtered by the search query.
   */
  const { data: currentFolderContents, isLoading } = useQuery<FolderContents>({
    queryKey: ["contents", activeProjectId, activeFolderId],
    queryFn: () => api.get(`projects/${activeProjectId}/contents${activeFolderId ? `?folderId=${activeFolderId}` : ""}`).json(),
    enabled: !!activeProjectId,
  })

  const { data: globalFiles, isLoading: isGlobalLoading } = useQuery<File[]>({
    queryKey: ["global-files", activeProjectId, debouncedSearchQuery],
    queryFn: () => api.get(`projects/${activeProjectId}/files`).json(),
    enabled: !!activeProjectId && searchMode === "all-folders" && debouncedSearchQuery.trim().length > 0,
  })

  /**
   * Filter files and folders based on search query and mode
   */
  const filteredContents = useMemo(() => {
    if (searchMode === "all-folders" && debouncedSearchQuery.trim()) {
      // Global search mode - use filtered global files, no folders
      if (!globalFiles) return { files: [], folders: [] }
      const filteredFiles = filterFiles(globalFiles, debouncedSearchQuery)
      return { files: filteredFiles, folders: [] }
    } else {
      // Current folder search mode - use regular contents
      if (!currentFolderContents) return { files: [], folders: [] }
      return filterFilesAndFolders(currentFolderContents.files, currentFolderContents.folders, debouncedSearchQuery)
    }
  }, [currentFolderContents, globalFiles, debouncedSearchQuery, searchMode])

  const handleFolderClick = (folderId: string) => {
    addToFolderHistory(folderId)
    setActiveFolderId(folderId)
  }

  /**
   * Check if we have search results when searching
   */
  const hasSearchResults = debouncedSearchQuery.trim() && 
    (filteredContents.files.length > 0 || filteredContents.folders.length > 0)
  const isSearching = debouncedSearchQuery.trim().length > 0
  const hasNoResults = isSearching && !hasSearchResults

  /**
   * Determine loading state based on search mode
   */
  const currentIsLoading = searchMode === "all-folders" && isSearching ? isGlobalLoading : isLoading

  // Common props for both components
  const commonProps = {
    contents: searchMode === "all-folders" && isSearching ? { files: globalFiles || [], folders: [] } : currentFolderContents,
    isLoading: currentIsLoading,
    filteredContents,
    handleFolderClick,
    hasNoResults
  }

  return (
    <>
      {viewMode === "grid" ? <FileGrid {...commonProps} /> : <FileList {...commonProps} />}
    </>
  )
}