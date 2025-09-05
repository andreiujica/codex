import { create } from "zustand";

interface FileExplorerStore {
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  folderHistory: string[];
  addToFolderHistory: (id: string) => void;
  popUntilFolderId: (id: string) => void;
  goToRoot: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
}

export const useFileExplorerStore = create<FileExplorerStore>()(
    (set, get) => ({
      activeFolderId: null,
      setActiveFolderId: (id) => set({ activeFolderId: id }),

      /**
       * The folder history is a stack of folder IDs that the user has visited.
       * It will be displayed in the breadcrumb component to show the user's path.
       */
      folderHistory: [],
      addToFolderHistory: (id) => set((state) => ({ folderHistory: [...state.folderHistory, id] })),

      /**
       * We will use this to navigate back to whatever folder the user clicked on.
       */
      popUntilFolderId: (id) => set((state) => {
        const index = state.folderHistory.indexOf(id);
        if (index === -1) {
          /**
           * If the folder ID is not found, return the current state unchanged
           */
          return { folderHistory: state.folderHistory };
        }
        /**
         * Keep everything up to and including the target folder ID
         */
        const newHistory = state.folderHistory.slice(0, index + 1);
        return { 
          folderHistory: newHistory,
          activeFolderId: newHistory.length > 0 ? newHistory[newHistory.length - 1] : null
        };
      }),

      /**
       * Navigate back to the root folder (clear all history)
       */
      goToRoot: () => set({ folderHistory: [], activeFolderId: null }),

      /**
       * Go back one level in the folder history
       */
      goBack: () => set((state) => {
        if (state.folderHistory.length === 0) {
          return state; 
        }
        
        const newHistory = state.folderHistory.slice(0, -1);
        return {
          folderHistory: newHistory,
          activeFolderId: newHistory.length > 0 ? newHistory[newHistory.length - 1] : null
        };
      }),

      /**
       * Check if we can go back (not at root level)
       */
      canGoBack: (): boolean => {
        const state = get();
        return state.folderHistory.length > 0;
      },
    }), 
)