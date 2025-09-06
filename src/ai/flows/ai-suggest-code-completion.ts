// src/ai/flows/ai-suggest-code-completion.ts
'use server';

/**
 * @fileOverview AI-powered code completion and refactoring suggestions.
 *
 * This file defines a Genkit flow that provides AI-powered code completions,
 * refactoring suggestions, or explanations based on the current file content
 * and cursor context.
 *
 * @file        ai-suggest-code-completion.ts
 * @exports   suggestCodeCompletion - A function that handles the code completion process.
 * @exports   SuggestCodeCompletionInput - The input type for the suggestCodeCompletion function.
 * @exports   SuggestCodeCompletionOutput - The return type for the suggestCodeCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeCompletionInputSchema = z.object({
  fileContent: z.string().describe('The content of the current file.'),
  cursorContext: z.string().describe('The context around the cursor position.'),
  language: z.string().describe('The programming language of the file.'),
});
export type SuggestCodeCompletionInput = z.infer<typeof SuggestCodeCompletionInputSchema>;

const SuggestCodeCompletionOutputSchema = z.object({
  suggestion: z.string().describe('The AI-powered code completion suggestion.'),
  explanation: z.string().optional().describe('An optional explanation of the suggestion.'),
});
export type SuggestCodeCompletionOutput = z.infer<typeof SuggestCodeCompletionOutputSchema>;

export async function suggestCodeCompletion(input: SuggestCodeCompletionInput): Promise<SuggestCodeCompletionOutput> {
  return suggestCodeCompletionFlow(input);
}

const suggestCodeCompletionPrompt = ai.definePrompt({
  name: 'suggestCodeCompletionPrompt',
  input: {schema: SuggestCodeCompletionInputSchema},
  output: {schema: SuggestCodeCompletionOutputSchema},
  prompt: `You are an AI code assistant that provides code completions, refactoring suggestions, and explanations.

  Based on the current file content, cursor context, and programming language, provide a code completion suggestion that seamlessly integrates with the existing code.
  Also provide an optional explanation of the suggestion.

  Language: {{{language}}}
  File Content:
  {{fileContent}}

  Cursor Context:
  {{cursorContext}}

  Suggestion:`,
});

const suggestCodeCompletionFlow = ai.defineFlow(
  {
    name: 'suggestCodeCompletionFlow',
    inputSchema: SuggestCodeCompletionInputSchema,
    outputSchema: SuggestCodeCompletionOutputSchema,
  },
  async input => {
    const {output} = await suggestCodeCompletionPrompt(input);
    return output!;
  }
);
