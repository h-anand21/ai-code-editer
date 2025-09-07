/**
 * src/components/Layout/EditorLayout.tsx
 *
 * The main CSS grid layout for the editor. Manages the responsive
 * behavior of the FileTree, EditorShell, and RightPanel.
 */
"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileTree } from "../FileTree/FileTree";
import { EditorShell } from "../Editor/EditorShell";
import { RightPanel } from "../RightPanel/RightPanel";
import { TopBar } from "../TopBar/TopBar";
import { mockProject, mockSuggestions } from "@/lib/mock-data";
import { OnboardingModal } from "../Onboarding/OnboardingModal";
import { PresenceBar } from "../Presence/PresenceBar";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, SidebarTrigger, SidebarContent } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import type { FileNode, Project } from "@/types/ui";
import { formatDistanceToNow } from "date-fns";

export function EditorLayout() {
  const isMobile = useIsMobile();
  const [project, setProject] = React.useState<Project>(mockProject);
  const [activeFileId, setActiveFileId] = React.useState<string | null>("3");
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);
  
  // Create a state to hold the content of the files.
  // Initialize with content from mock data.
  const allFiles = project.files.flatMap(f => f.type === 'folder' ? (f.children ?? []) : f);
  const initialFileContents = Object.fromEntries(
    allFiles.map(f => [f.id, f.content || ''])
  );
  const [fileContents, setFileContents] = React.useState<Record<string, string>>(initialFileContents);


  const activeFile = allFiles.find(f => f?.id === activeFileId);
  const activeFileWithContent = activeFile ? { ...activeFile, content: fileContents[activeFile.id] } : undefined;


  const handleNewFile = () => {
    const fileName = prompt("Enter new file name:");
    if (fileName) {
      const newFile: FileNode = {
        id: `file-${Date.now()}`,
        name: fileName,
        path: `/${fileName}`,
        type: "file",
        content: `// ${fileName}`,
        language: "typescript",
        lastModified: formatDistanceToNow(new Date(), { addSuffix: true }),
      };
      setProject(prev => ({
        ...prev,
        files: [...prev.files, newFile]
      }));
      setFileContents(prev => ({ ...prev, [newFile.id]: newFile.content || '' }));
      setActiveFileId(newFile.id);
    }
  };

  const handleContentChange = (fileId: string, newContent: string) => {
    setFileContents(prev => ({
      ...prev,
      [fileId]: newContent,
    }));
  };

  const handleRunCode = () => {
    if (!activeFileWithContent) {
      setConsoleOutput(prev => [...prev, "Error: No active file to run."]);
      return;
    }

    setConsoleOutput(prev => [...prev, `> Running ${activeFileWithContent.name}...`]);

    // Super simple "runner" for demo purposes.
    // WARNING: Using Function constructor is not safe for real applications.
    try {
      if (activeFileWithContent.language === 'typescript' || activeFileWithContent.language === 'json') {
          // A real implementation would transpile TSX/TS first.
          // For now, we'll just use a sandboxed Function constructor.
          const capturedLogs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => {
              capturedLogs.push(args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '));
          };
          
          const func = new Function('console', activeFileWithContent.content || '');
          func({ log: console.log });
          
          console.log = originalLog;
          setConsoleOutput(prev => [...prev, ...capturedLogs, `✅ Finished running ${activeFileWithContent.name}`]);

      } else {
          setConsoleOutput(prev => [...prev, `Cannot run file type: ${activeFileWithContent.language}`]);
      }
    } catch (error: any) {
      setConsoleOutput(prev => [...prev, `Error: ${error.message}`]);
    }
  };


  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <TopBar project={project} onRun={handleRunCode} />
        <div className="flex-1 overflow-hidden">
          <main className="h-full flex flex-col">
            <EditorShell
              file={activeFileWithContent}
              onContentChange={handleContentChange}
              onSave={(id) => console.log(`Save ${id}`)}
              onRequestAISuggest={(id, context) => console.log(`AI Suggest for ${id} at ${context}`)}
            />
          </main>
        </div>
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" aria-label="Toggle File Tree">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <FileTree
                project={project}
                activeFileId={activeFileId}
                onFileSelect={(id) => setActiveFileId(id)}
                onNewFile={handleNewFile}
              />
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" aria-label="Toggle Right Panel">
                <PanelRight className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-80">
               <RightPanel
                    suggestions={mockSuggestions.filter(s => s.fileId === activeFileId)}
                    activeFile={activeFile}
                    consoleOutput={consoleOutput}
                />
            </SheetContent>
          </Sheet>
        </div>
        <OnboardingModal />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar project={project} onRun={handleRunCode}/>
      <div className="flex-1 grid grid-cols-[auto_1fr_auto] overflow-hidden">
        {/* Left Panel: File Tree */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FileTree
            project={project}
            activeFileId={activeFileId}
            onFileSelect={(id) => setActiveFileId(id)}
            onNewFile={handleNewFile}
          />
        </motion.div>

        {/* Center Panel: Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <EditorShell
            file={activeFileWithContent}
            onContentChange={handleContentChange}
            onSave={(id) => console.log(`Save ${id}`)}
            onRequestAISuggest={(id, context) => console.log(`AI Suggest for ${id} at ${context}`)}
          />
        </main>

        {/* Right Panel: AI/Tools */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <AnimatePresence>
                {activeFile && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-[360px] h-full"
                    >
                        <RightPanel
                            suggestions={mockSuggestions.filter(s => s.fileId === activeFileId)}
                            activeFile={activeFile}
                            consoleOutput={consoleOutput}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </div>
      <OnboardingModal />
    </div>
  );
}
