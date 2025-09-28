import UserPage from "./user/page";

const OverviewPage = () => {
  return (
    <div className="hidden w-full flex-col gap-8 lg:flex">
      <UserPage />
    </div>
  );
};

export default OverviewPage;
