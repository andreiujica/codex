import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToolbarStore {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useToolbarStore = create<ToolbarStore>()(
  persist(
    (set) => ({
      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }), {
    name: "toolbar",
    partialize: (state) => ({
      viewMode: state.viewMode,
    }),
  }
  )
)