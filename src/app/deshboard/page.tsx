"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, User, LogOut,  } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  console.log(session);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      toast.loading("Logging out...");

      await signOut({ callbackUrl: "/" });

      toast.dismiss();
      toast.success("You've been logged out.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.dismiss();
      toast.error("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Not Logged In
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your profile.
            </p>
            <Button
              onClick={() => (window.location.href = "/api/auth/signin")}
              className="w-full bg-black hover:bg-gray-800"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 w-full">
      <div className="max-w-2xl mx-auto">
        <Card className="border-gray-200 shadow-lg">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-gray-900 to-black" />

          <CardContent className="relative px-6 pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={session.user.image ?? "/default-avatar.png"}
                    alt={session.user.name ?? "User"}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-900 text-2xl font-semibold">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {session.user.name ?? "Anonymous User"}
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                {session.user.email ?? "No email provided"}
              </p>
            </div>

            {/* Profile Details Card */}
            <div className="space-y-4">
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Account Details
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium text-gray-900">
                      {session.user.name}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-gray-900">
                      {session.user.email ?? "N/A"}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Role</span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-900 text-white hover:bg-gray-800 capitalize"
                    >
                      {session.user.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
               
                <Button
                  onClick={handleLogout}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-100"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {loading ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;