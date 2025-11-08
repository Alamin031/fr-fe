'use client'
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NextDashboardProviderProps {
  children: ReactNode;
}

const AdminManagementProvider: React.FC<NextDashboardProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // ✅ অনুমোদিত রোলগুলোর তালিকা
  const allowedRoles = ['admin', 'management'];

  // ✅ ইউজারের রোল চেক
  const hasAccess = allowedRoles.includes(session?.user?.role || '');

  // ❌ রোল মেলে না এমন ইউজারদের রিডাইরেক্ট করো
  if (!hasAccess) {
    router.push('/unauthorized');
    return null;
  }

  // ✅ রোল মিলে গেলে কনটেন্ট দেখাও
  return <>{children}</>;
};

export default AdminManagementProvider;
