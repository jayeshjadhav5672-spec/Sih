'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
import { resetPassword } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send Reset Link
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, null);

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">Forgot Password</CardTitle>
        <CardDescription className="pt-2">
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.success && state.message && (
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
                <Mail className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {!state?.success && (
            <div className="space-y-2">
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" name="email" placeholder="name@example.com" type="email" required className="pl-10" />
                </div>
            </div>
          )}
          {!state?.success && <SubmitButton />}
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
