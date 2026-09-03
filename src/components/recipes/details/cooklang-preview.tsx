"use client";

import {
  getNumericValue,
  Parser,
  type Cookware,
  type Ingredient,
  type Quantity,
  type ScaledRecipeWithReport,
  type Step,
  type Timer,
} from "@cooklang/cooklang";
import { Fragment, useRef } from "react";

const CooklangPreview = ({
  value,
  ingredientScaleFactor = 1,
}: {
  value?: string;
  ingredientScaleFactor?: number;
}) => {
  const parserRef = useRef<Parser>(null);
  if (parserRef.current === null) {
    parserRef.current = new Parser();
  }

  const recipe = value ? parserRef.current.parse(value).recipe : null;
  const sections = recipe?.sections ?? [];

  if (!recipe || sections.length === 0) return null;

  return (
    <div>
      {sections.map((section, i) => (
        <p key={i} className="leading-relaxed text-balance whitespace-normal">
          {section.content.map((step, stepId) => {
            switch (step.type) {
              case "text":
                return <Fragment key={i}>{step.value}</Fragment>;
              case "step":
                return (
                  <CooklangStep
                    recipe={recipe}
                    scaleFactor={ingredientScaleFactor}
                    step={step.value}
                  />
                );
            }
          })}
        </p>
      ))}
    </div>
  );
};

const CooklangStep = ({
  recipe,
  scaleFactor,
  step,
}: {
  recipe: ScaledRecipeWithReport["recipe"];
  scaleFactor: number;
  step: Step;
}) => {
  return (
    <>
      {step.items.map((item, i) => {
        switch (item.type) {
          case "ingredient":
            return (
              <CooklangStepIngredient
                ingredient={recipe.ingredients[item.index] as Ingredient}
                scaleFactor={scaleFactor}
              />
            );
          case "cookware":
            return (
              <CooklangStepCookware
                cookware={recipe.cookware[item.index] as Cookware}
              />
            );
          case "timer":
            return (
              <CooklangStepTimer timer={recipe.timers[item.index] as Timer} />
            );
          case "inlineQuantity":
            return (
              <CooklangStepInlineQuantity
                scaleFactor={scaleFactor}
                quantity={recipe.inline_quantities[item.index] as Quantity}
              />
            );
          case "text":
            return <>{item.value}</>;
        }
      })}
    </>
  );
};

const CooklangStepTimer = ({ timer }: { timer: Timer }) => {
  return null;
  //  <time dateTime={`P${step.quantity}`}>
  //           {step.quantity} {step.units}
  //         </time>
};

const CooklangStepCookware = ({ cookware }: { cookware: Cookware }) => {
  return null;
};

const CooklangStepIngredient = ({
  ingredient,
  scaleFactor = 1,
}: {
  ingredient: Ingredient;
  scaleFactor: number;
}) => {
  return (
    <span className="my-0.5 inline-flex rounded-full border border-stone-300 px-2 whitespace-pre-line dark:border-stone-700">
      <CooklangStepInlineQuantity
        quantity={ingredient.quantity}
        scaleFactor={scaleFactor}
      />
      <span className="p-1">{ingredient.name}</span>
    </span>
  );
};

const CooklangStepInlineQuantity = ({
  quantity,
  scaleFactor,
}: {
  quantity: Ingredient["quantity"];
  scaleFactor: number;
}) => {
  if (!quantity) return null;

  return (
    <span className="border-r border-stone-300 p-1 dark:border-stone-700">
      <span>
        <CooklangStepInlineQuantityValue
          scalable={quantity.scalable}
          scaleFactor={scaleFactor}
          value={quantity.value}
        />
      </span>
      {quantity.unit && <span>{quantity.unit}</span>}
    </span>
  );
};

const CooklangStepInlineQuantityValue = ({
  scalable,
  scaleFactor,
  value,
}: {
  scalable: boolean;
  scaleFactor: number;
  value: Quantity["value"];
}) => {
  switch (value.type) {
    case "number":
    case "range": {
      const num = getNumericValue(value) ?? 0;
      return <>{scalable ? num * scaleFactor : num}</>;
    }
    case "text":
      return <>{value.value}</>;
  }
};

export { CooklangPreview };
