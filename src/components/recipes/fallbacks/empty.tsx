import Link from "next/link";

const NoMoreRecipes = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center font-medium select-none">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">There aren&apos;t any more recipes.</div>

      <Link
        className="rounded-lg p-2 text-emerald-400 hover:bg-green-50"
        href="/recipes/add"
      >
        Create a new one.
      </Link>
    </div>
  );
};

export { NoMoreRecipes };
