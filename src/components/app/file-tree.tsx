"use client";

import * as React from "react";
import type { Project, FileNode } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, File as FileIcon, FolderOpen } from "lucide-react";

type FileTreeProps = {
  project: Project;
  onFileSelect: (file: FileNode) => void;
};

const TreeNode = ({
  node,
  onFileSelect,
}: {
  node: FileNode;
  onFileSelect: (file: FileNode) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (node.type === "folder") {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pl-4">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground py-1.5 px-2 rounded-md hover:bg-sidebar-accent">
            {isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
            <span>{node.name}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col">
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child} onFileSelect={onFileSelect} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="pl-4">
      <Button
        variant="ghost"
        className="w-full justify-start h-auto py-1.5 px-2"
        onClick={() => onFileSelect(node)}
      >
        <div className="flex items-center gap-2 text-sm font-normal">
          <FileIcon className="h-4 w-4" />
          <span>{node.name}</span>
        </div>
      </Button>
    </div>
  );
};

export function FileTree({ project, onFileSelect }: FileTreeProps) {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          Explorer
        </h2>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <div className="flex flex-col gap-1">
          {project.files.map((node) => (
            <TreeNode key={node.id} node={node} onFileSelect={onFileSelect} />
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
