"use client"

import { useState } from "react"
import { Search, Grid3X3, List, X, Grid2x2, Folder, Globe } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { useToolbarStore } from "../../stores/toolbar"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, searchMode, setSearchMode } = useToolbarStore()
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearchToggle = () => {
    if (isSearchActive) {
      setSearchQuery("")
      setIsSearchActive(false)
    } else {
      setIsSearchActive(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("")
      setIsSearchActive(false)
    }
  }

  return (
    <div className={cn("flex items-center gap-8 justify-end px-4 bg-background", className)}>
      <ThemeToggle />
      
      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => {
            if (value) setViewMode(value as "list" | "grid")
          }}
          variant="default"
          size="sm" 
        >
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid2x2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>


      <div className="flex items-center">
        {isSearchActive ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder={searchMode === "current-folder" ? "Search in current folder..." : "Search all folders..."}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-64 pr-20"
                autoFocus
              />
              <ToggleGroup
                type="single"
                value={searchMode}
                onValueChange={(value) => {
                  if (value) setSearchMode(value as "current-folder" | "all-folders")
                }}
                variant="default"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <ToggleGroupItem value="current-folder" aria-label="Search current folder">
                  <Folder className="h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="all-folders" aria-label="Search all folders">
                  <Globe className="h-3 w-3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            aria-label="Search files"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
