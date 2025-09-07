export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  ownerId: string;
  createdAt: string;
  branch: string;
  collaborators: PresenceUser[];
}

export type FileNodeType = 'file' | 'folder';

export type Language = 'typescript' | 'javascript' | 'html' | 'css' | 'python' | 'json' | 'markdown';

export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  path: string;
  children?: FileNode[];
  content?: string;
  language?: Language;
  lastModified: string;
}

export interface File extends FileNode {
  type: 'file';
  content: string;
}

export interface Folder extends FileNode {
  type: 'folder';
  children: FileNode[];
}

export interface Suggestion {
  id: string;
  fileId: string;
  snippet: string;
  explanation: string;
  type: 'suggestion' | 'diagnostic';
}

export interface Diagnostic {
    id: string;
    fileId: string;
    analysis: string;
    suggestions: string;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'active' | 'idle' | 'offline';
  lastActive: string;
}
