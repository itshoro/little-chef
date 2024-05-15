import { SearchInput } from "../components/Search/Input";
import { Header } from "../components/header/header";
import * as TabNavigation from "../(user)/settings/components/tab-navigation";

const Layout = (props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  auth: React.ReactNode;
}) => {
  return (
    <>
      <Header />
      <section className="p-4">
        <SearchInput />
      </section>
      <section className="border-y border-stone-200 px-4 py-3">
        <TabNavigation.Root keepSearchParams={true} replace={true}>
          <TabNavigation.Link href="/collections">
            Collections
          </TabNavigation.Link>
          <TabNavigation.Link href="/recipes">Recipes</TabNavigation.Link>
        </TabNavigation.Root>
      </section>
      {props.children}
      {props.modal}
      {props.auth}
    </>
  );
};

export default Layout;
