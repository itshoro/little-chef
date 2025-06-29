type IdentifierLike<TId, TPublicId> =
  | { id: TId }
  | { publicId: TPublicId }
  | { id: TId; publicId: TPublicId };

function toIdentifier<TId, TPublicId>(
  identifier: IdentifierLike<TId, TPublicId>,
) {
  let _identifier: Partial<{ id: TId; publicId: TPublicId }> = {};
  if ("id" in identifier) _identifier.id = identifier.id;
  if ("publicId" in identifier) _identifier.publicId = identifier.publicId;

  return _identifier as IdentifierLike<TId, TPublicId>;
}

export { toIdentifier };
