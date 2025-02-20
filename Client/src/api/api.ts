import { Recipe } from "../types/types";

export async function fetchRecipes(query: string = ""): Promise<Recipe[]> {
  const url = query
    ? `http://localhost:8000/api/recipes/search?q=${query}`
    : "http://localhost:8000/api/recipes";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();

  // Check if recipes are found, if not, display a "recipe not found" message
  if (data.recipes.length === 0) {
    throw new Error("Recipe not found");
  }

  return data.recipes;
}
