const Header = () => {
  return (
    <header className="px-4 py-4" style={{ gridArea: "header", gridColumn: 1 }}>
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="rounded-lg p-1 bg-white ring-1 ring-black/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
        </Link>
        <h1 className="font-medium">{recipe.name}</h1>
      </div>
    </header>
  );
};

export { Header };
