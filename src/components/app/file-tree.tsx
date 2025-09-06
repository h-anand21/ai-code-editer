"use client";

import * as React from "react";
import type { Project, FileNode } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Folder, File as FileIcon, FolderOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FileTreeProps = {
  project: Project;
  onFileSelect: (file: FileNode) => void;
  activeFileId: string | null;
};

const TreeNode = ({
  node,
  onFileSelect,
  activeFileId,
}: {
  node: FileNode;
  onFileSelect: (file: FileNode) => void;
  activeFileId: string | null;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (node.type === "folder") {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-1.5 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground py-1.5 px-2 rounded-md hover:bg-sidebar-accent cursor-pointer">
            <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-90")} />
            {isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
            <span>{node.name}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-5">
          <div className="flex flex-col space-y-1">
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child} onFileSelect={onFileSelect} activeFileId={activeFileId} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant={activeFileId === node.id ? "secondary" : "ghost"}
      className="w-full justify-start h-auto py-1.5 px-2"
      onClick={() => onFileSelect(node)}
    >
      <div className="flex items-center gap-2 text-sm font-normal">
        <FileIcon className="h-4 w-4" />
        <span>{node.name}</span>
      </div>
    </Button>
  );
};

export function FileTree({ project, onFileSelect, activeFileId }: FileTreeProps) {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          Explorer
        </h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="flex flex-col gap-1">
          {project.files.map((node) => (
            <TreeNode key={node.id} node={node} onFileSelect={onFileSelect} activeFileId={activeFileId} />
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}