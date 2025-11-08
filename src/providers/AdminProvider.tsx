 "use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AdminProviderProps {
  children: ReactNode;
}

const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // When loading finishes and user is not admin, redirect
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.push("/"); // or another page, e.g. "/unauthorized"
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user.role === "admin") {
    return <>{children}</>;
  }

  return null;
};

export default AdminProvider;
