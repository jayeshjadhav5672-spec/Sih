import { Suspense } from 'react';
import { ForgotPasswordClient } from '@/components/forgot-password-client';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Suspense>
        <ForgotPasswordClient />
      </Suspense>
    </main>
  );
}
