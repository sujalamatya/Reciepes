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
import { useState } from "react";
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
                  <p className="text-sm text-gray-500">⭐ {recipe.rating}/5</p>
                </CardDescription>
              </CardContent>

              <CardFooter className="p-4">
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

      {/* Drawer for Recipe Details */}
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
                    Rating: ⭐ {selectedRecipe.rating}/5
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
                  test
                  {/* {selectedRecipe.description} */}
                </p>
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
