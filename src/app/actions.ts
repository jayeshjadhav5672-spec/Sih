'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { validatePasswordStrength } from '@/ai/flows/password-strength-validation';
import { generateTemporaryPassword } from '@/ai/flows/password-reset';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

type LoginState = {
  error?: string;
} | null;

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }

  redirect('/dashboard');
}

export async function logoutUser() {
  redirect('/');
}

const signupSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    role: z.enum(['student', 'teacher', 'admin']),
});

type SignupState = {
  error?: string;
  errors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  success?: boolean;
} | null;

export async function signupUser(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
      return {
          error: 'Invalid fields provided.',
          errors: validatedFields.error.flatten().fieldErrors,
      };
  }

  const { password } = validatedFields.data;

  try {
    const passwordStrength = await validatePasswordStrength({ password });

    if (!passwordStrength.isStrong) {
      const reason = passwordStrength.reason || 'This password is too common. Please choose a stronger one.';
      return {
        error: reason,
        errors: { password: [reason] }
      };
    }
  } catch (e) {
    console.error("Could not validate password strength, allowing signup anyway.", e);
    // In case of an error with the AI service, we can choose to
    // either block the signup or allow it. For better user experience,
    // we will allow it here.
    return { success: true };
  }

  return { success: true };
}


const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

type ResetPasswordState = {
  error?: string;
  success?: boolean;
  newPassword?: string;
} | null;


export async function resetPassword(prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
    const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Please enter a valid email address.' };
    }

    const { email } = validatedFields.data;

    try {
        const { password: newPassword } = await generateTemporaryPassword();
        
        // This is a placeholder. In a real app, you would:
        // 1. Find the user by email in your database.
        // 2. If the user exists, hash the newPassword.
        // 3. Save the hashed password to the user's record.
        // 4. Send an email to the user with the new password or a reset link.
        console.log(`Password for ${email} reset to: ${newPassword}. In a real app, this would be emailed and the original would be updated in the database.`);


        return { success: true, newPassword };

    } catch (e) {
        console.error("Could not generate temporary password.", e);
        return { error: 'There was a problem resetting your password. Please try again later.' };
    }
}
