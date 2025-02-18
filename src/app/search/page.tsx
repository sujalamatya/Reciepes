"use client";

import { useState } from "react";

import { fetchRecipes } from "../../api/api";

import { motion } from "framer-motion";

import SearchBar from "../../components/ui/SearchBar";

import RecipesCard from "../../components/RecipesCard";

import { Recipe } from "../../types/types";

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
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipe Search</h1>

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <p className="text-center mt-4 text-3xl font-bold">Loading...</p>
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
  );
}
