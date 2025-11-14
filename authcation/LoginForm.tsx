"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

// Prevent Next.js from prerendering this page
export const dynamic = "force-dynamic";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("enterpassword")?.toString();

    if (!email || !password) return;

    if (password.length < 6) {
      console.error("Password is too short");
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-gray-100 border border-gray-300 rounded-2xl text-gray-700 font-medium hover:bg-gray-200 transition"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black/50"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              name="enterpassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black/50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-black rounded-2xl text-white font-semibold shadow-lg hover:bg-gray-900 transition transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Login Account</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 pt-4 sm:pt-6 text-sm sm:text-base">
          Don’t have an account?{" "}
          <a href="/signup" className="text-black font-medium hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;