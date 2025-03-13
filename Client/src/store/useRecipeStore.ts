import { create } from "zustand";
import { Recipe } from "../types/types"; // Import the Recipe interface

interface RecipeStore {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  setRecipes: (recipes: Recipe[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  loading: false,
  error: null,
  setRecipes: (recipes) => set({ recipes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useRecipeStore;
