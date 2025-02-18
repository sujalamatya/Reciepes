import { Recipe } from "../types/types";

export async function fetchRecipes(query: string = ""): Promise<Recipe[]> {
  const url = query
    ? `https://dummyjson.com/recipes/search?q=${query}`
    : "https://dummyjson.com/recipes";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();

  return data.recipes;
}
