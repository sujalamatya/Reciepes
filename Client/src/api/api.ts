import { Recipe } from "../types/types";

export async function fetchRecipes(query: string = ""): Promise<Recipe[]> {
  const token = localStorage.getItem("access");

  //Log the token for debugging purposes
  console.log("Using token:", token);

  //Check if token exists before proceeding
  if (!token) {
    throw new Error("No access token found. Please log in.");
  }

  const url = query
    ? `http://localhost:8000/api/recipes/search?q=${query}`
    : "http://localhost:8000/api/recipes";
  // ? `https://dummyjson.com/recipes/search?q=${query}`
  // : "https://dummyjson.com/recipes";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    });

    // Check for failed responses
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if recipes are found
    if (!data.recipes || data.recipes.length === 0) {
      throw new Error("No recipes found matching your search.");
    }

    return data.recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
}
