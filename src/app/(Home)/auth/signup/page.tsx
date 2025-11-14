// app/authcation/signup/page.tsx
import { Suspense } from 'react';
import SignupForm from '../../../../../authcation/Signup';

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';