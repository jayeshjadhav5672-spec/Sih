
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<{ error?: string; success?: boolean; message?: string } | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setState(null);

    try {
      // Firebase will check if the user exists and send the email.
      // We no longer need to check localStorage here.
      await sendPasswordResetEmail(auth, email);
      setState({ success: true, message: "A password reset link has been sent to your email address. Please check your inbox and spam folder." });
    } catch (error: any) {
      console.error(error.code, error.message);
      if (error.code === 'auth/invalid-email') {
         setState({ error: 'Please enter a valid email address.' });
      } else if (error.code === 'auth/user-not-found') {
         // We show a generic message to prevent email enumeration attacks
         setState({ success: true, message: "If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder." });
      } else {
         setState({ error: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">Forgot Password</CardTitle>
        <CardDescription className="pt-2">
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {state?.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          {state?.error && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {!state?.success && (
            <div className="space-y-2">
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  required 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            </div>
          )}
          {!state?.success && (
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          )}
          <Button variant="link" className="w-full" asChild>
             <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Link>
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
