"use client";

import type { FileNode } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Code } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

type EditorPaneProps = {
  openFiles: FileNode[];
  activeFileId: string | null;
  onActiveFileChange: (id: string | null) => void;
  onCloseTab: (id: string) => void;
  fileContents: Record<string, string>;
  onContentChange: (id: string, content: string) => void;
};

export function EditorPane({
  openFiles,
  activeFileId,
  onActiveFileChange,
  onCloseTab,
  fileContents,
  onContentChange,
}: EditorPaneProps) {
  if (openFiles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <Code className="mx-auto h-12 w-12" />
          <p className="mt-4 text-sm">Select a file to begin editing</p>
          <p className="mt-1 text-xs">or create a new file.</p>
        </div>
      </div>
    );
  }

  const handleCloseClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    onCloseTab(fileId);
  };

  return (
    <Tabs
      value={activeFileId ?? ""}
      onValueChange={(value) => onActiveFileChange(value)}
      className="flex-1 flex flex-col min-h-0"
    >
      <div className="flex-shrink-0 border-b">
        <ScrollArea orientation="horizontal">
          <TabsList className="bg-transparent p-0 rounded-none gap-0">
            {openFiles.map((file) => (
              <TabsTrigger
                key={file.id}
                value={file.id}
                className="h-10 px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-none hover:bg-accent flex items-center gap-2 group"
              >
                <span>{file.name}</span>
                <div
                  role="button"
                  aria-label={`Close ${file.name} tab`}
                  onClick={(e) => handleCloseClick(e, file.id)}
                  className="ml-2 p-1 rounded-full hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>
      {openFiles.map((file) => (
        <TabsContent
          key={file.id}
          value={file.id}
          className="flex-1 m-0 p-0"
        >
          <Textarea
            value={fileContents[file.id] || ""}
            onChange={(e) => onContentChange(file.id, e.target.value)}
            className="font-code text-base h-full w-full resize-none border-none rounded-none focus-visible:ring-0 bg-background text-gray-200"
            placeholder={`// ${file.name}`}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}