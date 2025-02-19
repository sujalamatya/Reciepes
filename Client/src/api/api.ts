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

// export async function fetchRecipes1(query: string = ""): Promise<Recipe[]> {
//   const url = query
//     ? `http://192.168.1.47:8000/api/recipes/search?q=${query}`
//     : "http://192.168.1.47:8000/api/recipes";

//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch recipes");
//   }

//   const data = await response.json();

//   return data.recipes;
// }
