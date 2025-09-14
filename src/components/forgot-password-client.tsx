'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ForgotPasswordForm = dynamic(() => import('@/components/forgot-password-form').then(mod => mod.ForgotPasswordForm), {
  ssr: false,
});

export function ForgotPasswordClient() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
