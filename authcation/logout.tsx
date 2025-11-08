"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      toast.loading("Logging out...");

      // Sign out the user and redirect to login
      await signOut({ callbackUrl: "/login" });

      toast.dismiss();
      toast.success("You’ve been logged out.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.dismiss();
      toast.error("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="destructive"
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" /> Logout
        </>
      )}
    </Button>
  );
}
