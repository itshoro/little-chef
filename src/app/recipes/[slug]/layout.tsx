import { BackLink } from "@/app/components/back-link";
import { Header } from "@/app/components/header/header";

const RecipeLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex items-center gap-2">
          <BackLink />
        </div>
      </Header>
      {children}
    </div>
  );
};

export default RecipeLayout;
