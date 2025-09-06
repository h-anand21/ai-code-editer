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

export function EditorLayout() {
  const isMobile = useIsMobile();
  const [activeFileId, setActiveFileId] = React.useState<string | null>("3");

  const activeFile = mockProject.files
    .flatMap(f => f.type === 'folder' ? f.children : f)
    .find(f => f?.id === activeFileId);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <TopBar project={mockProject} />
        <div className="flex-1 overflow-hidden">
          <main className="h-full flex flex-col">
            <EditorShell
              file={activeFile}
              onContentChange={(id, content) => console.log({ id, content })}
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
                project={mockProject}
                activeFileId={activeFileId}
                onFileSelect={(id) => setActiveFileId(id)}
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
      <TopBar project={mockProject} />
      <div className="flex-1 grid grid-cols-[auto_1fr_auto] overflow-hidden">
        {/* Left Panel: File Tree */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FileTree
            project={mockProject}
            activeFileId={activeFileId}
            onFileSelect={(id) => setActiveFileId(id)}
          />
        </motion.div>

        {/* Center Panel: Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <EditorShell
            file={activeFile}
            onContentChange={(id, content) => console.log({ id, content })}
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
