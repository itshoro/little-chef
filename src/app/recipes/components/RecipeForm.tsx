import { type Recipe } from "@/lib/recipes/validators";
import { StepsInput } from "./StepsInput";

type RecipeFormProps = {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  preFill?: Recipe;
};

const RecipeForm = ({ action, children, preFill }: RecipeFormProps) => {
  return (
    <form action={action}>
      <input type="hidden" value={preFill?.id} name="id" />
      <div>
        <label className="block" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={preFill?.name}
          required
        />
      </div>
      <div>
        <label className="block" htmlFor="servings">
          Servings
        </label>
        <input
          type="number"
          name="servings"
          id="servings"
          defaultValue={preFill?.servings}
          min={0}
          required
        />
      </div>
      <div>
        <label className="block" htmlFor="totalDuration">
          Time Needed
        </label>
        <input
          type="text"
          name="totalDuration"
          defaultValue={preFill?.totalDuration}
          pattern="\d{2}:\d{2}"
        />
      </div>
      <StepsInput preFill={preFill?.steps} />

      {children}
    </form>
  );
};

const SubmitButton = ({ children }: { children: React.ReactNode }) => (
  <button type="submit">{children}</button>
);

RecipeForm.Submit = SubmitButton;

export { RecipeForm };
