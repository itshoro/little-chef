import { BackLink } from "@/app/components/back-link";
import { Header } from "@/app/components/header/header";

const RecipeLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <BackLink />
        </div>
      </Header>
      {children}
    </>
  );
};

export default RecipeLayout;
