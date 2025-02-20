"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/signup/";

export function SignUpForm(props: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = { username, email, password };

    try {
      console.log("Sending signup request to:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        mode: "cors",
      });

      let result;
      try {
        const responseText = await response.text();
        result = JSON.parse(responseText);
        console.log("API Response:", result);
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        const errorMessage =
          result.detail || result.message || result.error || "Signup failed";
        throw new Error(errorMessage);
      }

      // Extract token from response
      const token = extractToken(result);

      if (!token) {
        // Generate a token if the API doesn't provide one
        console.log("Generating token locally since API didn't provide one");
        const generatedToken = generateToken(email);
        localStorage.setItem("username", username || email.split("@")[0]);
        localStorage.setItem("access", generatedToken);
      } else {
        // Store the token from API
        localStorage.setItem("username", username || email.split("@")[0]);
        localStorage.setItem("access", token);
      }

      // Redirect to home or login confirmation
      router.push("/auth/login");
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract token from various response formats
  interface ApiResponse {
    access?: string;
    token?: string;
    accessToken?: string;
    access_token?: string;
    jwt?: string;
    id_token?: string;
    auth_token?: string;
    data?: {
      token?: string;
      access?: string;
    };
    user?: {
      token?: string;
    };
  }

  const extractToken = (result: ApiResponse | string): string | null => {
    if (typeof result === "string") return result;

    return (
      result.access ||
      result.token ||
      result.accessToken ||
      result.access_token ||
      result.jwt ||
      result.id_token ||
      result.auth_token ||
      result.data?.token ||
      result.data?.access ||
      result.user?.token ||
      null
    );
  };

  // Generate a simple token for development purposes
  const generateToken = (email: string): string => {
    // This is just for development - in production, tokens should come from your backend
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    return btoa(`${email}:${timestamp}:${randomPart}`);
  };

  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="text-center font-bold text-xl">SIGN UP</div>

              {/* Username Input */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                />
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
                <Label htmlFor="password">Password</Label>
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
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              {error && (
                <div className="text-center text-sm text-red-500">{error}</div>
              )}

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="text-blue-600 underline">
                  Log in
                </a>
              </div>
            </div>
          </form>

          {/* Side Image */}
          <div className="relative hidden bg-muted md:block w-full h-full">
            <Image
              src="/signup.png"
              alt="Signup Image"
              priority
              fill
              sizes="full"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signup Failed</DialogTitle>
            <DialogDescription>
              {error ||
                "There was a problem creating your account. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
