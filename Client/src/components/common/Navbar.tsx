"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);

  // Load username from storage on mountz
  useEffect(() => {
    const getUsername = () => {
      const storedUsername =
        localStorage.getItem("username") || sessionStorage.getItem("username");
      setUsername(storedUsername);
    };

    getUsername(); // Initial load

    // Listen for changes in localStorage and sessionStorage
    const handleStorageChange = () => getUsername();

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleStorageChange);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("access"); // Remove access token
    sessionStorage.removeItem("username"); // Remove from sessionStorage
    setUsername(null);
    window.dispatchEvent(new Event("storage")); // Force UI update
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={150} height={100} />
            </Link>
          </motion.div>

          {/* Navigation Links & Login */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-8 items-center">
              {["Home", "Search", "About Us"].map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={
                      link === "Home"
                        ? "/"
                        : `/${link.toLowerCase().replace(" ", "")}`
                    }
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Login / User Section */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {username ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    
                    <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 font-medium">{username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                >
                  <Avatar className="w-6 h-6">
                    
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">Login</span>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
