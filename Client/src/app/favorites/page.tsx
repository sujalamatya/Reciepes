"use client"; // Ensure this is a client component
import Navbar from "@/components/common/Navbar";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "@/types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

export default function Favorite() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const token = localStorage.getItem("access");

    // Check if token exists before proceeding
    if (!token) {
      setError("No access token found. Please log in.");
      setLoading(false);
      return;
    }

    // Fetch favorite recipes from the API
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/recipes/favorites/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data.recipes);

        // Initialize favorite status for each recipe
        const status: { [key: string]: boolean } = {};
        data.recipes.forEach((recipe: Recipe) => {
          status[recipe.id] = true; // All recipes here are favorites
        });
        setFavoriteStatus(status);
      } catch (error) {
        setError("You don't have any favorite recipes!");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecipe(null);
  };

  const toggleFavorite = async (recipeId: number | string) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/recipes/favorite/${recipeId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      // Update the favorite status locally
      setFavoriteStatus((prev) => {
        const updatedStatus = { ...prev, [recipeId]: !prev[recipeId] };
        return updatedStatus;
      });

      // Remove the recipe from the favorites list if unfavorited
      if (favoriteStatus[recipeId]) {
        setFavorites((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Favorite Recipes</h1>
        {favorites.length === 0 ? (
          <p className="text-gray-600">You have no favorite recipes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <Card
                key={recipe.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <Image
                    src={`http://localhost:8000${recipe.image}`}
                    alt={recipe.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold">
                    {recipe.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <p className="text-sm text-gray-600">{recipe.cuisine}</p>
                    <p className="text-sm text-gray-600">
                      Difficulty: {recipe.difficulty}
                    </p>
                    <div className="grid grid-flow-col grid-cols-2">
                      <p className="text-sm text-gray-500">
                        ⭐ {recipe.rating}/5
                      </p>
                      <div className="flex justify-end">
                        <button onClick={() => toggleFavorite(recipe.id)}>
                          {favoriteStatus[recipe.id] ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6 text-red-500"
                            >
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleViewRecipe(recipe)}
                    className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    View Recipe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="flex overflow-y-auto max-h-[90vh] justify-center align-middle">
          {selectedRecipe && (
            <>
              <DrawerHeader className="border-b">
                <DrawerTitle className="text-2xl font-bold text-gray-900">
                  {selectedRecipe.name}
                </DrawerTitle>
                <DrawerDescription className="mt-2 space-y-1">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Cuisine:</span>{" "}
                    {selectedRecipe.cuisine}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Difficulty:</span>{" "}
                    {selectedRecipe.difficulty}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">Rating:</span> ⭐{" "}
                    {selectedRecipe.rating}/5
                  </div>
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-6">
                <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                  <Image
                    src={`http://localhost:8000${selectedRecipe.image}`}
                    alt={selectedRecipe.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="mt-6 text-gray-700 leading-relaxed">
                  {selectedRecipe.description}
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h3>
                  {selectedRecipe.ingredients &&
                  selectedRecipe.ingredients.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">
                          <span className="text-gray-500 mr-2">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No ingredients available.
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Instructions
                  </h3>
                  {selectedRecipe.instructions &&
                  selectedRecipe.instructions.length > 0 ? (
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((step, index) => (
                        <li key={index} className="text-gray-700">
                          <span className="font-semibold text-gray-900 mr-2">
                            {index + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No instructions available.
                    </p>
                  )}
                </div>
              </div>

              <DrawerFooter className="border-t">
                <Button
                  onClick={handleCloseDrawer}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer> */}
    </div>
  );
}
