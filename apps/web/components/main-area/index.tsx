"use client"

import { api } from "@/lib/ky"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useProjectStore } from "@/stores/projects"
import { useToolbarStore } from "@/stores/toolbar"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { FolderContents, File } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"
import { filterFilesAndFolders, filterFiles } from "@/utils/filters"
import { useMemo, useState } from "react"
import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

export function MainArea() {
  const { viewMode } = useToolbarStore();
  const { activeProjectId } = useProjectStore()
  const { activeFolderId, setActiveFolderId, addToFolderHistory } = useFileExplorerStore()
  const { searchQuery, searchMode } = useToolbarStore()
  const queryClient = useQueryClient()

  // State for delete confirmation dialogs
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: 'file' | 'folder'
    id: string
    name: string
  }>({
    isOpen: false,
    type: 'file',
    id: '',
    name: ''
  })
  
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

  const handleDeleteFile = (fileId: string, fileName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: 'file',
      id: fileId,
      name: fileName
    })
  }

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    setDeleteDialog({
      isOpen: true,
      type: 'folder',
      id: folderId,
      name: folderName
    })
  }

  const handleDeleteConfirm = async () => {
    if (!activeProjectId || !deleteDialog.id) return

    try {
      if (deleteDialog.type === 'file') {
        await api.delete(`projects/${activeProjectId}/files/${deleteDialog.id}`)
        // Invalidate relevant queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["contents", activeProjectId, activeFolderId] })
        queryClient.invalidateQueries({ queryKey: ["global-files", activeProjectId] })
        console.log('File deleted successfully')
      } else {
        await api.delete(`projects/${activeProjectId}/folders/${deleteDialog.id}`)
        // Invalidate relevant queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["contents", activeProjectId, activeFolderId] })
        console.log('Folder deleted successfully')
      }
    } catch (error) {
      console.error(`Error deleting ${deleteDialog.type}:`, error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setDeleteDialog({ isOpen: false, type: 'file', id: '', name: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, type: 'file', id: '', name: '' })
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
    hasNoResults,
    handleDeleteFile,
    handleDeleteFolder
  }

  return (
    <>
      {viewMode === "grid" ? <FileGrid {...commonProps} /> : <FileList {...commonProps} />}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog.type === 'file' ? 'File' : 'Folder'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}