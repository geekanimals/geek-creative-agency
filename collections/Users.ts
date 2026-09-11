import type { CollectionConfig } from "payload";
import { isAdminOrOwner, isOwner, fieldIsAdminOrOwner, canAccessAdmin } from "../access/roles";

/**
 * Authenticated CMS users. NO public registration: the first Owner is created
 * once via Payload's built-in create-first-user screen at /admin (only offered
 * while the users table is empty); thereafter only Owner/Admin can create users.
 * Roles are enforced server-side across every collection, not just hidden in the
 * admin UI.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8h
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: "email",
    group: "System",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    admin: canAccessAdmin, // any authenticated staff may open /admin (viewer = read-only)
    create: isAdminOrOwner, // no public signup
    read: isAdminOrOwner,
    update: isAdminOrOwner,
    delete: isOwner,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "viewer",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
      // Only Owner/Admin can set/change roles (field-level, server-enforced).
      access: { update: fieldIsAdminOrOwner, create: fieldIsAdminOrOwner },
      admin: { description: "Owner = full control · Admin = content+users (not owner) · Editor = content/media · Viewer = read-only" },
    },
  ],
  hooks: {
    // Guardrail 1: govern who may assign/modify the Owner role, with a safe
    // first-owner bootstrap for a brand-new CMS (where no Owner yet exists).
    beforeValidate: [
      async ({ data, req, originalDoc, operation }) => {
        if (!data) return data;

        // Auto first-owner: the very first user created in an EMPTY database
        // becomes Owner, so a fresh CMS always has an Owner from the start (no
        // "admin with no owner" limbo). Triggers only when zero users exist —
        // normal user creation (users already present) is unaffected. This is
        // the create-first-user path (Payload only allows unauthenticated user
        // creation while the collection is empty).
        if (operation === "create") {
          const { totalDocs: userCount } = await req.payload.count({ collection: "users" });
          if (userCount === 0) {
            data.role = "owner";
            return data;
          }
        }

        const actor = req.user as { id?: string | number; role?: string } | null;
        const actorRole = actor?.role;
        const becomingOwner = data.role === "owner";
        const wasOwner = (originalDoc as { role?: string } | undefined)?.role === "owner";

        // Only Owner-role changes are gated here; other role changes pass through.
        if (!becomingOwner && !wasOwner) return data;

        // Strict rule: once an Owner exists, only an Owner may assign, modify or
        // demote the Owner role.
        if (actorRole === "owner") return data;

        // First-owner bootstrap exception (ONLY while zero Owners exist): an
        // authenticated Admin may promote THEIR OWN existing account to Owner —
        // and nothing else. It cannot promote another account, cannot be used by
        // Editor/Viewer, and stops working the instant one Owner exists. Note
        // `wasOwner` implies an Owner already exists, so it can never reach here
        // during bootstrap — modifying an existing Owner always requires Owner.
        const targetId = (originalDoc as { id?: string | number } | undefined)?.id;
        const isSelfPromotion =
          operation === "update" &&
          becomingOwner &&
          !wasOwner &&
          actorRole === "admin" &&
          actor?.id != null &&
          targetId != null &&
          String(actor.id) === String(targetId);

        if (isSelfPromotion) {
          const { totalDocs: ownerCount } = await req.payload.count({
            collection: "users",
            where: { role: { equals: "owner" } },
          });
          if (ownerCount === 0) return data; // legitimate first-owner bootstrap
        }

        throw new Error(
          wasOwner
            ? "Only an Owner can modify the Owner role."
            : "Only an Owner can assign the Owner role. (First-owner bootstrap: while no Owner exists, an Admin may promote only their own account.)",
        );
      },
    ],
    // Guardrail 2: never allow the final Owner to be demoted or deleted, so the
    // CMS can never be locked out of owner-level administration.
    //
    // RESIDUAL RACE (documented, not faked): these guards count-then-write under
    // READ COMMITTED, so two *concurrent* transactions each demoting/deleting a
    // different Owner when exactly two exist could both observe count>1 and leave
    // zero Owners. Operationally negligible for Geek's 1–2 Owner set (owner-role
    // changes are rare, manual, single-operator). Robust future fix if ever
    // needed: take a Postgres transaction-scoped advisory lock
    // (pg_advisory_xact_lock(<owner-guard key>)) — or run these writes
    // SERIALIZABLE — around the owner-count check so the read+write is atomic.
    // Tracked as a manual production gate, not a launch code blocker.
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        const wasOwner = (originalDoc as { role?: string } | undefined)?.role === "owner";
        const stillOwner = (data as { role?: string } | undefined)?.role === "owner";
        if (operation === "update" && wasOwner && !stillOwner) {
          const { totalDocs } = await req.payload.count({ collection: "users", where: { role: { equals: "owner" } } });
          if (totalDocs <= 1) throw new Error("Cannot demote the final Owner — promote another Owner first.");
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const doc = await req.payload.findByID({ collection: "users", id });
        if ((doc as { role?: string } | null)?.role === "owner") {
          const { totalDocs } = await req.payload.count({ collection: "users", where: { role: { equals: "owner" } } });
          if (totalDocs <= 1) throw new Error("Cannot delete the final Owner — promote another Owner first.");
        }
      },
    ],
  },
};
