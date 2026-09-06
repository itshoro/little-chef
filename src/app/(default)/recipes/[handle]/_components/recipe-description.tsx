"use client";

import { Button } from "@/components/ui/buttons/button";
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
  const descriptionRequiresTruncation =
    description && description.length >= TRUNCATED_DESCRIPTION_LENGTH;

  const [expanded, setExpanded] = useState(!descriptionRequiresTruncation);
  const truncatedDescription = description?.substring(
    0,
    TRUNCATED_DESCRIPTION_LENGTH - 1,
  );

  return (
    <section>
      <div className="">
        <Attributions maintainers={collaborators} />
      </div>
      {description && (
        <div className="group mt-4" aria-expanded={expanded}>
          <p className="mb-2 leading-relaxed text-stone-400">
            {expanded ? description : <>{truncatedDescription}&hellip;</>}
          </p>
          {descriptionRequiresTruncation && (
            <>
              <Button
                variant="ghost"
                onClick={() => setExpanded(true)}
                className="-mx-4 block! cursor-pointer self-start text-sm font-medium group-aria-expanded:hidden!"
              >
                Show more
              </Button>
              <Button
                variant="ghost"
                onClick={() => setExpanded(false)}
                className="not:group-aria-expanded:hidden -mx-4 hidden! cursor-pointer self-start text-sm font-medium group-aria-expanded:block!"
              >
                Show less
              </Button>
            </>
          )}
        </div>
      )}
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
