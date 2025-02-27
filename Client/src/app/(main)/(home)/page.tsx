"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API_URL = "https://dummyjson.com/recipes";

const customImages = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
];

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % customImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        setError("Failed to load recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const filterByDifficulty = (difficulty: string) =>
    recipes.filter((recipe) => recipe.difficulty === difficulty);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto my-6 px-4 relative">
        <Carousel className="w-full">
          <CarouselContent
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            className="transition-transform duration-700 ease-in-out"
          >
            {customImages.map((src, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={src}
                    alt={`Custom Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg brightness-75"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow-sm">
          Discover Delicious Recipes
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {["Easy", "Medium"].map((difficulty) => (
          <section key={difficulty} className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-700">
              {difficulty} Recipes
            </h2>

            <Carousel className="w-full">
              <CarouselContent
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                className="transition-transform duration-300 ease-in-out"
              >
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <CarouselItem key={i} className="basis-1/3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                      </CarouselItem>
                    ))
                  : filterByDifficulty(difficulty).map((recipe) => (
                      <CarouselItem key={recipe.id} className="basis-1/3">
                        <RecipeCard recipe={recipe} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        ))}
      </div>
    </>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="overflow-hidden transform hover:scale-105 transition duration-300 shadow-lg">
      <div className="relative">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg brightness-90 hover:brightness-100"
        />
        <Badge className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-md shadow">
          {recipe.difficulty}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {recipe.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center px-4 pb-4">
        <p className="text-sm text-gray-600">⭐ {recipe.rating}/5</p>
      </CardContent>
    </Card>
  );
}
