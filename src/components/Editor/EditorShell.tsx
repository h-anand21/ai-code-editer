/**
 * src/components/Editor/EditorShell.tsx
 *
 * Wrapper for the code editor (e.g., Monaco). Manages tabs for open
 * files and provides actions like format, save, and AI suggestions.
 *
 * // TODO: Wire up `onSave` to a Firestore `updateDoc` call.
 * // TODO: Wire up `onRequestAISuggest` to an AI endpoint, passing auth.
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
    if (file && !openFiles.some(f => f.id === file.id)) {
        setOpenFiles(prev => [...prev, file]);
    }
    if (file) {
        setActiveTab(file.id);
    }
  }, [file]);

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeTab === fileId) {
        // If there are other files, switch to the last one, otherwise clear.
        const remainingFiles = openFiles.filter(f => f.id !== fileId);
        setActiveTab(remainingFiles.length > 0 ? remainingFiles[remainingFiles.length - 1].id : null);
    }
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
            {/* TODO: Replace this with the Monaco Editor instance */}
            <Textarea
              value={f.content}
              onChange={(e) => onContentChange(f.id, e.target.value)}
              className="h-full w-full bg-transparent border-0 rounded-none resize-none font-code text-base p-4 focus-visible:ring-0"
              aria-label={`${f.name} content`}
            />
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
