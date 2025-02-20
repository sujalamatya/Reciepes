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

// Get API URL from environment variable with fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/login/";

export function LoginForm(props: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = { email, password };

    try {
      console.log("Attempting to login at:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        mode: "cors",
      });

      console.log("Server responded with status:", response.status);

      const responseText = await response.text();
      setDebugInfo(`Raw API Response:\n${responseText}`);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Full API Response:", result);
        setDebugInfo(
          `Server Status: ${response.status}\n\nFull Response Object:\n${JSON.stringify(result, null, 2)}`
        );
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", parseError);
        throw new Error(
          `Server returned non-JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        const errorMessage =
          result.detail || result.message || result.error || "Invalid credentials";
        throw new Error(errorMessage);
      }

      const token = extractToken(result);
      const userName = extractUsername(result, email);

      if (token) {
        console.log("Authentication successful, token found");
        localStorage.setItem("username", userName);
        localStorage.setItem("access", token);

        router.push("/");
        window.dispatchEvent(new Event("storage"));
      } else {
        console.error("Authentication token missing in response", result);
        throw new Error("Authentication token missing in response.");
      }
    } catch (err) {
      console.error("Login process failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong during login";
      setError(errorMessage);
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Update token extraction logic to work with the response structure
  const extractToken = (result: any): string | null => {
    if (typeof result === "string") return result;
    const tokenField = result.tokens?.access || result.access || result.token || result.accessToken || result.access_token;

    if (tokenField) return tokenField;
    return null;
  };

  const extractUsername = (result: any, fallbackEmail: string): string => {
    if (result.username) return result.username;
    return fallbackEmail.split("@")[0] || "user";
  };

  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="text-center font-bold text-xl">LOG IN</div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>

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

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Login"}
              </Button>

              <a href="#" className="text-center text-sm text-blue-500 hover:underline">
                Forgot your password?
              </a>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/signup" className="text-green-600 underline">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block w-full h-full">
            <Image src="/login.png" alt="Login Image" priority fill sizes="full" className="object-cover" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Login Failed</DialogTitle>
            <DialogDescription className="max-h-96 overflow-y-auto">
              <div className="mb-4">{error || "Incorrect email or password. Please try again."}</div>

              {debugInfo && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="mb-2 font-medium text-sm text-gray-700">
                    API Response Details:
                  </div>
                  <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {debugInfo}
                  </pre>
                </div>
              )}

              <div className="mt-4 text-sm">
                <p className="font-medium">Potential Solutions:</p>
                <ul className="list-disc pl-5">
                  <li>Check if your credentials are correct.</li>
                  <li>Ensure your network connection is stable.</li>
                  <li>Contact support if the issue persists.</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-full md:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
