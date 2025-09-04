import { api } from "@/lib/ky"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useProjectStore } from "@/stores/projects"
import { useQuery } from "@tanstack/react-query"
import type { FolderContents } from "@/types/api"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"

export function FileGrid() {
  const { activeProjectId } = useProjectStore()
  const { activeFolderId, setActiveFolderId, addToFolderHistory } = useFileExplorerStore()
  
  const { data: contents, isLoading } = useQuery<FolderContents>({
    queryKey: ["contents", activeProjectId, activeFolderId],
    queryFn: () => api.get(`projects/${activeProjectId}/contents${activeFolderId ? `?folderId=${activeFolderId}` : ""}`).json(),
    enabled: !!activeProjectId,
  })

  const handleFolderClick = (folderId: string) => {
    addToFolderHistory(folderId)
    setActiveFolderId(folderId)
  }

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
        {/* Render folders first */}
        {contents.folders.map((folder) => (
          <FolderCard 
            key={folder.id} 
            folder={folder} 
            onFolderClick={handleFolderClick} 
          />
        ))}

        {/* Render files */}
        {contents.files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}