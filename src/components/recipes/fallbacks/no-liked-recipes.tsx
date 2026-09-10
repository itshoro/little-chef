import Link from "next/link";

const NoLikedRecipes = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center font-medium select-none">
      <div className="text-6xl">❤️</div>
      <div className="text-lg">No liked recipes yet.</div>

      <Link
        className="rounded-lg p-2 text-emerald-400 hover:bg-green-50"
        href="/recipes"
      >
        Browse recipes.
      </Link>
    </div>
  );
};

export { NoLikedRecipes };
