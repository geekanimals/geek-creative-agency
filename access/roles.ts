import type { Access, FieldAccess } from "payload";

export type Role = "owner" | "admin" | "editor" | "viewer";

const roleOf = (u: unknown): Role | undefined => (u as { role?: Role } | null | undefined)?.role;

/** Collection access helpers (server-side enforced). */
export const isAuthed: Access = ({ req: { user } }) => Boolean(user);

export const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) =>
    Boolean(user && roles.includes(roleOf(user)!));

export const isOwner: Access = hasRole("owner");
export const isAdminOrOwner: Access = hasRole("owner", "admin");
export const isEditorUp: Access = hasRole("owner", "admin", "editor"); // create/edit content
export const isAnyStaff: Access = hasRole("owner", "admin", "editor", "viewer"); // read CMS

/** Field-level access (signature differs from collection access). */
export const fieldIsAdminOrOwner: FieldAccess = ({ req: { user } }) =>
  Boolean(user && ["owner", "admin"].includes(roleOf(user)!));
export const fieldIsOwner: FieldAccess = ({ req: { user } }) => roleOf(user) === "owner";
/** Field is readable by any authenticated staff member; stripped for anonymous
 *  (public REST/GraphQL) responses. Used to keep internal editorial fields —
 *  e.g. the Search Strategy group — out of the public API even on published docs. */
export const fieldIsAnyStaff: FieldAccess = ({ req: { user } }) => Boolean(user);

/** Can this user access the admin panel at all? Any authenticated staff (viewer = read-only). */
export const canAccessAdmin = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user);
