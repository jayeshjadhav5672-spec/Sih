'use server';
/**
 * @fileOverview Generates a secure temporary password and a reset token.
 *
 * - generateTemporaryPassword - A function that generates a temporary password and token.
 * - GenerateTemporaryPasswordOutput - The return type for the generateTemporaryPassword function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';


const GenerateTemporaryPasswordOutputSchema = z.object({
  password: z.string().describe('A secure, randomly generated temporary password.'),
  token: z.string().describe('A unique, secure token for the password reset link.'),
});
export type GenerateTemporaryPasswordOutput = z.infer<
  typeof GenerateTemporaryPasswordOutputSchema
>;

export async function generateTemporaryPassword(): Promise<GenerateTemporaryPasswordOutput> {
  return generateTemporaryPasswordFlow();
}

const passwordResetPrompt = ai.definePrompt({
  name: 'passwordResetPrompt',
  output: { schema: GenerateTemporaryPasswordOutputSchema.pick({ password: true }) },
  prompt: `You are a security expert. Generate a single, secure, and random temporary password. The password should be 8 characters long, containing a mix of uppercase letters, lowercase letters, numbers, and symbols.`,
});

const generateTemporaryPasswordFlow = ai.defineFlow(
  {
    name: 'generateTemporaryPasswordFlow',
    outputSchema: GenerateTemporaryPasswordOutputSchema,
  },
  async () => {
    const { output } = await passwordResetPrompt();
    if (!output) {
      throw new Error('Could not generate a temporary password.');
    }
    const token = uuidv4();
    return { password: output.password, token };
  }
);
