"use client"

import { api } from "@/lib/ky"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useProjectStore } from "@/stores/projects"
import { useToolbarStore } from "@/stores/toolbar"
import { useQuery } from "@tanstack/react-query"
import type { FolderContents } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"
import { filterBySearch } from "@/utils/filters"
import { useMemo } from "react"
import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";

export function MainArea() {
  const { viewMode } = useToolbarStore();
  const { activeProjectId } = useProjectStore()
  const { activeFolderId, setActiveFolderId, addToFolderHistory } = useFileExplorerStore()
  const { searchQuery } = useToolbarStore()
  
  /**
   * Debounce search query for better performance
   */
  const debouncedSearchQuery = useDebounce(searchQuery, 200)
  
  const { data: contents, isLoading } = useQuery<FolderContents>({
    queryKey: ["contents", activeProjectId, activeFolderId],
    queryFn: () => api.get(`projects/${activeProjectId}/contents${activeFolderId ? `?folderId=${activeFolderId}` : ""}`).json(),
    enabled: !!activeProjectId,
  })

  /**
   * Filter files and folders based on search query
   */
  const filteredContents = useMemo(() => {
    if (!contents) return { files: [], folders: [] }
    return filterBySearch(contents.files, contents.folders, debouncedSearchQuery)
  }, [contents, debouncedSearchQuery])

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

  // Common props for both components
  const commonProps = {
    contents,
    isLoading,
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