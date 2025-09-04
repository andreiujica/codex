"use client"

import { Fragment } from "react"
import { api } from "@/lib/ky"
import { useFileExplorerStore } from "@/stores/file-explorer"
import { useProjectStore } from "@/stores/projects"
import { useQuery } from "@tanstack/react-query"
import type { Folder } from "@/types/api"
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@workspace/ui/components/breadcrumb"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"

export function FileBreadcrumb() {
  const { activeProjectId } = useProjectStore()
  const { folderHistory, popUntilFolderId, goToRoot, goBack, canGoBack } = useFileExplorerStore()

  /**
   * We fetch the folder data for all folders in the history.
   */
  const folderQueries = useQuery({
    queryKey: ["breadcrumb-folders", activeProjectId, folderHistory],
    queryFn: async () => {
      if (!activeProjectId || folderHistory.length === 0) return []
      
      const folderPromises = folderHistory.map(folderId =>
        api.get(`projects/${activeProjectId}/folders/${folderId}`).json<Folder>()
      )
      
      return Promise.all(folderPromises)
    },
    enabled: !!activeProjectId && folderHistory.length > 0,
  })

  const handleFolderClick = (folderId: string) => {
    popUntilFolderId(folderId)
  }

  if (folderQueries.isLoading) {
    return (
      <div className="flex items-center gap-2">
        {/* Navigation arrows */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goBack}
            disabled={!canGoBack()}
            title="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {/* NOTE: We don't support going forward yet, as that would require
            * storing the navigation history. Part of the next release. Therefore,
            * we just disable the forwardbutton.
            */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={true}
            title="Go forward (not available)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); goToRoot() }}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {folderHistory.map((_, index) => (
              <Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Skeleton className="h-4 w-20" />
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  const folders = folderQueries.data || []

  return (
    <div className="flex items-center gap-2">
      {/* Navigation arrows */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={goBack}
          disabled={!canGoBack()}
          title="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {/* NOTE: We don't support going forward yet, as that would require
          * storing the navigation history. Part of the next release. Therefore,
          * we just disable the forwardbutton.
          */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={true}
          title="Go forward (not available)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

      <Breadcrumb>
        <BreadcrumbList>
        {/* Home/Root level */}
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="#" 
            onClick={(e) => { 
              e.preventDefault()
              goToRoot()
            }}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Folder breadcrumbs */}
        {folders.map((folder, index) => {
          const isLast = index === folders.length - 1
          
          return (
            <Fragment key={folder.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFolderClick(folder.id)
                    }}
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
