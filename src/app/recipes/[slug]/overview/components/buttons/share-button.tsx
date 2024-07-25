"use client";

const ShareCurrentPageButton = ({ title }: { title: string }) => {
  return (
    <button
      onClick={() => {
        navigator.share({ title, url: window.location.href });
      }}
      className="inline-flex justify-center rounded-xl border px-6 py-4 shadow transition-all active:bg-neutral-100 active:shadow-inner"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-4"
      >
        <path d="M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" />
      </svg>

      <span className="sr-only">Share</span>
    </button>
  );
};

export { ShareCurrentPageButton };
