const THEMES = ["light", "dark", "system"] as const;

const PERMISSION_ROLES = ["owner", "maintainer", "editor", "viewer"] as const;

const VISIBILITIES = ["public", "unlisted", "private"] as const;

const SESSION_SCOPES = ["sudo"] as const;
const SESSION_COOKIE_NAME = "session";

const USER_ROLES = ["admin"] as const;

export {
  VISIBILITIES,
  PERMISSION_ROLES,
  THEMES,
  USER_ROLES,
  SESSION_SCOPES,
  SESSION_COOKIE_NAME,
};
