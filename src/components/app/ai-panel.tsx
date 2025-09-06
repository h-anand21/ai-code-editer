"use client";

import { useState } from "react";
import type { FileNode } from "@/lib/types";
import { getCodeSuggestion, getCodeDiagnostics } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WandSparkles, ShieldAlert } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { DiagnoseCodeForBugsOutput } from "@/ai/flows/ai-diagnose-code-for-bugs";
import type { SuggestCodeCompletionOutput } from "@/ai/flows/ai-suggest-code-completion";

type AIPanelProps = {
  activeFile: FileNode | undefined;
  activeFileContent: string;
};

export function AIPanel({ activeFile, activeFileContent }: AIPanelProps) {
  const [suggestionResult, setSuggestionResult] = useState<SuggestCodeCompletionOutput | null>(null);
  const [diagnosticsResult, setDiagnosticsResult] = useState<DiagnoseCodeForBugsOutput | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    if (!activeFile) return;
    setIsLoadingSuggestion(true);
    setSuggestionResult(null);
    const result = await getCodeSuggestion({
      code: activeFileContent,
      language: activeFile.language || "plaintext",
    });
    if (result.success && result.data) {
      setSuggestionResult(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoadingSuggestion(false);
  };

  const handleGetDiagnostics = async () => {
    if (!activeFile) return;
    setIsLoadingDiagnostics(true);
    setDiagnosticsResult(null);
    const result = await getCodeDiagnostics({
      code: activeFileContent,
      language: activeFile.language || "plaintext",
    });
    if (result.success && result.data) {
      setDiagnosticsResult(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoadingDiagnostics(false);
  };

  return (
    <aside className="w-full h-full bg-card p-4 flex flex-col gap-4 pl-6">
      <h2 className="text-lg font-semibold">AI Assistant</h2>
      <Tabs defaultValue="suggestions" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions"><WandSparkles className="mr-2 h-4 w-4" />Suggestions</TabsTrigger>
          <TabsTrigger value="diagnostics"><ShieldAlert className="mr-2 h-4 w-4" />Diagnostics</TabsTrigger>
        </TabsList>
        <TabsContent value="suggestions" className="flex-1 flex flex-col gap-4 mt-4 min-h-0">
          <Button onClick={handleGetSuggestion} disabled={!activeFile || isLoadingSuggestion}>
            <WandSparkles className="mr-2 h-4 w-4" />
            {isLoadingSuggestion ? 'Getting Suggestion...' : 'Get Suggestion'}
          </Button>
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
              {isLoadingSuggestion && (
                <Card>
                  <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                  <CardContent><Skeleton className="h-16 w-full" /></CardContent>
                </Card>
              )}
              {suggestionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suggestion</CardTitle>
                    {suggestionResult.explanation && <CardDescription>{suggestionResult.explanation}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded-md font-code text-sm overflow-x-auto">
                      <code>{suggestionResult.suggestion}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="diagnostics" className="flex-1 flex flex-col gap-4 mt-4 min-h-0">
          <Button onClick={handleGetDiagnostics} disabled={!activeFile || isLoadingDiagnostics}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            {isLoadingDiagnostics ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </Button>
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
            {isLoadingDiagnostics && (
                <Card>
                  <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                  <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                </Card>
              )}
              {diagnosticsResult && (
                <>
                <Card>
                  <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
                  <CardContent><p className="text-sm">{diagnosticsResult.analysis}</p></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Suggestions</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded-md font-code text-sm overflow-x-auto">
                      <code>{diagnosticsResult.suggestions}</code>
                    </pre>
                  </CardContent>
                </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
