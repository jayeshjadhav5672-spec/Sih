'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { validatePasswordStrength } from '@/ai/flows/password-strength-validation';

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

  const passwordStrength = await validatePasswordStrength({ password });

  if (!passwordStrength.isStrong) {
    const reason = passwordStrength.reason || 'This password is too common. Please choose a stronger one.';
    return {
      error: reason,
      errors: { password: [reason] }
    };
  }

  // In a real app, you would create the user in the database here.
  // We will redirect to the login page with a success message.
  redirect('/?message=Signup successful! Please log in.');
}
