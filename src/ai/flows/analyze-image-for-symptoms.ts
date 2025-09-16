'use server';
/**
 * @fileOverview Analyzes the image and text description provided by the user to generate
 *  a tailored first-aid guide.
 *
 * - analyzeImageForSymptoms - A function that handles the image analysis and first-aid guide generation process.
 * - AnalyzeImageForSymptomsInput - The input type for the analyzeImageForSymptoms function.
 * - AnalyzeImageForSymptomsOutput - The return type for the analyzeImageForSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageForSymptomsInputSchema = z.object({
  symptomDescription: z.string().describe('The description of the symptom.'),
  image: z
    .string()
    .describe(
      "A photo of the injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});
export type AnalyzeImageForSymptomsInput = z.infer<typeof AnalyzeImageForSymptomsInputSchema>;

const AnalyzeImageForSymptomsOutputSchema = z.object({
  severity: z
    .string()
    .describe("A string ('critical', 'urgent', or 'minor') assessing the injury."),
  steps: z.array(z.string()).describe('An array of strings, each a first-aid instruction.'),
  professional_help_needed: z
    .boolean()
    .describe('Whether or not the user should seek professional medical attention.'),
});
export type AnalyzeImageForSymptomsOutput = z.infer<typeof AnalyzeImageForSymptomsOutputSchema>;

export async function analyzeImageForSymptoms(
  input: AnalyzeImageForSymptomsInput
): Promise<AnalyzeImageForSymptomsOutput> {
  return analyzeImageForSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageForSymptomsPrompt',
  input: {schema: AnalyzeImageForSymptomsInputSchema},
  output: {schema: AnalyzeImageForSymptomsOutputSchema},
  prompt: `You are an expert first-aid assistant. Analyze the following symptom description and image (if available) to provide a tailored first-aid guide.

Symptom Description: {{{symptomDescription}}}

{{#if image}}
Image: {{media url=image}}
{{/if}}

Based on the provided information, please assess the severity of the injury, provide step-by-step first-aid instructions, and indicate whether professional medical attention is needed. Respond in JSON format with the following keys:

- severity: A string ('critical', 'urgent', or 'minor') assessing the injury.
- steps: An array of strings, each representing a clear, numbered first-aid instruction.
- professional_help_needed: A boolean indicating whether or not the user should seek professional medical attention.
`,
});

const analyzeImageForSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeImageForSymptomsFlow',
    inputSchema: AnalyzeImageForSymptomsInputSchema,
    outputSchema: AnalyzeImageForSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
