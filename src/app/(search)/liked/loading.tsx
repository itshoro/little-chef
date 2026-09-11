import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton height={20} width="120px" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
      <Skeleton height={72} width="100%" className="mb-4 rounded-xl" />
    </>
  );
};

export default Loading;