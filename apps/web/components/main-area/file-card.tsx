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

interface FileCardProps {
  file: File
  onDelete?: (fileId: string) => void
}

function getFileIconComponent(fileKind: string) {
  const kind = fileKind.toLowerCase()
  if (kind === 'pdf') return FileText
  if (['doc', 'docx'].includes(kind)) return FileType
  if (['xls', 'xlsx'].includes(kind)) return FileSpreadsheet  
  if (['ppt', 'pptx'].includes(kind)) return Presentation

  return FileIcon
}

export function FileCard({ file, onDelete }: FileCardProps) {
  const FileIconComponent = getFileIconComponent(file.kind)
  
  return (
    <div
      key={file.id}
      className={cn(
        "group relative cursor-pointer transition-all duration-200",
        "hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      tabIndex={0}
      role="button"
    >
      <div className={cn(
        "border border-border bg-card rounded-lg shadow-xs transition-all duration-200 overflow-hidden",
        "group-hover:shadow-md group-hover:border-border/80"
      )}>
        <div className="flex flex-col">
          {/* File Icon Background */}
          <div className={cn(
            "flex items-center justify-center h-16 w-full transition-colors",
            "bg-muted/30 text-muted-foreground",
            "group-hover:bg-muted/50 group-hover:text-foreground"
          )}>
            <FileIconComponent className="w-6 h-6" />
          </div>
          
          {/* File Info */}
          <div className="p-3 space-y-1 min-h-[2.5rem] relative">
            <div 
              className="text-sm font-medium text-foreground truncate leading-tight"
              title={file.name}
            >
              {file.name}
            </div>
            <div className="text-xs text-muted-foreground space-x-1">
              <span>{formatFileSize(file.sizeBytes)}</span>
              <span className="text-muted-foreground/60">•</span>
              <span>{formatDate(file.uploadedAt)}</span>
            </div>
            
            {/* Delete Button - appears on hover */}
            {onDelete && (
              <DeleteButton
                onDelete={onDelete}
                id={file.id}
                title="Delete file"
                className="absolute bottom-3 right-3"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
