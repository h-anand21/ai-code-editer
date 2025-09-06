'use server';

/**
 * @fileOverview Analyzes code for potential bugs and security issues, and suggests fixes and improvements.
 *
 * - diagnoseCodeForBugs - A function that handles the code diagnosis process.
 * - DiagnoseCodeForBugsInput - The input type for the diagnoseCodeForBugs function.
 * - DiagnoseCodeForBugsOutput - The return type for the diagnoseCodeForBugs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCodeForBugsInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  language: z.string().describe('The programming language of the code.'),
});
export type DiagnoseCodeForBugsInput = z.infer<typeof DiagnoseCodeForBugsInputSchema>;

const DiagnoseCodeForBugsOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the code, including potential bugs and security issues.'),
  suggestions: z.string().describe('Suggestions for fixing the identified issues and improving the code.'),
});
export type DiagnoseCodeForBugsOutput = z.infer<typeof DiagnoseCodeForBugsOutputSchema>;

export async function diagnoseCodeForBugs(input: DiagnoseCodeForBugsInput): Promise<DiagnoseCodeForBugsOutput> {
  return diagnoseCodeForBugsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCodeForBugsPrompt',
  input: {schema: DiagnoseCodeForBugsInputSchema},
  output: {schema: DiagnoseCodeForBugsOutputSchema},
  prompt: `You are an AI code analyzer. Analyze the following code for potential bugs and security issues. Provide suggestions for fixing the identified issues and improving the code.\n\nLanguage: {{{language}}}\nCode:\n{{{
    code
  }}}`,
});

const diagnoseCodeForBugsFlow = ai.defineFlow(
  {
    name: 'diagnoseCodeForBugsFlow',
    inputSchema: DiagnoseCodeForBugsInputSchema,
    outputSchema: DiagnoseCodeForBugsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
