import type { Recipe } from "@/lib/domain/recipe/recipe";
import { Section } from "../ui/section";
import { NoMoreRecipes } from "./fallbacks/empty";
import { RecipeCard } from "./recipe-card";

type RecipeListProps = {
  title: string;
  recipes: Recipe[];
  empty?: React.ReactNode;
};

const RecipeList = ({ recipes, title, empty }: RecipeListProps) => {
  return (
    <Section title={title}>
      <Contents recipes={recipes} empty={empty} />
    </Section>
  );
};

const Contents = ({
  recipes,
  empty,
}: { recipes: Recipe[]; empty?: React.ReactNode }) => {
  if (recipes.length === 0) return empty ?? <NoMoreRecipes />;

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
