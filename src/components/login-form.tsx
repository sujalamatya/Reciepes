"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const API_URL = "http://192.168.1.47:8000/api/login/";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log("Sending request to:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response: ", response.json());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      return contentType?.includes("application/json")
        ? response.json()
        : { message: "Login successful" };
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      console.log("Attempting login with:", data.email);
      const result = await login(data.email, data.password);
      console.log("Login successful:", result);
      // Handle successful login (e.g., save token, redirect user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} method="POST">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="font-bold text-xl">LOG IN</p>
              </div>

              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}

              <Link href="/">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging In..." : "Login"}
                </Button>
              </Link>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}

              <a
                href="#"
                className="text-center text-sm text-muted-foreground underline-offset-2 hover:underline text-blue-500 hover:text-blue-300"
              >
                Forgot your password?
              </a>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full relative">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/apple.svg"
                      alt="Apple Logo"
                      fill
                      className="object-fit"
                    />
                  </div>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" className="w-full relative">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/google.svg"
                      alt="Google Logo"
                      fill
                      className="object-fit"
                    />
                  </div>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" className="w-full relative">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/facebook.svg"
                      alt="Facebook Logo"
                      fill
                      className="object-fit"
                    />
                  </div>
                  <span className="sr-only">Login with Facebook</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="underline underline-offset-4 text-green-600"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>

          {/* Side Image */}
          <div className="relative hidden bg-muted md:block w-full h-full">
            <Image
              src="/login.png"
              alt="Login Image"
              priority
              fill
              sizes="full"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
