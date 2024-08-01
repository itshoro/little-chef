import { SearchInput } from "../components/Search/Input";
import { Header } from "../components/header/header";
import * as TabNavigation from "../(user)/settings/components/tab-navigation";
import { Suspense } from "react";

const Layout = (props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  auth: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <section className="p-4">
        <SearchInput />
      </section>
      <div className="@container">
        <section className="border-y border-stone-200 px-4 py-3">
          <Suspense>
            <TabNavigation.Root keepSearchParams={true} replace={true}>
              <TabNavigation.Link href="/collections">
                Collections
              </TabNavigation.Link>
              <TabNavigation.Link href="/recipes">Recipes</TabNavigation.Link>
            </TabNavigation.Root>
          </Suspense>
        </section>
      </div>
      {props.children}
      {props.modal}
      {props.auth}
    </div>
  );
};

export default Layout;
