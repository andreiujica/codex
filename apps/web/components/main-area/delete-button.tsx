import { Trash2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface DeleteButtonProps {
  onDelete: (id: string) => void
  id: string
  title?: string
  className?: string
}

export function DeleteButton({ onDelete, id, title = "Delete", className }: DeleteButtonProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <div
      onClick={handleDeleteClick}
      className={cn(
        "size-7 p-0 transition-all duration-200 cursor-pointer",
        "bg-destructive/60 hover:bg-destructive/80 text-white rounded-md",
        "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
        "flex items-center justify-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        className
      )}
      title={title}
      tabIndex={-1}
    >
      <Trash2 className="size-4" />
    </div>
  )
}
