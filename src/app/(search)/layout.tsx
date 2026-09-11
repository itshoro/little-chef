import { Search } from "../../components/ui/search-input";
import { Header } from "../../components/layout/header/header";
import * as TabNavigation from "../../components/layout/tab-navigation";
import { validateSession } from "../../lib/utils/auth/validate-session";
import { Suspense } from "react";
import { connection } from "next/server";

const Layout = async (props: { children: React.ReactNode }) => {
  await connection();
  const { user } = await validateSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <Header className="mx-auto w-full max-w-(--breakpoint-xl) items-center gap-3 p-4">
          <div className="w-full">
            <Search />
          </div>
        </Header>
      </Suspense>
      <div className="@container">
        <section className="border-b border-stone-200 pb-2 dark:border-stone-800">
          <div className="mx-auto max-w-(--breakpoint-xl) px-4">
            <Suspense>
              <TabNavigation.Root keepSearchParams={true} replace={true}>
                <TabNavigation.Link href="/collections">
                  Collections
                </TabNavigation.Link>
                <TabNavigation.Link href="/recipes">Recipes</TabNavigation.Link>
                {user && (
                  <>
                    <TabNavigation.Link href="/history">
                      History
                    </TabNavigation.Link>
                    <TabNavigation.Link href="/liked">Liked</TabNavigation.Link>
                  </>
                )}
              </TabNavigation.Root>
            </Suspense>
          </div>
        </section>
      </div>
      <div className="mx-auto w-full max-w-(--breakpoint-xl) p-4">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
