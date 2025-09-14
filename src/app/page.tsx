import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';

function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <LoginForm />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
