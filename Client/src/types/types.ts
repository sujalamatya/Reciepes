export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  rating: number;
  ingredients: string[];
  instructions: string[];
}
