const Loading = () => {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded-xl bg-stone-800" />
        <div className="h-16 rounded-xl bg-stone-800" />
      </div>
      <div className="mx-auto h-4 w-32 rounded-xl bg-stone-800" />
    </div>
  );
};

export default Loading;
