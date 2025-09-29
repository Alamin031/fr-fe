"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NextDashboardProviderProps {
  children: ReactNode;
}

const NextDashboardProvider: React.FC<NextDashboardProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authcation/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // Avoid rendering dashboard until redirect happens
  }

  return <div>{children}</div>;
};

export default NextDashboardProvider;
