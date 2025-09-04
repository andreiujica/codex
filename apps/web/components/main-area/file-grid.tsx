import type { FolderContents } from "@/types/api"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"

interface FileGridProps {
  contents: FolderContents | undefined
  isLoading: boolean
  filteredContents: { files: any[], folders: any[] }
  handleFolderClick: (folderId: string) => void
  hasNoResults: boolean
  handleDeleteFile: (fileId: string, fileName: string) => void
  handleDeleteFolder: (folderId: string, folderName: string) => void
}

export function FileGrid({ contents, isLoading, filteredContents, handleFolderClick, hasNoResults, handleDeleteFile, handleDeleteFolder }: FileGridProps) {

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="group relative">
              <div className="border border-border bg-card rounded-lg shadow-xs overflow-hidden">
                <div className="h-16 bg-muted/30 flex items-center justify-center">
                  <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                </div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-2 bg-muted/60 rounded animate-pulse w-3/4" />
                </div>
              </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {/* Render filtered folders first */}
        {filteredContents.folders.map((folder) => (
          <FolderCard 
            key={folder.id} 
            folder={folder} 
            onFolderClick={handleFolderClick} 
            onDelete={(folderId) => handleDeleteFolder(folderId, folder.name)}
          />
        ))}

        {/* Render filtered files */}
        {filteredContents.files.map((file) => (
          <FileCard 
            key={file.id} 
            file={file} 
            onDelete={(fileId) => handleDeleteFile(fileId, file.name)}
          />
        ))}
      </div>
    </div>
  )
}