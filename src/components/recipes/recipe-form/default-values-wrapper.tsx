"use client";

import {
  useFormStateContext,
  type FormState,
} from "@/components/forms/form/root";
import type { RecipeOutputPublicDTO } from "@/lib/services/recipe/types";
import type { CreateRecipeControls } from "../../../app/(default)/recipes/add/action";
import { Inputs } from "./inputs";
import type { DrizzleRecipePreferences } from "@/drizzle/schema";

type RecipeFormContextWrapperProps = {
  preferences?: DrizzleRecipePreferences;
};

const DefaultValuesWrapper = ({
  preferences,
}: RecipeFormContextWrapperProps) => {
  const formStateContext = useFormStateContext(
    "RecipeFormContextWrapper",
  ) as FormState<CreateRecipeControls>;

  let defaultValue: React.ComponentProps<typeof Inputs>["defaultValue"];
  if (formStateContext.success === false) {
    defaultValue = {
      recipe: {
        name: formStateContext.controls?.name,
        recommendedServingSize: formStateContext.controls?.servings,
        preparationTime: formStateContext.controls?.preparationTime,
        cookingTime: formStateContext.controls?.cookingTime,
        // @ts-expect-error: let user handle this case
        visibility: formStateContext.controls?.visibility,
        // @ts-expect-error: consider how to handle this
        coverSrc: formStateContext.controls?.cover,
        description: formStateContext.controls?.description,
      },
      steps: Object.entries(formStateContext.controls.step)
        .map(([uuid, description], i) => ({
          publicId: uuid,
          description: description,
          order: i,
        }))
        .filter((item) => typeof item.description === "string"),
    };
  } else if (preferences !== undefined) {
    defaultValue = {
      recipe: {
        name: "",
        recommendedServingSize: preferences.defaultServingSize,
        visibility: preferences.defaultVisibility,
      },
      steps: [
        {
          publicId: crypto.randomUUID(),
          description: "",
          order: 1,
        },
      ],
    };
  }

  return <Inputs defaultValue={defaultValue} />;
};

export { DefaultValuesWrapper };
