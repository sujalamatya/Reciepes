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

export default function Favorite() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("access");

  // Log the token for debugging purposes
  console.log("Using token:", token);

  // Check if token exists before proceeding
  if (!token) {
    throw new Error("No access token found. Please log in.");
  }
  // Fetch favorite recipes from the API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/recipes/favorites/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
                    <p className="text-sm text-gray-500">
                      ⭐ {recipe.rating}/5
                    </p>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 transition-colors">
                    View Recipe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
