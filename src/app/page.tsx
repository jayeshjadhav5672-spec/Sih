import { Suspense } from 'react';
import { LoginPageClient } from '@/components/login-page-client';

function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <LoginPageClient />
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
