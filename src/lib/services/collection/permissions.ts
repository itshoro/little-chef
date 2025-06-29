import "server-only";

import type { DrizzleCollection, IdentifiedById } from "@/drizzle/schema";
import {
  unsafeGetCollectionByIdentifier,
  unsafeGetUserPermissionsForCollection,
} from "@/lib/dal/collection";
import { CollectionNotFoundError } from "@/lib/errors/resource-not-found/collection";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { UnauthorizedError } from "@/lib/errors/unauthorized/error";
import { toIdentifier } from "@/lib/utils/to-identifier";
import type { AuthenticatedUser } from "../auth/types";

async function assertCanView(
  identifier: IdentifiedById<DrizzleCollection>,
  user: AuthenticatedUser | null,
) {
  const collection = await unsafeGetCollectionByIdentifier(identifier);
  if (!collection) throw new CollectionNotFoundError(identifier);

  if (collection.visibility !== "private") return;
  if (!user) throw new UnauthenticatedError();

  const permissions = await unsafeGetUserPermissionsForCollection(
    identifier,
    user,
  );
  if (permissions) return;

  throw new UnauthorizedError({
    name: "collection",
    identifier: toIdentifier(collection),
    user: toIdentifier(user),
  });
}

async function assertCanEdit(
  identifier: IdentifiedById<DrizzleCollection>,
  user: AuthenticatedUser,
) {
  const collection = await unsafeGetCollectionByIdentifier(identifier);
  if (!collection) throw new CollectionNotFoundError(identifier);

  const permissions = await unsafeGetUserPermissionsForCollection(
    identifier,
    user,
  );
  if (permissions && permissions.role !== "viewer") return;

  throw new UnauthorizedError({
    name: "collection",
    identifier: toIdentifier(collection),
    user: toIdentifier(user),
  });
}

async function assertCanMaintain(
  identifier: IdentifiedById<DrizzleCollection>,
  user: AuthenticatedUser,
) {
  const collection = await unsafeGetCollectionByIdentifier(identifier);
  if (!collection) throw new CollectionNotFoundError(identifier);

  const permissions = await unsafeGetUserPermissionsForCollection(
    identifier,
    user,
  );
  if (permissions && ["owner", "maintainer"].includes(permissions.role)) return;

  throw new UnauthorizedError({
    name: "collection",
    identifier: toIdentifier(collection),
    user: toIdentifier(user),
  });
}

export {
  assertCanEdit as assertCanEditCollection,
  assertCanMaintain as assertCanMaintainCollection,
  assertCanView as assertCanViewCollection,
};
