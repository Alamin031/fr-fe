"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  const [form, setForm] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  // Enhanced validation functions
  const validateUsername = (username: string): string => {
    if (!username) return "Username is required";
    if (username.length < 2) return "Username must be at least 2 characters long";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (password.length > 50) return "Password must be less than 50 characters";
    return "";
  };

  // Real-time validation on input change
  const handleInputChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));

    // Validate in real-time
    let error = "";
    switch (field) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading || googleLoading) {
      return;
    }

    setLoading(true);

    // Validate all fields
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
      });
      
      // Focus on first error field
      if (usernameError) {
        document.getElementById("username")?.focus();
      } else if (emailError) {
        document.getElementById("email")?.focus();
      } else if (passwordError) {
        document.getElementById("password")?.focus();
      }
      
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // More specific error handling based on status code
        if (res.status === 409) {
          toast.error("An account with this email already exists");
          setErrors(prev => ({ ...prev, email: "Email already registered" }));
        } else if (res.status === 400) {
          toast.error(data.error || "Invalid input data");
        } else if (res.status === 422) {
          toast.error(data.error || "Validation failed");
        } else {
          toast.error(data.error || "Signup failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Logging you in...");

      // Reset form
      setForm({
        username: "",
        email: "",
        password: "",
      });

      setErrors({
        username: "",
        email: "",
        password: "",
      });

      // Auto-login after successful signup
      const signInResult = await signIn("credentials", {
        email: form.email,
        username: form.username,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Login failed. Please try logging in manually.");
        router.push("/login");
      } else {
        toast.success("Welcome! You've been logged in successfully.");
        router.push("/");
        router.refresh();
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle Google signup
  async function handleGoogleSignup() {
    if (googleLoading || loading) {
      return;
    }

    setGoogleLoading(true);
    try {
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true,
      });
      // The redirect will be handled by NextAuth
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to sign up with Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Check if form is valid for submit button
  const isFormValid = form.username && form.email && form.password && 
    !errors.username && !errors.email && !errors.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-border/40">
        <CardHeader className="space-y-3 text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text ">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join the future of digital experiences
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Google Signup Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-11 text-sm border-border/60 hover:bg-accent/50 transition-colors"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </>
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <Separator className="my-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleInputChange("username")}
                  className={`pl-9 h-11 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={loading || googleLoading}
                  minLength={2}
                  maxLength={30}
                  required
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive font-medium">{errors.username}</p>
              )}
              <p className="text-xs text-muted-foreground">
                2-30 characters, letters, numbers, and underscores only
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleInputChange("email")}
                  className={`pl-9 h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={loading || googleLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleInputChange("password")}
                  className={`pl-9 pr-10 h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={loading || googleLoading}
                  minLength={6}
                  maxLength={50}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={loading || googleLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-medium  hover:bg-primary/90   bg-black text-white" 
              disabled={loading || googleLoading }
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-semibold text-primary hover:underline transition-colors"
            >
              Login here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}