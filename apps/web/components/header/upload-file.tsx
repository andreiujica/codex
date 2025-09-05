"use client"

import { useState, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Upload, Loader2, FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { useProjectColors } from "@/hooks/use-project-colors"
import { useProjectStore } from "@/stores/projects"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useToolbarStore } from "@/stores/toolbar"
import { useFileMetadata } from "@/hooks/use-file-metadata"
import { api } from "@/lib/ky"
import { cn } from "@workspace/ui/lib/utils"
import { formatFileSize } from "@/utils/formatters"

export function UploadFile() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { activeProjectId } = useProjectStore()
  const { activeFolderId } = useFileExplorerStore()
  const { searchMode, searchQuery } = useToolbarStore()
  const { iconClass } = useProjectColors(activeProjectId || '')
  const { parseFileMetadata, validateFile, allowedExtensions, maxFileSizeMB } = useFileMetadata()
  const queryClient = useQueryClient()

  /**
   * During global search, we disable file upload (as well as folder creation)
   */
  const isGlobalSearchActive = searchMode === "all-folders" && searchQuery.trim().length > 0
  const isDisabled = isGlobalSearchActive || isUploading

  /**
   * The handleFileSelect handler is used to handle a file being selected.
   * 
   * We also validate the file and set the error if it is invalid.
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)
    
    if (!file) {
      setSelectedFile(null)
      return
    }

    // Validate the selected file
    const validation = validateFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  /**
   * The handleUpload handler is used to upload the file *METADATA* to the API and 
   * invalidate the queries to refresh the folder contents.
   * 
   * We don't upload the file itself for now as we didn't want to deal with the 
   * complexity of bucket uploads, pre-signed URLs, etc.
   */
  const handleUpload = async () => {
    if (!selectedFile || !activeProjectId) return

    setIsUploading(true)
    setError(null)

    try {
      /**
       * Parse file metadata
       */
      const metadata = await parseFileMetadata(selectedFile)

      /**
       * Send metadata to API
       */
      const response = await api.post(`projects/${activeProjectId}/files`, {
        json: {
          name: metadata.name,
          kind: metadata.kind,
          sizeBytes: metadata.sizeBytes,
          folderId: activeFolderId
        }
      })

      if (response.ok) {
        /**
         * Close dialog and reset state
         */
        setIsOpen(false)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        /**
         * Invalidate queries to refresh the folder contents
         */
        queryClient.invalidateQueries({ queryKey: ["contents", activeProjectId, activeFolderId] })
      }
    } catch (error) {
      console.error("Failed to upload file:", error)
      setError(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * The handleOpenChange handler is used to close the dialog when the user clicks outside of it.
   */
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedFile(null)
      setError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/**
       * The dialog trigger is the button that opens the dialog.
       */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-colors duration-200 size-7",
            iconClass,
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isGlobalSearchActive ? "File upload not available during global search" : "Upload file"}
          disabled={isDisabled}
        >
          <Upload className="size-4 text-white" />
        </Button>
      </DialogTrigger>
      {/**
       * The dialog content is the message box to upload a file.
       */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a document to your project. Supported formats: PDF, Word, Excel, PowerPoint.
            Maximum file size: {maxFileSizeMB}MB.
          </DialogDescription>
        </DialogHeader>
        
        {/**
         * The file input and label.
         */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input" className="text-sm font-medium">
              Select File
            </Label>
            <Input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept={allowedExtensions.join(',')}
              onChange={handleFileSelect}
              disabled={isDisabled}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Allowed types: {allowedExtensions.join(', ')}
            </p>
          </div>

          {selectedFile && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/**
         * The cancel and upload buttons.
         */}
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || !!error}
            className={cn(
              "min-w-[100px]",
              iconClass
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
