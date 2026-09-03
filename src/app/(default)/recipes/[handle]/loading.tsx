import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="px-4">
      <Skeleton height={400} width="100%" className="mb-6 rounded-xl" />
      <div className="flex">
        <Skeleton height={48} width={48} className="mb-6 rounded-full" />
        <div className="mb-12 ml-auto flex gap-4">
          <Skeleton height={48} width={48} className="mb-6 rounded-full" />
          <Skeleton height={48} width={48} className="mb-6 rounded-full" />
        </div>
      </div>
      <Skeleton height={24} width="80%" className="mb-6 rounded-xl" />
      <Skeleton height={16} width="100%" className="mb-2 rounded-xl" />
      <Skeleton height={16} width="100%" className="mb-2 rounded-xl" />
      <Skeleton height={16} width="60%" className="mb-2 rounded-xl" />
    </div>
  );
};

export default Loading;
