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
import { mockProject } from "@/lib/mock-data";
import { OnboardingModal } from "../Onboarding/OnboardingModal";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import type { FileNode, Project, Suggestion, Diagnostic } from "@/types/ui";
import { formatDistanceToNow } from "date-fns";
import { getCodeSuggestion, getCodeDiagnostics } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";

export function EditorLayout() {
  const isMobile = useIsMobile();
  const [project, setProject] = React.useState<Project>(mockProject);
  const [activeFileId, setActiveFileId] = React.useState<string | null>("3");
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [diagnostics, setDiagnostics] = React.useState<Diagnostic | null>(null);
  const { toast } = useToast();

  const getAllFiles = (files: FileNode[]): FileNode[] => {
    return files.flatMap(f => (f.type === 'folder' && f.children) ? [f, ...getAllFiles(f.children)] : [f]);
  }

  const [allFiles, setAllFiles] = React.useState<FileNode[]>(() => getAllFiles(project.files));

  const initialFileContents = React.useMemo(() => {
    const allProjectFiles = getAllFiles(mockProject.files);
    return Object.fromEntries(
      allProjectFiles.filter(f => f.type === 'file').map(f => [f.id, f.content || ''])
    );
  }, []);

  const [fileContents, setFileContents] = React.useState<Record<string, string>>(initialFileContents);

  React.useEffect(() => {
    const allProjectFiles = getAllFiles(project.files);
    setAllFiles(allProjectFiles);
    setFileContents(Object.fromEntries(
        allProjectFiles.filter(f => f.type === 'file').map(f => [f.id, f.content || ''])
    ));
  }, [project]);

  const activeFile = allFiles.find(f => f?.id === activeFileId);
  const activeFileWithContent = activeFile ? { ...activeFile, content: fileContents[activeFile.id] ?? '' } : undefined;


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
      
      const updatedProjectFiles = [...project.files, newFile];
      setProject(prev => ({ ...prev, files: updatedProjectFiles }));

      setActiveFileId(newFile.id);
    }
  };

  const handleContentChange = (fileId: string, newContent: string) => {
    setFileContents(prev => ({
      ...prev,
      [fileId]: newContent,
    }));
  };

  const handleSave = (fileId: string) => {
    const file = allFiles.find(f => f.id === fileId);
    if (file) {
      toast({
        title: "File Saved!",
        description: `Successfully saved ${file.name}.`,
      });
    }
  };

  const handleRunCode = () => {
    if (!activeFileWithContent) {
      setConsoleOutput(prev => [...prev, 'Error: No active file to run.']);
      return;
    }

    const initialMessage = `> Running ${activeFileWithContent.name}...`;
    const finalOutput = [initialMessage];

    try {
      if (
        activeFileWithContent.language === 'typescript' ||
        activeFileWithContent.language === 'json'
      ) {
        const capturedLogs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => {
            capturedLogs.push(
              args
                .map(arg =>
                  typeof arg === 'object'
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(' ')
            );
          },
        };

        // This is a sandboxed execution of the user's code.
        const func = new Function('console', activeFileWithContent.content || '');
        func(customConsole);
        
        finalOutput.push(...capturedLogs);
        finalOutput.push(`\n✅ Finished running ${activeFileWithContent.name}`);

      } else {
        finalOutput.push(`Cannot run file type: ${activeFileWithContent.language}`);
      }
    } catch (error: any) {
      finalOutput.push(`\n❌ Error: ${error.message}`);
    }
    setConsoleOutput(finalOutput);
  };

  const handleRequestAISuggest = async (fileId: string, cursorContext: string) => {
    const file = allFiles.find(f => f.id === fileId);
    if (!file || file.type !== 'file') return;

    const content = fileContents[fileId] ?? file.content ?? '';
    
    toast({ title: 'AI Suggestion', description: 'Generating AI suggestion...' });
    const result = await getCodeSuggestion({
      fileContent: content,
      cursorContext: cursorContext,
      language: file.language || 'plaintext',
    });

    if (result.success && result.data) {
      const newSuggestion: Suggestion = {
        id: `sug-${Date.now()}`,
        fileId: fileId,
        type: 'suggestion',
        snippet: result.data.suggestion,
        explanation: result.data.explanation || 'AI-generated suggestion',
      };
      setSuggestions(prev => [newSuggestion, ...prev]);
      toast({ title: 'AI Suggestion', description: 'New suggestion added!' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  const handleRequestDiagnostics = async () => {
    if (!activeFileWithContent) return;

    toast({ title: "AI Diagnostics", description: "Running diagnostics..." });
    setDiagnostics(null);

    const result = await getCodeDiagnostics({
      code: activeFileWithContent.content || "",
      language: activeFileWithContent.language || "plaintext",
    });

    if (result.success && result.data) {
      setDiagnostics({
        id: `diag-${Date.now()}`,
        fileId: activeFileWithContent.id,
        ...result.data,
      });
      toast({ title: "AI Diagnostics", description: "Diagnostics complete!" });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };
  
  const handleApplySuggestion = (fileId: string, snippet: string) => {
    handleContentChange(fileId, snippet);
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to the file.",
    });
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
              onSave={handleSave}
              onRequestAISuggest={handleRequestAISuggest}
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
                    suggestions={suggestions.filter(s => s.fileId === activeFileId)}
                    diagnostics={diagnostics?.fileId === activeFileId ? diagnostics : null}
                    activeFile={activeFileWithContent}
                    consoleOutput={consoleOutput}
                    onRequestDiagnostics={handleRequestDiagnostics}
                    onApplySuggestion={handleApplySuggestion}
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
            onSave={handleSave}
            onRequestAISuggest={handleRequestAISuggest}
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
                            suggestions={suggestions.filter(s => s.fileId === activeFileId)}
                            diagnostics={diagnostics?.fileId === activeFileId ? diagnostics : null}
                            activeFile={activeFileWithContent}
                            consoleOutput={consoleOutput}
                            onRequestDiagnostics={handleRequestDiagnostics}
                            onApplySuggestion={handleApplySuggestion}
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
