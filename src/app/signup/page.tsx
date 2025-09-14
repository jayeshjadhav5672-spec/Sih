import { Suspense } from 'react';
import { SignupPageClient } from '@/components/signup-page-client';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Suspense>
        <SignupPageClient />
      </Suspense>
    </main>
  );
}
