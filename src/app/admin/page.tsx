import { getPrismaClient } from "@/lib/prisma";

const AdminDashboard = async () => {
  return (
    <div className="p-4">
      <div className="mb-2">Admin Dashboard</div>
      <div className="grid grid-cols-2 gap-4">
        <IngredientCard />
        <RecipeCard />
      </div>
    </div>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-stone-200 px-5 py-3 rounded-xl">{children}</div>;
};

const IngredientCard = async () => {
  const prisma = getPrismaClient();
  const count = await prisma.ingredient.count();

  return (
    <Card>
      <div className="">
        <div className="text-xl">{count}</div>
        <div className="text-sm ">Ingredients</div>
      </div>
    </Card>
  );
};

const RecipeCard = async () => {
  const prisma = getPrismaClient();
  const count = await prisma.recipe.count();

  return (
    <Card>
      <div className="">
        <div className="text-xl">{count}</div>
        <div className="text-sm ">Recipes</div>
      </div>
    </Card>
  );
};

export default AdminDashboard;
