import { useDialogContext } from "../dialog";

type DeleteRecipeProps = {
  deleteRecipeAction: () => Promise<void>;
};

const DeleteRecipe = ({ deleteRecipeAction }: DeleteRecipeProps) => {
  const { closeDialog } = useDialogContext(DeleteRecipe.name);

  return (
    <>
      <h1 className="text-xl">
        Are you sure that you want to delete this recipe?
      </h1>
      <p>This action cannot be undone.</p>
      <div className="mt-8 flex justify-end gap-2">
        <button
          className="rounded-lg p-2 font-medium text-red-700 transition-colors ease-out hover:bg-red-800 hover:text-white"
          onClick={async () => {
            await deleteRecipeAction();
            closeDialog();
          }}
        >
          Yes, Delete it.
        </button>
        <button
          className="rounded-lg bg-stone-200 p-2 font-medium"
          onClick={closeDialog}
        >
          No, Take me back.
        </button>
      </div>
    </>
  );
};

export { DeleteRecipe };
