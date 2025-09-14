'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Login
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginUser, null);
  const searchParams = useSearchParams();
  const signupMessage = searchParams.get('message');

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">TimeWise</CardTitle>
        <CardDescription className="pt-2">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {signupMessage && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{signupMessage}</AlertDescription>
            </Alert>
          )}
          {state?.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="name@example.com" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <LoginButton />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline font-semibold text-primary/90 hover:text-primary">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
