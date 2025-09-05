import type { File } from "@/types/api"
import { 
  FileText, 
  FileSpreadsheet, 
  FileType,
  File as FileIcon,
  Presentation
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatFileSize, formatDate } from "@/utils/formatters"
import { DeleteButton } from "./delete-button"

/**
 * TODO: Dedupe this as we also have the same function in file-card.tsx
 */
function getFileIconComponent(fileKind: string) {
  const kind = fileKind.toLowerCase()
  if (kind === 'pdf') return FileText
  if (['doc', 'docx'].includes(kind)) return FileType
  if (['xls', 'xlsx'].includes(kind)) return FileSpreadsheet  
  if (['ppt', 'pptx'].includes(kind)) return Presentation

  return FileIcon
}

interface FileRowProps {
  file: File
  onDelete?: (fileId: string) => void
}

export function FileRow({ file, onDelete }: FileRowProps) {
  const FileIconComponent = getFileIconComponent(file.kind)
  
  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-200",
        "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border border-transparent hover:border-border/50 rounded-lg"
      )}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-center gap-3 p-3">
        {/* File Icon */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
          "bg-muted/30 text-muted-foreground",
          "group-hover:bg-muted/50 group-hover:text-foreground"
        )}>
          <FileIconComponent className="w-5 h-5" />
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div 
            className="text-sm font-medium text-foreground truncate"
            title={file.name}
          >
            {file.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatFileSize(file.sizeBytes)} • {formatDate(file.uploadedAt)}
          </div>
        </div>
        
        {/* File Type Badge */}
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {file.kind}
        </div>
        
        {/* Delete Button - appears on hover */}
        {onDelete && (
          <DeleteButton
            onDelete={onDelete}
            id={file.id}
            title="Delete file"
          />
        )}
      </div>
    </div>
  )
}
