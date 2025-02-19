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
} from "./ui/dialog"; // Adjust imports based on your UI library
import Link from "next/link";

const API_URL = "http://localhost:8000/api/signup/";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    // Get form data
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Send data to backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const result = await response.json();
      console.log("Signup successful:", result);

      // Show success dialog
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);

    router.push("/auth/login");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <p className="font-bold text-xl">Create a new account</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder=" "
                  required
                />
              </div>
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
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              {error && (
                <div className="text-center text-sm text-red-500">{error}</div>
              )}

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  or sign up with
                </span>
              </div>
              <div className="flex flex-col gap-4 ">
                <Button variant="outline" className="w-full relative ">
                  <div className="relative w-5 h-5">
                    <Image
                      src="apple.svg"
                      alt="apple Logo"
                      fill
                      className="dark:brightness-[0.2] dark:grayscale object-contain"
                    />
                  </div>
                  Sign Up With Apple ID
                  <span className="sr-only">Sign Up with apple</span>
                </Button>
                <Button variant="outline" className="w-full relative">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/google.svg"
                      alt="Google Logo"
                      fill
                      className="dark:brightness-[0.2] dark:grayscale object-contain"
                    />
                  </div>
                  Sign Up With Google
                  <span className="sr-only">Sign Up with google</span>
                </Button>
                <Button variant="outline" className="w-full relative">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/facebook.svg"
                      alt="facebook Logo"
                      fill
                      className="dark:brightness-[0.2] dark:grayscale object-contain"
                    />
                  </div>
                  Sign Up With Facebook
                  <span className="sr-only">Sign Up with facebook</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 text-blue-600 hover:text-blue-400"
                >
                  Already Have an account?
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block h-full w-full">
            <Image
              src="/signup.png"
              alt="Image"
              fill
              sizes="full"
              priority
              className="dark:brightness-[0.2] dark:grayscale object-cover"
            ></Image>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Created</DialogTitle>
            <DialogDescription>
              Your account has been successfully created. You will now be
              redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
