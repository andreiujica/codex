"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { FolderPlus, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useProjectColors } from "@/hooks/use-project-colors"
import { useProjectStore } from "@/stores/projects"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useToolbarStore } from "@/stores/toolbar"
import { api } from "@/lib/ky"
import { cn } from "@workspace/ui/lib/utils"

interface CreateFolderForm {
  name: string
}

// Form validation schema
const folderValidation = {
  required: "Folder name is required",
  minLength: {
    value: 1,
    message: "Folder name cannot be empty"
  },
  maxLength: {
    value: 255,
    message: "Folder name is too long"
  },
  pattern: {
    value: /^[^<>:"/\\|?*\x00-\x1f]+$/,
    message: "Folder name contains invalid characters"
  }
}

export function CreateFolder() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { activeProjectId } = useProjectStore()
  const { activeFolderId } = useFileExplorerStore()
  const { searchMode, searchQuery } = useToolbarStore()
  const { iconClass } = useProjectColors(activeProjectId || '')
  const queryClient = useQueryClient()

  // Disable folder creation during global search
  const isGlobalSearchActive = searchMode === "all-folders" && searchQuery.trim().length > 0
  const isDisabled = isGlobalSearchActive || isCreating

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<CreateFolderForm>({
    mode: "onChange",
    defaultValues: {
      name: ""
    }
  })

  const folderName = watch("name")

  const onSubmit = async (data: CreateFolderForm) => {
    if (!activeProjectId) return

    setIsCreating(true)
    try {
      const response = await api.post(`projects/${activeProjectId}/folders`, {
        json: {
          name: data.name.trim(),
          parentId: activeFolderId
        }
      })

      if (response.ok) {
        // Close dropdown and reset form
        setIsOpen(false)
        reset()
        
        // Invalidate queries to refresh the folder contents
        queryClient.invalidateQueries({ queryKey: ["contents", activeProjectId, activeFolderId] })
      }
    } catch (error) {
      console.error("Failed to create folder:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      reset()
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-colors duration-200 size-7",
            iconClass,
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isGlobalSearchActive ? "Folder creation not available during global search" : "Create new folder"}
          disabled={isDisabled}
        >
          <FolderPlus className="size-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-sm font-medium">
              Folder Name
            </Label>
            <Input
              id="folderName"
              {...register("name", folderValidation)}
              placeholder="Enter folder name..."
              className={cn(
                "w-full",
                errors.name && "border-destructive focus-visible:ring-destructive"
              )}
              autoFocus
              disabled={isDisabled}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isDisabled}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || !folderName?.trim() || isDisabled}
              className={cn(
                "min-w-[80px]",
                iconClass
              )}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
