# Codex API Documentation

This directory contains the Next.js API routes for the Codex project, providing a RESTful interface for managing projects, folders, and files.

## 📁 Folder Structure

```
api/
├── _lib/                           
│   ├── http.ts                     # Custom HTTP error handling
│   └── validate.ts                 # Request validation and response utilities
├── health/                         
│   └── route.ts                    # Database connectivity check
└── projects/                       
    ├── route.ts                    # List all projects
    └── [projectId]/                
        ├── contents/               
        │   └── route.ts            # Get combined folders + files per project
        ├── files/                  
        │   ├── route.ts            # List/create files in project
        │   └── [fileId]/           
        │       └── route.ts        # Get/update/delete specific file
        └── folders/                
            ├── route.ts            # List/create folders in project
            └── [folderId]/         
                └── route.ts        # Get/update/delete specific folder
```

## 🎯 Why Next.js API Routes?

We chose Next.js API routes because we wanted to keep it simple:

1. **Everything in one place**: Frontend and API code live together
2. **File-based routing**: URL structure matches the file system - no complex routing configuration
3. **Single deployment**: Deploy the entire app as one unit
4. **TypeScript everywhere**: Shared types between frontend and backend


## 🔍 Search Parameters Usage

The API extensively uses URL search parameters for filtering:

### 1. **Folder Hierarchy**

**Endpoint**: `GET /api/projects/[projectId]/folders`
- `parentId` (string|null) - Filter folders by parent
  - `null` or omitted: Root level folders
  - Folder ID: Child folders of specific parent

```bash
# Get root folders
GET /api/projects/123/folders

# Get subfolders
GET /api/projects/123/folders?parentId=folder-456
```

## 🔄 Data Validation

All POST/PATCH endpoints use Zod schemas for runtime validation:

- **File Creation**: name (1-255 chars), kind (enum), sizeBytes (non-negative int), optional folderId
- **Folder Creation**: name (1-255 chars), optional parentId
- **Updates**: All fields optional, allowing partial updates
