'use server';
/**
 * @fileOverview Generates a secure temporary password for password resets.
 *
 * - generateTemporaryPassword - A function that generates a temporary password.
 * - GenerateTemporaryPasswordOutput - The return type for the generateTemporaryPassword function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTemporaryPasswordOutputSchema = z.object({
  password: z.string().describe('A secure, randomly generated temporary password.'),
});
export type GenerateTemporaryPasswordOutput = z.infer<
  typeof GenerateTemporaryPasswordOutputSchema
>;

export async function generateTemporaryPassword(): Promise<GenerateTemporaryPasswordOutput> {
  return generateTemporaryPasswordFlow();
}

const passwordResetPrompt = ai.definePrompt({
  name: 'passwordResetPrompt',
  output: { schema: GenerateTemporaryPasswordOutputSchema },
  prompt: `You are a security expert. Generate a single, secure, and random temporary password. The password should be 8 characters long, containing a mix of uppercase letters, lowercase letters, numbers, and symbols.`,
});

const generateTemporaryPasswordFlow = ai.defineFlow(
  {
    name: 'generateTemporaryPasswordFlow',
    outputSchema: GenerateTemporaryPasswordOutputSchema,
  },
  async () => {
    const { output } = await passwordResetPrompt();
    return output!;
  }
);
