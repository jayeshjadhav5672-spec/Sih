'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SignupForm = dynamic(() => import('@/components/signup-form').then(mod => mod.SignupForm), {
  ssr: false,
});

export function SignupPageClient() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
