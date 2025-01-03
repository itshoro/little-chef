"use client";

import {
  useFormStateContext,
  type FormState,
} from "@/app/components/form/root";
import type { getRecipePreferences } from "@/lib/dal/recipe";
import type { CreateRecipeControls } from "../../add/action";
import { Inputs } from "./inputs";

type RecipeFormContextWrapperProps = {
  userPreferences?: Awaited<ReturnType<typeof getRecipePreferences>>;
};

const DefaultValuesWrapper = ({
  userPreferences,
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
      steps: formStateContext.controls?.steps.map((step, i) => ({
        ...step,
        order: i,
      })),
    };
  } else if (userPreferences !== undefined) {
    defaultValue = {
      recipe: {
        name: "",
        recommendedServingSize: userPreferences.defaultServingSize,
        visibility: userPreferences.defaultVisibility,
      },
      steps: [
        {
          publicId: crypto.randomUUID(),
          description: "",
          order: 1,
        },
        {
          publicId: crypto.randomUUID(),
          description: "",
          order: 2,
        },
      ],
    };
  }

  return <Inputs defaultValue={defaultValue} />;
};

export { DefaultValuesWrapper };
