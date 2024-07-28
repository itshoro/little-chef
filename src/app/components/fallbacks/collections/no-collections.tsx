import Link from "next/link";

const NoCollections = () => {
  return (
    <div className="flex h-full select-none flex-col items-center justify-center gap-4 text-center font-medium">
      <div className="text-6xl">🍽️</div>
      <div className="text-lg">You haven't created a collection yet.</div>

      <Link
        className="rounded-lg p-2 text-emerald-400 hover:bg-green-50"
        href="/collections/add"
      >
        Create your first one.
      </Link>
    </div>
  );
};

export { NoCollections };
