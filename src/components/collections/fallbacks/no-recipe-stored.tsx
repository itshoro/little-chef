const NoRecipesStored = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center font-medium select-none">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">You haven&apos;t stored a recipe yet.</div>
    </div>
  );
};

export { NoRecipesStored };
