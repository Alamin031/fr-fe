// app/authcation/signup/SignupForm.tsx
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

  // Validation functions
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

  const handleInputChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));

    let error = "";
    switch (field) {
      case "username": error = validateUsername(value); break;
      case "email": error = validateEmail(value); break;
      case "password": error = validatePassword(value); break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || googleLoading) return;
    setLoading(true);

    // Validate all fields
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (usernameError || emailError || passwordError) {
      setErrors({ username: usernameError, email: emailError, password: passwordError });
      if (usernameError) document.getElementById("username")?.focus();
      else if (emailError) document.getElementById("email")?.focus();
      else if (passwordError) document.getElementById("password")?.focus();
      setLoading(false);
      return;
    }

    try {
      // Use NEXT_PUBLIC_BASE_URL with fallback to relative URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("An account with this email already exists");
          setErrors(prev => ({ ...prev, email: "Email already registered" }));
        } else if (res.status === 400 || res.status === 422) {
          toast.error(data.error || "Validation failed");
        } else {
          toast.error(data.error || "Signup failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Logging you in...");

      // Reset form
      setForm({ username: "", email: "", password: "" });
      setErrors({ username: "", email: "", password: "" });

      // Auto-login after signup
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
      toast.error(error instanceof Error ? error.message : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (googleLoading || loading) return;
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: "/", redirect: false });
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to sign up with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const isFormValid = form.username && form.email && form.password &&
    !errors.username && !errors.email && !errors.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-border/40">
        <CardHeader className="space-y-3 text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">Join the future of digital experiences</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-11 text-sm border-border/60 hover:bg-accent/50 transition-colors"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue with Google"}
          </Button>

          <Separator className="my-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
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
              {errors.username && <p className="text-xs text-destructive font-medium">{errors.username}</p>}
              <p className="text-xs text-muted-foreground">2-30 characters, letters, numbers, and underscores only</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
              {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </Button>
              </div>
              {errors.password && <p className="text-xs text-destructive font-medium">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 text-sm font-medium hover:bg-primary/90 bg-black text-white" disabled={loading || googleLoading || !isFormValid}>
              {loading ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </> : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-primary hover:underline transition-colors">
              Login here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
