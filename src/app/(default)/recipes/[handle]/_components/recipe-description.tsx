"use client";

import { Avatar } from "@/components/users/avatar";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import { useState } from "react";

const TRUNCATED_DESCRIPTION_LENGTH = 200;

const RecipeDescription = ({
  collaborators,
  description,
}: {
  collaborators: Collaborator[];
  description: string | null;
}) => {
  const [expanded, setExpanded] = useState(false);
  const truncatedDescription = description?.substring(
    0,
    TRUNCATED_DESCRIPTION_LENGTH - 1,
  );

  if (!description || !truncatedDescription) {
    return null;
  }

  return (
    <section>
      <div className="mb-4">
        <Attributions maintainers={collaborators} />
      </div>
      <div className="group" aria-expanded={expanded}>
        <p className="mb-2 leading-relaxed text-balance text-stone-400">
          {expanded ? description : <>{truncatedDescription}&hellip;</>}
        </p>
        <button
          onClick={() => setExpanded(true)}
          className="block cursor-pointer self-start text-sm font-medium group-aria-expanded:hidden"
        >
          Show more
        </button>
        <button
          onClick={() => setExpanded(false)}
          className="hidden cursor-pointer self-start text-sm font-medium group-aria-expanded:block"
        >
          Show less
        </button>
      </div>
    </section>
  );
};

const Attributions = ({ maintainers }: { maintainers: Collaborator[] }) => {
  return (
    <>
      {maintainers.map((maintainer) => (
        <article
          key={maintainer.user.publicId}
          className="inline-flex w-max shrink-0 items-center gap-2"
        >
          <Avatar src={maintainer.user.avatar?.url} alt="" size="size-8" />

          <span className="text-sm text-white capitalize">
            {maintainer.user.username}
          </span>
        </article>
      ))}
    </>
  );
};

export { RecipeDescription };
