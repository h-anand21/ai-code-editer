"use client";

import { useState, useMemo } from "react";
import type { FileNode } from "@/lib/types";
import { mockProject } from "@/lib/mock-data";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app/header";
import { FileTree } from "@/components/app/file-tree";
import { EditorPane } from "@/components/app/editor-pane";
import { AIPanel } from "@/components/app/ai-panel";
import { useIsMobile } from "@/hooks/use-mobile";

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
          <FileTree project={mockProject} onFileSelect={handleFileSelect} />
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
              <AIPanel
                activeFile={activeFile}
                activeFileContent={activeFileContent}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
