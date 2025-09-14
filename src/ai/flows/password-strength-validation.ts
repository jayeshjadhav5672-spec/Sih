'use server';

/**
 * @fileOverview Checks the password strength against a dictionary of common passwords using an LLM.
 *
 * - validatePasswordStrength - A function that validates the password strength.
 * - ValidatePasswordStrengthInput - The input type for the validatePasswordStrength function.
 * - ValidatePasswordStrengthOutput - The return type for the validatePasswordStrength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidatePasswordStrengthInputSchema = z.object({
  password: z.string().describe('The password to validate.'),
});
export type ValidatePasswordStrengthInput = z.infer<
  typeof ValidatePasswordStrengthInputSchema
>;

const ValidatePasswordStrengthOutputSchema = z.object({
  isStrong: z.boolean().describe('Whether the password is strong or not.'),
  reason: z.string().optional().describe('The reason why the password is weak.'),
});
export type ValidatePasswordStrengthOutput = z.infer<
  typeof ValidatePasswordStrengthOutputSchema
>;

export async function validatePasswordStrength(
  input: ValidatePasswordStrengthInput
): Promise<ValidatePasswordStrengthOutput> {
  return validatePasswordStrengthFlow(input);
}

const passwordStrengthPrompt = ai.definePrompt({
  name: 'passwordStrengthPrompt',
  input: {schema: ValidatePasswordStrengthInputSchema},
  output: {schema: ValidatePasswordStrengthOutputSchema},
  prompt: `You are a security expert. Determine if the provided password is secure.  A password is not secure if it is a commonly used password.

Password: {{{password}}}

Respond in JSON.  Set isStrong to true if the password is not commonly used and therefore strong. Set isStrong to false if the password is a commonly used password. If isStrong is false, also set reason to the reason why it is not strong.`,
});

const validatePasswordStrengthFlow = ai.defineFlow(
  {
    name: 'validatePasswordStrengthFlow',
    inputSchema: ValidatePasswordStrengthInputSchema,
    outputSchema: ValidatePasswordStrengthOutputSchema,
  },
  async input => {
    const {output} = await passwordStrengthPrompt(input);
    return output!;
  }
);
