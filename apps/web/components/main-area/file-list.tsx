import type { FolderContents } from "@/types/api"
import { FileRow } from "./file-row"
import { FolderRow } from "./folder-row"

interface FileListProps {
  contents: FolderContents | undefined
  isLoading: boolean
  filteredContents: { files: any[], folders: any[] }
  handleFolderClick: (folderId: string) => void
  hasNoResults: boolean
}

export function FileList({ contents, isLoading, filteredContents, handleFolderClick, hasNoResults }: FileListProps) {

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-transparent rounded-lg">
              <div className="w-10 h-10 bg-muted rounded-md animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-2.5 bg-muted/60 rounded animate-pulse w-1/4" />
              </div>
              <div className="h-2.5 bg-muted/60 rounded animate-pulse w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasNoResults) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-sm">No results found</div>
          <div className="text-muted-foreground text-xs">Try a different search term</div>
        </div>
      </div>
    )
  }

  if (!contents || (contents.folders.length === 0 && contents.files.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-sm">No files or folders</div>
          <div className="text-muted-foreground text-xs">This folder is empty</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2">
      <div className="space-y-1">
        {/* Render filtered folders first */}
        {filteredContents.folders.map((folder) => (
          <FolderRow 
            key={folder.id} 
            folder={folder} 
            onFolderClick={handleFolderClick} 
          />
        ))}

        {/* Render filtered files */}
        {filteredContents.files.map((file) => (
          <FileRow key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}