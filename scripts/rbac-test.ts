/**
 * RBAC unit checks for the server-side access helpers (no DB required).
 * Run: npx tsx scripts/rbac-test.ts
 */
import {
  isAuthed, isOwner, isAdminOrOwner, isEditorUp, isAnyStaff,
  fieldIsAdminOrOwner, fieldIsOwner, canAccessAdmin,
} from "../access/roles";

type Role = "owner" | "admin" | "editor" | "viewer";
const asReq = (role?: Role) => ({ req: { user: role ? { role } : null } }) as never;

let pass = 0, fail = 0;
const check = (name: string, got: boolean, want: boolean) => {
  const ok = got === want;
  console.log(`  ${ok ? "✓" : "✗"} ${name}: got ${got}, want ${want}`);
  ok ? pass++ : fail++;
};

const roles: (Role | undefined)[] = [undefined, "viewer", "editor", "admin", "owner"];
const label = (r?: Role) => r ?? "anonymous";

console.log("canAccessAdmin (any authenticated staff; anonymous denied):");
for (const r of roles) check(label(r), Boolean(canAccessAdmin(asReq(r))), r !== undefined);

console.log("isAnyStaff (read CMS):");
for (const r of roles) check(label(r), isAnyStaff(asReq(r)) as boolean, r !== undefined);

console.log("isEditorUp (create/edit content + media):");
for (const r of roles) check(label(r), isEditorUp(asReq(r)) as boolean, r === "editor" || r === "admin" || r === "owner");

console.log("isAdminOrOwner (manage users, delete media):");
for (const r of roles) check(label(r), isAdminOrOwner(asReq(r)) as boolean, r === "admin" || r === "owner");

console.log("isOwner (delete users):");
for (const r of roles) check(label(r), isOwner(asReq(r)) as boolean, r === "owner");

console.log("fieldIsAdminOrOwner (set/change role field):");
for (const r of roles) check(label(r), Boolean(fieldIsAdminOrOwner(asReq(r))), r === "admin" || r === "owner");

console.log("fieldIsOwner (owner-only field gate):");
for (const r of roles) check(label(r), Boolean(fieldIsOwner(asReq(r))), r === "owner");

console.log("isAuthed:");
for (const r of roles) check(label(r), isAuthed(asReq(r)) as boolean, r !== undefined);

console.log(`\n${fail === 0 ? "✓ ALL PASS" : "✗ FAILURES"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
