import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Recipe } from "../../types/types";

interface RecipesTableProps {
  recipes: Recipe[];
}

export default function RecipesTable({ recipes }: RecipesTableProps) {
  return (
    <Table>
      <TableCaption>List of Recipes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cuisine</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recipes.map((recipe) => (
          <TableRow key={recipe.id}>
            <TableCell>{recipe.name}</TableCell>
            <TableCell>{recipe.cuisine}</TableCell>
            <TableCell>{recipe.difficulty}</TableCell>
            <TableCell>{recipe.rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
