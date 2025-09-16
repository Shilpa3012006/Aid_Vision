'use server';
/**
 * @fileOverview Generates a tailored first-aid guide based on user input.
 *
 * - generateFirstAidGuide - A function that generates a first-aid guide.
 * - GenerateFirstAidGuideInput - The input type for the generateFirstAidGuide function.
 * - GenerateFirstAidGuideOutput - The return type for the generateFirstAidGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFirstAidGuideInputSchema = z.object({
  description: z.string().describe('The description of the symptom or injury.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateFirstAidGuideInput = z.infer<typeof GenerateFirstAidGuideInputSchema>;

const GenerateFirstAidGuideOutputSchema = z.object({
  severity: z
    .enum(['critical', 'urgent', 'minor'])
    .describe('Assessing the severity of the injury.'),
  steps: z.string().array().describe('Clear, numbered first-aid instructions.'),
  professional_help_needed: z
    .boolean()
    .describe('Indicates if the user should seek professional medical attention.'),
});
export type GenerateFirstAidGuideOutput = z.infer<typeof GenerateFirstAidGuideOutputSchema>;

export async function generateFirstAidGuide(
  input: GenerateFirstAidGuideInput
): Promise<GenerateFirstAidGuideOutput> {
  return generateFirstAidGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFirstAidGuidePrompt',
  input: {schema: GenerateFirstAidGuideInputSchema},
  output: {schema: GenerateFirstAidGuideOutputSchema},
  prompt: `You are an AI-powered first-aid assistant. You will generate a tailored first-aid guide based on the user's input.

  The guide should include:
  - severity: Assessing the severity of the injury (critical, urgent, or minor).
  - steps: Clear, numbered first-aid instructions.
  - professional_help_needed: Indicates if the user should seek professional medical attention (true or false).

  Description: {{{description}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Please return a structured JSON response.
  {
    "severity": "severity",
    "steps": ["step 1", "step 2", ...],
    "professional_help_needed": true/false
  }`,
});

const generateFirstAidGuideFlow = ai.defineFlow(
  {
    name: 'generateFirstAidGuideFlow',
    inputSchema: GenerateFirstAidGuideInputSchema,
    outputSchema: GenerateFirstAidGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
