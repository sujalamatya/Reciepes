"use client"; // Ensure this is a client component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "../types/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface RecipesCardProps {
  recipes: Recipe[];
}

export default function RecipesCard({ recipes }: RecipesCardProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecipe(null);
  };

  const toggleFavorite = (recipeId: number | string) => {
    setFavorites((prev) => {
      const updatedFavorites = {
        ...prev,
        [recipeId]: !prev[recipeId],
      };
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const parseArray = (value: string | string[]): string[] => {
    if (typeof value === "string") {
      try {
        const correctedValue = value.replace(/'/g, '"').trim();
        return JSON.parse(correctedValue);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return [];
      }
    }
    return value;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
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
                        {favorites[recipe.id] ? (
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
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                  onClick={() => handleViewRecipe(recipe)}
                >
                  View Recipe
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          {selectedRecipe && (
            <>
              <DrawerHeader>
                <DrawerTitle>{selectedRecipe.name}</DrawerTitle>
                <DrawerDescription>
                  <p className="text-sm text-gray-600">
                    Cuisine: {selectedRecipe.cuisine}
                  </p>
                  <p className="text-sm text-gray-600">
                    Difficulty: {selectedRecipe.difficulty}
                  </p>
                  <p className="text-sm text-gray-500">
                    ⭐ {selectedRecipe.rating}/5
                  </p>
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4">
                <Image
                  src={`http://localhost:8000${selectedRecipe.image}`}
                  alt={selectedRecipe.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-4 text-gray-700">
                  {selectedRecipe.description}
                </p>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ingredients
                  </h3>
                  {selectedRecipe.ingredients &&
                  selectedRecipe.ingredients.length > 0 ? (
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      {parseArray(selectedRecipe.ingredients).map(
                        (ingredient, index) => (
                          <li key={index} className="text-sm">
                            {ingredient}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No ingredients available.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Instructions
                  </h3>
                  {selectedRecipe.instructions &&
                  selectedRecipe.instructions.length > 0 ? (
                    <ol className="mt-2 list-decimal list-inside text-gray-700">
                      {parseArray(selectedRecipe.instructions).map(
                        (step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        )
                      )}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No instructions available.
                    </p>
                  )}
                </div>
              </div>

              <DrawerFooter>
                <Button onClick={handleCloseDrawer}>Close</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
