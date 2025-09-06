"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { FileNode } from "@/lib/types";
import { mockProject } from "@/lib/mock-data";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app/header";
import { FileTree } from "@/components/app/file-tree";
import { EditorPane } from "@/components/app/editor-pane";
import { AIPanel } from "@/components/app/ai-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function getInitialFileContents(nodes: FileNode[]): Record<string, string> {
  const contents: Record<string, string> = {};
  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === "file" && node.content) {
        contents[node.id] = node.content;
      }
      if (node.type === "folder" && node.children) {
        traverse(node.children);
      }
    }
  }
  traverse(nodes);
  return contents;
}

const ResizablePanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [width, setWidth] = useState(384); // Corresponds to w-96
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && panelRef.current) {
        const newWidth =
          panelRef.current.parentElement!.getBoundingClientRect().right -
          e.clientX;
        const minWidth = 256; // w-64
        const maxWidth = 640; // w-160
        if (newWidth > minWidth && newWidth < maxWidth) {
          setWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={panelRef}
      className={cn("relative shrink-0", className)}
      style={{ width: `${width}px` }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 h-full w-2 cursor-col-resize group flex items-center justify-center"
      >
        <div className="w-px h-full bg-border group-hover:bg-primary transition-colors" />
      </div>
      {children}
    </div>
  );
};


export function MainLayout() {
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => getInitialFileContents(mockProject.files));
  const isMobile = useIsMobile();
  
  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      if (!openFiles.some((f) => f.id === file.id)) {
        setOpenFiles([...openFiles, file]);
      }
      setActiveFileId(file.id);
    }
  };

  const handleCloseTab = (fileId: string) => {
    const fileIndex = openFiles.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return;

    const newOpenFiles = openFiles.filter((f) => f.id !== fileId);
    setOpenFiles(newOpenFiles);

    if (activeFileId === fileId) {
      if (newOpenFiles.length > 0) {
        // Activate the previous tab, or the first one if it was the first tab
        const newIndex = Math.max(0, fileIndex - 1);
        setActiveFileId(newOpenFiles[newIndex].id);
      } else {
        setActiveFileId(null);
      }
    }
  };
  
  const handleContentChange = (fileId: string, newContent: string) => {
    setFileContents((prev) => ({ ...prev, [fileId]: newContent }));
  };

  const activeFile = useMemo(() => {
    return openFiles.find(f => f.id === activeFileId);
  }, [activeFileId, openFiles]);

  const activeFileContent = activeFile ? fileContents[activeFile.id] : "";

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <AppHeader projectName={mockProject.name} />
        <div className="flex flex-1 overflow-hidden">
          <FileTree project={mockProject} onFileSelect={handleFileSelect} activeFileId={activeFileId} />
          <main className="flex flex-1 min-w-0">
            <div className="flex-1 flex flex-col min-w-0">
              <EditorPane
                openFiles={openFiles}
                activeFileId={activeFileId}
                onActiveFileChange={setActiveFileId}
                onCloseTab={handleCloseTab}
                fileContents={fileContents}
                onContentChange={handleContentChange}
              />
            </div>
            {!isMobile && (
              <ResizablePanel>
                <AIPanel
                  activeFile={activeFile}
                  activeFileContent={activeFileContent}
                />
              </ResizablePanel>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}