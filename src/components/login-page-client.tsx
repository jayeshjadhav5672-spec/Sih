'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LoginForm = dynamic(() => import('@/components/login-form').then(mod => mod.LoginForm), {
  ssr: false,
});

export function LoginPageClient() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
