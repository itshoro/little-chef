"use client";

import { Ingredient } from "@/lib/ingredients/actions/read";
import * as Ariakit from "@ariakit/react";
import * as Input from "@/app/components/input";

import {
  Suspense,
  forwardRef,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { Plus } from "../components/icon/plus";
import { Minus } from "../components/icon/minus";
import { CreateIngredientType } from "@/lib/ingredients/actions/create";

const SearchInProgress = () => <div>Loading...</div>;

type IngredientSelectProps = {
  defaultValue?: Ingredient;
  name: string;
};

const IngredientSelect = ({ defaultValue, name }: IngredientSelectProps) => {
  const [displayName, setDisplayName] = useState<string>(
    defaultValue?.name[0].name ?? "",
  );
  const { searchTerm, setSearchTerm, results, redoSearch } =
    useMatchIngredients();

  return (
    <Ariakit.ComboboxProvider setValue={setSearchTerm}>
      <Ariakit.SelectProvider
        setValue={(value) =>
          setDisplayName(
            results.find((result) => result.publicId === value)?.name[0].name ??
              "",
          )
        }
      >
        <Ariakit.SelectLabel className="font-medium pb-2">
          Ingredient
        </Ariakit.SelectLabel>
        <Ariakit.Select
          name={name}
          className="min-w-96 select-none gap-1 p-2 bg-stone-100 ring-1 ring-black/5 rounded-xl"
        >
          <div className="flex items-center justify-between">
            {displayName}
            <Plus />
          </div>
        </Ariakit.Select>
        <Ariakit.SelectPopover
          sameWidth
          gutter={4}
          className="absolute z-10 max-h-64 w-full overflow-auto rounded-2xl bg-stone-100 text-base shadow-lg ring-1 ring-black/5 focus:outline-none font-medium"
        >
          <div className="relative">
            <div className="sticky top-0 bg-white">
              <div className="border-b border-b-black/10 p-2">
                <div className="flex items-stretch gap-2 mx-1">
                  <Ariakit.Combobox
                    placeholder="e.g., Pizza"
                    className="p-2 rounded-xl"
                  />
                  <CreateIngredientDialogButton
                    defaultValue={searchTerm}
                    onRecipeCreationStarted={redoSearch}
                  />
                </div>
              </div>
            </div>
            <Ariakit.ComboboxList className="py-1">
              <Suspense fallback={<SearchInProgress />}>
                <Ariakit.ComboboxGroup>
                  {results.length === 0 && (
                    <div className="text-center p-2">
                      <p>
                        No results for{" "}
                        <span className="font-bold">{searchTerm}</span>
                      </p>
                      <p className="text-sm text-stone-600">
                        But you can create it. Just hit "Add".
                      </p>
                    </div>
                  )}
                  {results.map((result) => (
                    <Ariakit.SelectItem
                      key={result.publicId}
                      value={result.publicId}
                      className="py-1 px-2 mx-1 my-0.5 rounded-lg hover:bg-white hover:ring-1 hover:ring-black hover:ring-opacity-5 cursor-pointer"
                      render={<Ariakit.ComboboxItem />}
                    >
                      {result.name.find((i18n) => i18n.name)?.name}
                    </Ariakit.SelectItem>
                  ))}
                </Ariakit.ComboboxGroup>
              </Suspense>
            </Ariakit.ComboboxList>
          </div>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </Ariakit.ComboboxProvider>
  );
};

const CreateIngredientDialogButton = ({
  defaultValue,
  onRecipeCreationStarted,
  onRecipeCreationError,
  onRecipeCreationDone,
}: {
  defaultValue?: string;
  onRecipeCreationStarted?: () => void;
  onRecipeCreationError?: () => void;
  onRecipeCreationDone?: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    dialogRef.current!.showModal();
  }

  async function createIngredient(e: React.SyntheticEvent<HTMLDialogElement>) {
    const ingredient = dialogRef.current?.returnValue;

    if (!ingredient) return;

    if (onRecipeCreationStarted) onRecipeCreationStarted();
    try {
      await fetch(new URL("/api/ingredients", window.location.href), {
        method: "POST",
        body: JSON.stringify({
          name: ingredient,
          languageCode: "de",
        } satisfies CreateIngredientType),
      });
      if (onRecipeCreationDone) onRecipeCreationDone();
    } catch {
      if (onRecipeCreationError) onRecipeCreationError();
    }
  }

  return (
    <>
      <CreateIngredientDialog
        defaultValue={defaultValue}
        ref={dialogRef}
        onClose={createIngredient}
      />
      <button
        onClick={openModal}
        type="button"
        className="flex w-[calc(100%_-_0.5rem)] items-center py-1 pl-0.5 pr-2 rounded-lg hover:bg-white hover:ring-1 hover:ring-black hover:ring-opacity-5 cursor-pointer"
      >
        <Plus /> Add
      </button>
    </>
  );
};

type CreateIngredientDialogProps = {
  defaultValue?: string;
  onClose?: React.ReactEventHandler<HTMLDialogElement>;
};

const CreateIngredientDialog = forwardRef<
  HTMLDialogElement,
  CreateIngredientDialogProps
>(({ defaultValue, onClose }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  function close(returnValue?: string) {
    formRef.current!.reset();
    (ref as React.RefObject<HTMLDialogElement>).current!.close(returnValue);
  }

  return (
    <dialog
      className="p-6 rounded-2xl"
      ref={ref}
      onClose={onClose}
      onCancel={() => close()}
    >
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          close(
            new FormData(e.target as HTMLFormElement).get("name") as string,
          );
        }}
        className="relative"
      >
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Create Ingredient</h1>
            <button
              className="p-2 bg-stone-50 ring-1 ring-black/10 rounded-lg"
              type="reset"
              onClick={() => close()}
              formNoValidate
            >
              <Minus />
            </button>
          </div>
        </div>
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Group>
            <Input.Element
              required
              autoFocus={true}
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              name="name"
              defaultValue={defaultValue}
            />
          </Input.Group>
        </Input.Root>
        <Input.Root>
          <Input.Element name="creatorId" type="hidden" />
          <Input.Element value="en" name="language" type="hidden" />
        </Input.Root>

        <menu>
          <button
            className="mt-8 inline-flex px-3 text-sm items-center gap-1 bg-stone-50 border hover:bg-stone-200 hover:shadow-inner text-stone-600 rounded-full transition ease-out motion-reduce:transition-none font-medium p-1"
            type="submit"
          >
            Create
          </button>
        </menu>
      </form>
    </dialog>
  );
});

function useMatchIngredients() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [results, setResults] = useState<Ingredient[]>([]);

  async function findIngredients(options?: RequestInit) {
    const url = new URL("/api/ingredients", window.location.href);
    url.searchParams.append("searchTerm", deferredSearchTerm);

    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed fetching ingredients.");
    return response.json() as Promise<Ingredient[]>;
  }

  function redoSearch() {
    findIngredients().then(setResults);
  }

  useEffect(() => {
    const controller = new AbortController();
    findIngredients({ signal: controller.signal }).then(setResults);

    return () => controller.abort();
  }, [deferredSearchTerm]);

  return { deferredSearchTerm, searchTerm, setSearchTerm, results, redoSearch };
}

export { IngredientSelect };
