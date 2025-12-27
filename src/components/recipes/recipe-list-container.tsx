import type { Recipe } from "@/lib/domain/recipe/recipe";
import { Section } from "../ui/section";
import { NoMoreRecipes } from "./fallbacks/empty";
import { RecipeCard } from "./recipe-card";

type RecipeListProps = {
  title: string;
  recipes: Recipe[];
};

const RecipeList = ({ recipes, title }: RecipeListProps) => {
  return (
    <Section title={title}>
      <Contents recipes={recipes} />
    </Section>
  );
};

const Contents = ({ recipes }: { recipes: Recipe[] }) => {
  if (recipes.length === 0) return <NoMoreRecipes />;

  return (
    <ul className="grid gap-4">
      {recipes.map((recipe) => (
        <li key={recipe.publicId}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
};

export { RecipeList };
