export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  rating: number;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}
