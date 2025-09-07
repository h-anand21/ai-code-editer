/**
 * src/components/Editor/EditorShell.tsx
 *
 * Wrapper for the code editor (e.g., Monaco). Manages tabs for open
 * files and provides actions like format, save, and AI suggestions.
 */
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Save, Sparkles, X } from "lucide-react";
import type { FileNode } from "@/types/ui";
import { motion } from "framer-motion";
import { Textarea } from "../ui/textarea"; // Using a simple textarea as a placeholder for Monaco
import { cn } from "@/lib/utils";

interface EditorShellProps {
  file: FileNode | undefined;
  onContentChange: (fileId: string, newContent: string) => void;
  onSave: (fileId: string) => void;
  onRequestAISuggest: (fileId: string, cursorContext: string) => void;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  file,
  onContentChange,
  onSave,
  onRequestAISuggest,
}) => {
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setOpenFiles(prevOpenFiles => {
        if (!prevOpenFiles.some(f => f.id === file.id)) {
          return [...prevOpenFiles, file];
        }
        return prevOpenFiles;
      });
      setActiveTab(file.id);
    }
  }, [file]);

  const handleLocalContentChange = (fileId: string, newContent: string) => {
    onContentChange(fileId, newContent);
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    e.preventDefault();

    let newActiveTab: string | null = activeTab;
    const closedTabIndex = openFiles.findIndex(f => f.id === fileId);
    const remainingFiles = openFiles.filter(f => f.id !== fileId);

    if (activeTab === fileId) {
        if (remainingFiles.length > 0) {
            newActiveTab = remainingFiles[Math.max(0, closedTabIndex -1)].id;
        } else {
            newActiveTab = null;
        }
    }
    
    setOpenFiles(remainingFiles);
    setActiveTab(newActiveTab);
  };

  if (openFiles.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
        <Code className="w-16 h-16 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">Select a file to start coding</p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab || ""} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center border-b pr-2">
        <TabsList className="bg-transparent p-0 m-0 border-0">
          {openFiles.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="relative h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background pr-8">
              {f.name}
              <div
                role="button"
                aria-label={`Close tab for ${f.name}`}
                onClick={(e) => handleCloseTab(e, f.id)}
                className={cn(
                  "absolute top-1/2 right-1 -translate-y-1/2 h-5 w-5 ml-2 rounded-md flex items-center justify-center",
                  "hover:bg-muted"
                )}
              >
                <X className="w-3 h-3" />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          <Button variant="ghost" size="sm" onClick={() => activeTab && onSave(activeTab)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => activeTab && onRequestAISuggest(activeTab, "cursor context")}>
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            AI Suggest
          </Button>
        </div>
      </div>

      {openFiles.map(f => (
        <TabsContent key={f.id} value={f.id} className="flex-1 m-0 p-0">
          <motion.div
            key={f.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full bg-editor-bg"
          >
            <Textarea
              value={f.content || ''}
              onChange={(e) => handleLocalContentChange(f.id, e.target.value)}
              className="h-full w-full bg-transparent border-0 rounded-none resize-none font-code text-base p-4 focus-visible:ring-0"
              aria-label={`${f.name} content`}
            />
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
