"use client";

import { LinkButton } from "@/components/ui/buttons/link-button";
import { useSearchParams } from "next/navigation";

const ToWizardForm = ({ handle }: { handle: string }) => {
  const params = useSearchParams();

  return (
    <div className="flex">
      <LinkButton
        variant="primary"
        href={`/recipes/${handle}/wizard/0?servings=${params.get("servings")}`}
        className="pointer-events-auto ml-auto"
      >
        <div className="flex items-center gap-6">
          Start
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </LinkButton>
    </div>
    // <Form
    //   action={`/recipes/${handle}/wizard/0`}
    //   className="flex max-w-full flex-1 flex-wrap items-end justify-end gap-8"
    // >
    //   <Button type="submit" className="pointer-events-auto">

    //   </Button>
    // </Form>
  );
};

export { ToWizardForm };
