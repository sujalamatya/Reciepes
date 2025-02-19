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

interface RecipesCardProps {
  recipes: Recipe[];
}

export default function RecipesCard({ recipes }: RecipesCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
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
                src={recipe.image} // Use the image URL from the API
                alt={recipe.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>

            <CardContent className="p-4">
              <CardTitle className="text-xl font-bold">{recipe.name}</CardTitle>

              <CardDescription className="mt-2">
                <p className="text-sm text-gray-600">{recipe.cuisine}</p>
                <p className="text-sm text-gray-600">
                  Difficulty: {recipe.difficulty}
                </p>
                <p className="text-sm text-gray-500">⭐ {recipe.rating}/5</p>
                {/* <p className="text-sm text-gray-600">Rating: {recipe.rating}</p> */}
              </CardDescription>
            </CardContent>

            <CardFooter className="p-4">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                View Recipe
              </button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
