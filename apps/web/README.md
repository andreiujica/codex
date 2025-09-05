# Codex Web Frontend

A modern file explorer web application built with Next.js, providing an intuitive interface for managing projects, folders, and files.


## 📁 Project Structure 

NOTE: Only the most relevant files have been added to keep it manageable in length.

```
app/
├── api/                           # Next.js API routes
├── layout.tsx                     # Root layout with providers
└── page.tsx                       # Main application page

components/
├── header/                        
│   ├── create-folder.tsx          # Folder creation dialog
│   ├── file-breadcrumb.tsx        # Navigation breadcrumbs
│   ├── toolbar.tsx                # File operations toolbar
│   └── upload-file.tsx            # File upload functionality
├── main-area/                     
│   ├── file-grid.tsx              # Grid view for files
│   ├── file-list.tsx              # List view for files
│   ├── folder-card.tsx            # Folder display component
│   └── delete-button.tsx          # File/folder deletion
└── sidebar/                       
    ├── app-sidebar.tsx            # Main sidebar container
    ├── project-list.tsx           # Project navigation
    └── nav-user.tsx               # User profile section

stores/
├── file-explorer.ts               # File browser state
├── projects.ts                    # Project management state
└── toolbar.ts                     # Toolbar view state

hooks/
├── use-file-metadata.ts           # File information utilities
├── use-project-colors.ts          # Dynamic project theming
└── use-time-ago.ts                # Relative time formatting
```

## 🔄 State Management

The app uses a hybrid approach for state management:

1. **TanStack Query**: Server state, caching, and background refetching
2. **Zustand**: Client-side UI state (view modes, selected items, etc.)
3. **React Hook Form**: Form state and validation

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`.
