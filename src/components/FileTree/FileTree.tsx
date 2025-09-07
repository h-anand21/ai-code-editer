/**
 * src/components/FileTree/FileTree.tsx
 *
 * Displays the project's file and folder structure. Allows for file
 * selection, creation, renaming, and deletion.
 *
 * // TODO: Wire up to a real-time data source like Firestore.
 * // TODO: For AI actions, pass an auth token if required.
 */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  File,
  Folder,
  FolderOpen,
  MoreVertical,
  FilePlus2,
  Edit,
  Trash2,
} from "lucide-react";
import type { Project, FileNode, Language } from "@/types/ui";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  project: Project;
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onNewFile: () => void;
}

const LanguageBadge: React.FC<{ language?: Language }> = ({ language }) => {
  if (!language) return null;
  const badgeVariant = {
    typescript: "default",
    html: "destructive",
    css: "secondary",
    python: "default",
    json: "secondary",
    markdown: "outline",
  }[language];
  return <Badge variant={badgeVariant} className="text-xs">{language}</Badge>;
};

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
}> = ({ node, level, activeFileId, onFileSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(node.id);
  };
  
  const handleFolderClick = () => setIsOpen(!isOpen);

  const isFolder = node.type === "folder";
  const isActive = node.id === activeFileId;

  return (
    <div
      role="treeitem"
      aria-expanded={isFolder ? isOpen : undefined}
      aria-selected={isActive}
    >
      <div
        className={cn(
          "flex items-center justify-between w-full h-8 px-2 rounded-md cursor-pointer hover:bg-muted/50",
          isActive && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
        onClick={isFolder ? handleFolderClick : handleFileClick}
      >
        <div className="flex items-center gap-2 truncate">
          {isFolder ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <LanguageBadge language={node.language} />
            <FileActionsPopover onRename={() => alert('Rename ' + node.name)} onDelete={() => alert('Delete ' + node.name)} />
        </div>
      </div>
      {isFolder && isOpen && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              activeFileId={activeFileId}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileActionsPopover: React.FC<{ onRename: () => void; onDelete: () => void }> = ({ onRename, onDelete }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        <Command>
            <CommandList>
                <CommandItem onSelect={onRename}><Edit className="w-4 h-4 mr-2"/>Rename</CommandItem>
                <CommandItem onSelect={onDelete} className="text-destructive"><Trash2 className="w-4 h-4 mr-2"/>Delete</CommandItem>
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export const FileTree: React.FC<FileTreeProps> = ({
  project,
  activeFileId,
  onFileSelect,
  onNewFile,
}) => {
  
  return (
    <Card className="h-full flex flex-col rounded-none border-r w-[320px]">
      <CardHeader className="p-2 border-b">
        <div className="flex justify-between items-center">
             <CardTitle className="text-base px-2">Explorer</CardTitle>
             <Button variant="ghost" size="icon" onClick={onNewFile} aria-label="New File">
                <FilePlus2 className="w-4 h-4" />
             </Button>
        </div>
        <Command className="w-full">
          <CommandInput placeholder="Search files..." />
        </Command>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full p-2">
          <div role="tree" aria-label="File Tree">
            {project.files.map((node) => (
              <FileTreeItem
                key={node.id}
                node={node}
                level={0}
                activeFileId={activeFileId}
                onFileSelect={onFileSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
