"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const API_URL = "https://dummyjson.com/recipes";

interface Recipe {
  id: number;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  image: string;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await res.json();
        console.log("API Data:", data); // Log the response to check the structure
        // Assuming the API returns an array under "recipes" (adjust as needed)
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const filterByDifficulty = (difficulty: string) =>
    recipes.filter((recipe) => recipe.difficulty === difficulty);

  const topRatedRecipes = recipes
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5); // Get top 5 rated recipes

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Delicious Recipes</h1>

      {/* Display error if any */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Recipe Categories by Difficulty */}
      {["Easy", "Medium", "Hard"].map((difficulty) => (
        <section key={difficulty} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{difficulty} Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))
            ) : (
              filterByDifficulty(difficulty).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            )}
          </div>
        </section>
      ))}

      {/* Top Rated Recipes Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Rated Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))
          ) : (
            topRatedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          )}
        </div>
      </section>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Image
        src={recipe.image}
        alt={recipe.name}
        width={400}
        height={160}
        className="w-full h-40 object-cover"
      />
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <Badge variant="outline">{recipe.difficulty}</Badge>
        <p className="text-sm text-gray-500">⭐ {recipe.rating}/5</p>
      </CardContent>
    </Card>
  );
}
