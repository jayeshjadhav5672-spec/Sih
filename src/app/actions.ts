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
  message?: string;
} | null;


export async function resetPassword(prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
    const validatedFields = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Please enter a valid email address.' };
    }

    const { email } = validatedFields.data;

    try {
        const { password: newPassword, token } = await generateTemporaryPassword();
        
        // This is a placeholder. In a real app, you would:
        // 1. Find the user by email in your database.
        // 2. If the user exists, save the hashed reset `token` and its expiry.
        // 3. Email a link like `https://yourapp.com/reset-password?token=${token}`
        // 4. On the reset page, verify the token, and then allow the user to set a new password.
        // 5. For this demo, we'll just log it. The `newPassword` would be sent in a separate email or after link click.
        console.log(`Password reset link for ${email}: /reset-password?token=${token}`);
        console.log(`User's temporary password would be: ${newPassword}`);


        return { success: true, message: "If an account with that email exists, we've sent a password reset link." };

    } catch (e) {
        console.error("Could not generate password reset token.", e);
        return { error: 'There was a problem resetting your password. Please try again later.' };
    }
}
