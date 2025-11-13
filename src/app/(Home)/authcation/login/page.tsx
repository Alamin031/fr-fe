// app/(Home)/authcation/login/page.tsx
import { unstable_noStore as noStore } from 'next/cache';
import LoginForm from '../../../../../authcation/LoginForm';

export default function LoginPage() {
  noStore(); // ✅ Add this line
  
  return <LoginForm />;
}

export const dynamic = 'force-dynamic'; // ✅ Add this too