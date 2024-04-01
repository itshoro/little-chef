import { getOverview } from "@/lib/recipes/actions/read";
import { CTALink } from "./components/CallToAction/Link";
import { SearchInput } from "./components/Search/Input";
import { RecipeOverview } from "./components/Recipe/Overview";
import Link from "next/link";
import { validateRequest } from "@/lib/auth/lucia";
import { Collection, User } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import { Header } from "./components/header/header";
import * as Input from "./components/input";

const Page = async () => {
  const { user } = await validateRequest();

  return (
    <>
      <Header />
      <section className="p-4">
        <SearchInput />
      </section>
      <section className="px-4 py-3 border-y border-stone-200">
        <ContentFilter />
      </section>
      <main>
        <header className="px-4 py-5">
          <h1 className="flex items-center">
            <span className="inline-block size-2 mr-2.5 bg-lime-500 rounded-full" />{" "}
            <span className="text-sm font-medium">Your Saved Collections</span>
          </h1>
        </header>
      </main>
      <CollectionList user={user} />
      {/* <div className="p-2 overflow-y-auto h-full"> */}

      {/* <RecipeList /> */}
      {/* </div> */}
      {/* <footer
        className="border-t w-full flex p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="ml-auto">
          <CTALink href="/recipes/add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 opacity-50"
            >
              <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
            </svg>
            Add
          </CTALink>
        </div>
      </footer> */}
    </>
  );
};

const ContentFilter = () => {
  const route = "/collections";

  return (
    <ul className="flex">
      <li className="flex-1 flex items-center">
        <Link
          data-active={route === "/collections"}
          className="flex-1 font-medium p-3 rounded-full data-[active=true]:bg-stone-100 text-center"
          href="/collections"
        >
          Collections{" "}
          <span className="font-normal text-stone-400">&middot; 2</span>
        </Link>
      </li>
      <li className="flex-1 flex items-center">
        <Link
          data-active={route === "/recipes"}
          className="flex-1 font-medium p-3 rounded-full data-[active=true]:bg-stone-100 text-center"
          href="/recipes"
        >
          Recipes{" "}
          <span className="font-normal text-stone-400">&middot; 249</span>
        </Link>
      </li>
    </ul>
  );
};

const CollectionList = async ({ user }: { user: User | null }) => {
  if (!user) return null;
  const client = getPrismaClient();

  const collections = await client.collection.findMany({
    where: { userId: user.id },
  });

  console.log(collections, user.id);

  return (
    <ul className="grid gap-3 px-4">
      {collections.map((collection) => {
        return (
          <li key={collection.id} className="">
            <a href={`/collections/${collection.id}`}>
              <CollectionCard collection={collection} />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const CollectionCard = ({ collection }: { collection: Collection }) => {
  return (
    <article className="rounded-xl bg-stone-100 shadow-sm">
      <div className="px-4 py-5">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {collection.name}{" "}
            <div className="inline-block font-normal text-sm">
              <span className="text-stone-400">&middot;</span>{" "}
              <span className="text-lime-500">15 Recipes</span>
            </div>
          </div>
          <div>
            <img
              className="block size-10 rounded-full border-2 border-white"
              src="/timnelke.jpg"
              alt=""
            />
          </div>
        </div>
        <p className="text-stone-600 pt-3 ">
          Some description blalalala ipsumipsumipsumipsumipsum ipsum
        </p>
      </div>
    </article>
  );
};

export default Page;
