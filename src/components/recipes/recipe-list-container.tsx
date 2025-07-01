import type { RecipePreviewDTO } from "@/lib/services/recipe/types";
import { Section } from "../ui/section";
import { NoMoreRecipes } from "./fallbacks/empty";
import { RecipeCard } from "./recipe-card";

type RecipeListProps = {
  title: string;
  recipes: RecipePreviewDTO[];
};

const RecipeList = ({ recipes, title }: RecipeListProps) => {
  return (
    <Section title={title}>
      <Contents recipes={recipes} />
    </Section>
  );
};

const Contents = ({ recipes }: { recipes: RecipePreviewDTO[] }) => {
  if (recipes.length === 0) return <NoMoreRecipes />;

  return (
    <ul>
      {recipes.map((dto) => (
        <li key={dto.recipe.publicId}>
          <RecipeCard recipe={dto.recipe} maintainers={dto.maintainers} />
        </li>
      ))}
    </ul>
  );
};

export { RecipeList };
