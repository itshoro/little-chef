"use client";

import { useActionState, useCallback, useRef } from "react";

type InfiniteScrollingViewProps = {
  initialContext: ViewContext<any>;
  action: (context: ViewContext<any>) => Promise<ViewContext<any>>;
};

const InfiniteScrollingView = ({
  initialContext,
  action,
}: InfiniteScrollingViewProps) => {
  const [context, loadingRef] = useInfiniteScroll(initialContext, action);

  if (context.data.length === 0 && !context.hasMore) {
    return <NothingFound />;
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        {context.data.map((item, index) => (
          <div key={index} className="rounded border p-4 shadow-sm">
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
      {context.hasMore ? (
        <div ref={loadingRef} className="flex h-16 items-center justify-center">
          <span>Loading more...</span>
        </div>
      ) : (
        <EndOfResults />
      )}
    </div>
  );
};
const NothingFound = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-semibold">No results found</h2>
      <p className="text-sm text-gray-500">
        Try adjusting your search or filter criteria.
      </p>
    </div>
  </div>
);

const EndOfResults = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-semibold">End of results</h2>
      <p className="text-sm text-gray-500">
        You've reached the end of the list.
      </p>
    </div>
  </div>
);

type ViewContext<T> = {
  data: T[];
  hasMore: boolean;
  offset: number;
};

function useInfiniteScroll<T>(
  initialContext: ViewContext<T>,
  action: (context: ViewContext<T>) => Promise<ViewContext<T>>,
) {
  const observer = useRef<IntersectionObserver>(null);
  const [context, nextPage, pending] = useActionState(action, initialContext);

  const loadingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (pending || !context.hasMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          nextPage();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [pending, context.hasMore, context.offset, nextPage],
  );

  return [context, loadingRef] as const;
}

export { InfiniteScrollingView };
