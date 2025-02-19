"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://dummyjson.com/recipes/search?q=${searchQuery}`
        );
        const data = await res.json();
        if (data && data.recipes) {
          setRecipes(data.recipes);
        } else {
          setError("No recipes found");
        }
      } catch (error) {
        setError("Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo on the Left */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold text-blue-600"
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={270}
                height={200}
                className="content-start-left"
              />
            </Link>
          </motion.div>

          {/* Navigation Links in the Middle */}
          <div className="flex space-x-8 items-center mx-auto">
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
                  className="text-gray-700 hover:text-blue-600 transition-colors relative group"
                >
                  {link}
                  <motion.span
                    className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search Bar & Login on the Right */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search for recipes..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              >
                Search
              </Button>
            </form>

            {/* Login Link */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 transition-colors relative group flex items-center"
              >
                <Avatar>
                  <AvatarImage src="/login-avatar.png" />
                  <AvatarFallback>👤</AvatarFallback>
                </Avatar>
                <span className="ml-2">Login</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {/* <div className="max-w-6xl mx-auto px-4 py-6"> */}
      {loading && <p>Loading recipes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white border rounded-lg p-4 shadow-md"
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700">
                {recipe.title}
              </h3>
              <p className="text-gray-500">{recipe.description}</p>
              <Link
                href={`/recipe/${recipe.id}`}
                className="text-blue-600 hover:underline mt-2 block"
              >
                View Recipe
              </Link>
            </div>
          ))}
        </div>
      )}
      {/* </div>   */}
    </nav>
  );
}
