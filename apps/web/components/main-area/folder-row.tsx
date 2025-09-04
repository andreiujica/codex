import type { Folder } from "@/types/api"
import { useProjectColors } from "@/hooks/use-project-colors"
import { useProjectStore } from "@/stores/projects"
import { Folder as FolderIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatDate } from "@/utils/formatters"
import { DeleteButton } from "./delete-button"

interface FolderRowProps {
  folder: Folder
  onFolderClick: (folderId: string) => void
  onDelete?: (folderId: string) => void
}

export function FolderRow({ folder, onFolderClick, onDelete }: FolderRowProps) {
  const { activeProjectId } = useProjectStore()
  const { folderClass } = useProjectColors(activeProjectId || '')

  return (
    <button
      onClick={() => onFolderClick(folder.id)}
      className={cn(
        "group relative text-left transition-all duration-200 w-full",
        "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border border-transparent hover:border-border/50 rounded-lg",
        "active:scale-[0.99]"
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Folder Icon */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
          folderClass
        )}>
          <FolderIcon className="w-5 h-5" />
        </div>
        
        {/* Folder Info */}
        <div className="flex-1 min-w-0">
          <div 
            className="text-sm font-medium text-foreground truncate"
            title={folder.name}
          >
            {folder.name}
          </div>
          <div className="text-xs text-muted-foreground">
            Folder • {formatDate(folder.createdAt)}
          </div>
        </div>
        
        {/* Folder Badge */}
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Folder
        </div>
        
        {/* Delete Button - appears on hover */}
        {onDelete && (
          <DeleteButton
            onDelete={onDelete}
            id={folder.id}
            title="Delete folder"
          />
        )}
      </div>
    </button>
  )
}
