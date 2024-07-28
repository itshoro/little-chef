const NoRecipesStored = () => {
  return (
    <div className="flex h-full select-none flex-col items-center justify-center gap-4 text-center font-medium">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">You haven't stored a recipe yet.</div>
    </div>
  );
};

export { NoRecipesStored };
