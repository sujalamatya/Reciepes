import { Recipe } from "../types/types";

// export async function fetchRecipes(query: string = ""): Promise<Recipe[]> {
//   const url = query
//     ? `https://dummyjson.com/recipes/search?q=${query}`
//     : "https://dummyjson.com/recipes";

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error("Failed to fetch recipes");
//   }

//   const data = await response.json();

//   return data.recipes;
// }
export async function fetchRecipes(query: string = ""): Promise<Recipe[]> {
  const url = query
    ? `http://localhost:8000/api/recipes/search?q=${query}`
    : "http://localhost:8000/api/recipes";

  const response = await fetch(url, {
    headers: {
      // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5ODY1MjI4LCJpYXQiOjE3Mzk4NjQ5MjgsImp0aSI6ImEzYWIyNWYyOGQzNDQ3MWViN2NkYmQyYzk0NmM0ZWQ3IiwidXNlcl9pZCI6M30.BgLBJS0aJ2LVWaUlKtNkGbmFVlZUKI0s0nJrXn8ZwFE`,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await response.json();

  return data.recipes;
}
