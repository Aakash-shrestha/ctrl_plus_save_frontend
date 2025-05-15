// src/types.ts
// src/components/types.ts
export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: string;
  parentId: string;
  starred: boolean;
  url: string;
  tempUrl?: string;
  urlNeedsRegeneration?: boolean;
  verified: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}
  
  export interface FileListContents {
    files: File[];
    folders: Folder[];
  }
  
  export interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    createFolder: (name: string) => void;
  }
  
  export interface SidebarProps {
    folders: Folder[];
    currentFolder: string;
    navigateToFolder: (folderId: string) => void;
    files: File[];
  }
  
  export interface FileListProps {
    contents: FileListContents;
    viewMode: 'grid' | 'list';
    onFolderClick: (folderId: string) => void;
    onDelete: (id: string, isFolder: boolean) => void;
    onToggleStar: (id: string) => void;
  }
  
  export interface FileUploadProps {
    onFileUpload: (files: FileList) => void;
  }

  export interface File {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: string;
    parentId: string;
    starred: boolean;
    url: string;
  }
  
  export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
  }