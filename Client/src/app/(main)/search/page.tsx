"use client";

import { useState } from "react";
import { fetchRecipes } from "../../../api/api";
import { motion } from "framer-motion";
import SearchBar from "../../../components/ui/SearchBar";
import RecipesCard from "../../../components/RecipesCard";
import { Recipe } from "../../../types/types";
import Navbar from "@/components/common/Navbar";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecipes(query);
      setRecipes(data);
    } catch (err) {
      setError("No Recipes searched");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-50 mt-10">
        <div
          className="w-full px-4 py-8 bg-opacity-70 bg-gray-800 h-[200px] flex flex-col justify-center items-center"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Recipe Search
          </h1>
          <SearchBar onSearch={handleSearch} />
          {loading && (
            <p className="text-center mt-4 text-3xl font-bold text-white">
              Loading
              <span className="animate-pulse">...</span>
            </p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full mt-8"
        >
          <RecipesCard recipes={recipes} />
        </motion.div>
      </div>
    </>
  );
}
