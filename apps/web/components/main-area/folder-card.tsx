import { useProjectColors } from "@/hooks/use-project-colors"
import { useProjectStore } from "@/stores/projects"
import type { Folder } from "@/types/api"
import { Folder as FolderIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@/utils/formatters"
import { DeleteButton } from "./delete-button"

interface FolderCardProps {
  folder: Folder
  onFolderClick: (folderId: string) => void
  onDelete?: (folderId: string) => void
}

export function FolderCard({ folder, onFolderClick, onDelete }: FolderCardProps) {
  const { activeProjectId } = useProjectStore()
  const { folderClass } = useProjectColors(activeProjectId || '')

  return (
    <button
      key={folder.id}
      onClick={() => onFolderClick(folder.id)}
      className={cn(
        "group relative text-left transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <div className={cn(
        "border border-border bg-card rounded-lg shadow-xs transition-all duration-200 overflow-hidden",
        "group-hover:shadow-md group-hover:border-border/80",
        "group-active:scale-[0.98]"
      )}>
        <div className="flex flex-col">
          {/* Folder Icon Background */}
          <div className={cn(
            "flex items-center justify-center h-16 w-full transition-colors",
            folderClass
          )}>
            <FolderIcon className="w-6 h-6" />
          </div>
          
          {/* Folder Info */}
          <div className="p-3 space-y-1 min-h-[2.5rem] relative">
            <div 
              className="text-sm font-medium text-foreground truncate leading-tight"
              title={folder.name}
            >
              {folder.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(folder.createdAt)}
            </div>
            
            {/* Delete Button - appears on hover */}
            {onDelete && (
              <DeleteButton
                onDelete={onDelete}
                id={folder.id}
                title="Delete folder"
                className="absolute bottom-3 right-3"
              />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
