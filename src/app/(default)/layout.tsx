import { Header } from "../../components/layout/header/header";
import { BackLink } from "../../components/ui/back-link";

const Layout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header className="mx-auto w-full max-w-(--breakpoint-xl) items-center gap-3 p-4">
        <BackLink />
      </Header>
      <div className="mx-auto w-full max-w-(--breakpoint-xl)">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
