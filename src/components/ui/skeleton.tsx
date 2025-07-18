type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

const Skeleton = ({
  width = "100%",
  height = 20,
  className = "",
}: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-stone-200 dark:bg-stone-800 ${className}`}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
};

export default Skeleton;
