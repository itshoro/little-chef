import { Search, SearchFallback } from "../components/search/input";
import { Header } from "../components/header/header";
import * as TabNavigation from "../(user)/settings/components/tab-navigation";
import { Suspense } from "react";

const Layout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header className="mx-auto w-full max-w-(--breakpoint-xl) items-center gap-3 p-4">
        <div className="w-full">
          <Suspense fallback={<SearchFallback />}>
            <Search />
          </Suspense>
        </div>
      </Header>
      <div className="@container">
        <section className="border-b border-stone-200 pb-2 dark:border-stone-800">
          <div className="mx-auto max-w-(--breakpoint-xl) px-4">
            <Suspense>
              <TabNavigation.Root keepSearchParams={true} replace={true}>
                <TabNavigation.Link href="/collections">
                  Collections
                </TabNavigation.Link>
                <TabNavigation.Link href="/recipes">Recipes</TabNavigation.Link>
              </TabNavigation.Root>
            </Suspense>
          </div>
        </section>
      </div>
      {props.children}
    </div>
  );
};

export default Layout;
