"use server";

import { diagnoseCodeForBugs, DiagnoseCodeForBugsInput } from '@/ai/flows/ai-diagnose-code-for-bugs';
import { suggestCodeCompletion, SuggestCodeCompletionInput } from '@/ai/flows/ai-suggest-code-completion';

export async function getCodeSuggestion(input: SuggestCodeCompletionInput) {
  try {
    const result = await suggestCodeCompletion({
      fileContent: input.fileContent,
      cursorContext: input.cursorContext,
      language: input.language,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting code suggestion:", error);
    return { success: false, error: "Failed to get AI suggestion." };
  }
}

export async function getCodeDiagnostics(input: DiagnoseCodeForBugsInput) {
  try {
    const result = await diagnoseCodeForBugs({
      code: input.code,
      language: input.language,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting code diagnostics:", error);
    return { success: false, error: "Failed to run AI diagnostics." };
  }
}
