'use server';
/**
 * @fileOverview Classifies the difficulty of a Nepali word using AI.
 *
 * - classifyWordDifficulty - A function that classifies the difficulty of a Nepali word.
 * - ClassifyWordDifficultyInput - The input type for the classifyWordDifficulty function.
 * - ClassifyWordDifficultyOutput - The return type for the classifyWordDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyWordDifficultyInputSchema = z.object({
  nepaliWord: z.string().describe('The Nepali word to classify.'),
});
export type ClassifyWordDifficultyInput = z.infer<
  typeof ClassifyWordDifficultyInputSchema
>;

const ClassifyWordDifficultyOutputSchema = z.object({
  difficulty: z
    .enum(['easy', 'intermediate', 'difficult'])
    .describe('The difficulty level of the Nepali word.'),
});
export type ClassifyWordDifficultyOutput = z.infer<
  typeof ClassifyWordDifficultyOutputSchema
>;

export async function classifyWordDifficulty(
  input: ClassifyWordDifficultyInput
): Promise<ClassifyWordDifficultyOutput> {
  return classifyWordDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyWordDifficultyPrompt',
  input: {schema: ClassifyWordDifficultyInputSchema},
  output: {schema: ClassifyWordDifficultyOutputSchema},
  prompt: `You are an expert in Nepali language and vocabulary.

You will classify the difficulty of a given Nepali word as either "easy", "intermediate", or "difficult".

Word: {{{nepaliWord}}}
Difficulty:`,
});

const classifyWordDifficultyFlow = ai.defineFlow(
  {
    name: 'classifyWordDifficultyFlow',
    inputSchema: ClassifyWordDifficultyInputSchema,
    outputSchema: ClassifyWordDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
