export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  ownerId: string;
  createdAt: string;
}

export type FileNodeType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  children?: FileNode[];
  content?: string;
  language?: 'typescript' | 'html' | 'css' | 'python' | 'json';
}

export interface File extends FileNode {
  type: 'file';
  content: string;
}

export interface Folder extends FileNode {
  type: 'folder';
  children: FileNode[];
}
