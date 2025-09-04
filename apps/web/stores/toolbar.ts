import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToolbarStore {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMode: "current-folder" | "all-folders";
  setSearchMode: (mode: "current-folder" | "all-folders") => void;
}

export const useToolbarStore = create<ToolbarStore>()(
  persist(
    (set) => ({
      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchMode: "current-folder",
      setSearchMode: (mode) => set({ searchMode: mode }),
    }), {
    name: "toolbar",
    partialize: (state) => ({
      viewMode: state.viewMode,
    }),
  }
  )
)