import { Suspense } from "react";
import { Header, HeaderFallback } from "../../components/layout/header/header";
import { BackLink } from "../../components/ui/back-link";

const Layout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4">
        <Suspense fallback={<HeaderFallback />}>
          <Header className="mx-auto w-full max-w-(--breakpoint-xl) items-center gap-3">
            <BackLink />
          </Header>
        </Suspense>
      </div>
      {props.children}
    </div>
  );
};

export default Layout;
