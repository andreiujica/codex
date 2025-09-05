export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  createdAt: string;
}

export interface File {
  id: string;
  projectId: string;
  folderId: string | null;
  name: string;
  kind: string;
  sizeBytes: number;
  uploadedAt: string;
  deletedAt: string | null;
}

export type FileMetadata = Omit<File, 'id' | 'projectId' | 'folderId' | 'uploadedAt' | 'deletedAt'>

export interface FolderContents {
  folders: Folder[];
  files: File[];
}