// app/login/LoginForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Default callback URL
  const [callbackUrl] = useState<string>("/");

  useEffect(() => {
    // Handle authentication errors from URL parameters on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get("error");

      if (errorParam) {
        switch (errorParam) {
          case "CredentialsSignin":
            setError("Invalid email or password");
            break;
          case "Configuration":
            setError("There is a problem with the server configuration");
            break;
          case "AccessDenied":
            setError("Access denied");
            break;
          case "Verification":
            setError("The verification token has expired or has already been used");
            break;
          default:
            setError("An error occurred during authentication");
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("enterpassword")?.toString();

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error) {
      setError("Failed to sign in with Google");
      setLoading(false);
      console.error("Google sign-in error:", error);
    }
  };

  const handleTogglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (loading) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Login
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Join the future of digital experiences
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-gray-100 border border-gray-300 rounded-2xl text-gray-700 font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm sm:text-base">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs sm:text-sm bg-white">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black/50 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              name="enterpassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black/50 focus:outline-none"
              required
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-black rounded-2xl text-white font-semibold shadow-lg hover:bg-gray-900 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Login Account</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 pt-4 sm:pt-6 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <a 
            href="/signup" 
            className="text-black font-medium hover:underline"
            onClick={handleLinkClick}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;