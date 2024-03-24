"use client";

import { Ingredient } from "@/lib/ingredients/actions/read";
import { useState } from "react";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";

const IngredientTextFormElement = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [content, setContent] = useState();

  const ingredientSuggestions = ingredients.map(
    (ingredient) =>
      ({
        id: ingredient.id,
        display: ingredient.name[0].name,
      }) satisfies SuggestionDataItem
  );

  return (
    <MentionsInput value={content} onChange={(e) => setContent(e.target.value)}>
      <Mention
        trigger="@"
        data={ingredientSuggestions}
        renderSuggestion={(suggestion) => <div>{suggestion.display}</div>}
      />
    </MentionsInput>
  );
};

export { IngredientTextFormElement };
