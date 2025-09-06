/**
 * src/components/RightPanel/RightPanel.tsx
 *
 * Right-side panel with tabs for AI Suggestions, Diagnostics, Live Preview,
 * and a developer console.
 *
 * // TODO: Wire up Suggestion actions (Copy, Apply, Explain)
 * // TODO: Implement live preview sharing by calling a backend endpoint.
 */
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Bot,
  ClipboardCopy,
  Code2,
  ExternalLink,
  Play,
  Share2,
  ThumbsUp,
  FileQuestion,
  Terminal
} from "lucide-react";
import type { Suggestion, FileNode } from "@/types/ui";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";

interface RightPanelProps {
  suggestions: Suggestion[];
  activeFile: FileNode | undefined;
}

const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="shadow-md hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>{suggestion.type === 'diagnostic' ? "Diagnostic" : "Suggestion"}</span>
        </CardTitle>
        <CardDescription className="text-xs pt-1">{suggestion.explanation}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted/50 p-3 rounded-lg text-xs font-code overflow-x-auto whitespace-pre-wrap break-words">
          <code>{suggestion.snippet}</code>
        </pre>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" aria-label="Explain suggestion">
          <FileQuestion className="w-4 h-4 mr-1" /> Explain
        </Button>
        <Button variant="ghost" size="sm" aria-label="Copy code snippet">
          <ClipboardCopy className="w-4 h-4 mr-1" /> Copy
        </Button>
        <Button size="sm" aria-label="Apply suggestion">
          <ThumbsUp className="w-4 h-4 mr-1" /> Apply
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

export const RightPanel: React.FC<RightPanelProps> = ({ suggestions, activeFile }) => {
  const isWebViewable = activeFile?.language === 'html';
  
  return (
    <Card className="h-full flex flex-col rounded-none border-l">
      <Tabs defaultValue="suggestions" className="flex-1 flex flex-col min-h-0">
        <CardHeader className="p-2">
            <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="suggestions" className="text-xs"><Bot className="w-4 h-4 mr-1"/>Suggestions</TabsTrigger>
            <TabsTrigger value="diagnostics" className="text-xs"><Code2 className="w-4 h-4 mr-1"/>Diagnostics</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs" disabled={!isWebViewable}><Play className="w-4 h-4 mr-1"/>Preview</TabsTrigger>
            <TabsTrigger value="console" className="text-xs"><Terminal className="w-4 h-4 mr-1"/>Console</TabsTrigger>
            </TabsList>
        </CardHeader>

        <Separator />
        
        <div className="flex-1 overflow-hidden">
            <TabsContent value="suggestions" className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {suggestions.filter(s => s.type === 'suggestion').map(s => (
                    <SuggestionCard key={s.id} suggestion={s} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="diagnostics" className="m-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {suggestions.filter(s => s.type === 'diagnostic').map(s => (
                    <SuggestionCard key={s.id} suggestion={s} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="preview" className="m-0 h-full flex flex-col">
              <div className="p-2 border-b flex items-center justify-end gap-2">
                {/* TODO: Implement share preview link functionality */}
                <Button variant="ghost" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
                <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4 mr-1" /> Open</Button>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  srcDoc={activeFile?.content || ''}
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0"
                />
              </div>
            </TabsContent>

            <TabsContent value="console" className="m-0 h-full">
                 <div className="p-4 text-sm text-muted-foreground">
                    Console output will appear here.
                 </div>
            </TabsContent>
        </div>

      </Tabs>
    </Card>
  );
};
