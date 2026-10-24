/**
 * Set a new password for a CMS (/admin) user — for when you're locked out and
 * "Forgot password?" can't email you (no CMS email adapter configured).
 *
 * Run from the project folder (Node 22):
 *   set -a; . ./.env.local; set +a; npx tsx scripts/reset-admin-password.ts
 *
 * It asks for the email and the new password in the terminal (the password is
 * NOT shown while you type and is never printed or saved anywhere else).
 * Also clears a login lock-out (5 wrong attempts → 10 min lock).
 */
import readline from "node:readline";
import { getPayload } from "payload";
import config from "../payload.config";

function ask(q: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      const out = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
      out._writeToOutput = (s: string) => { if (s.includes(q)) out.output.write(s); else out.output.write("*"); };
    }
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a.trim()); });
  });
}

async function main() {
  const email = (await ask("CMS user email: ")).toLowerCase();
  const password = await ask("New password (min 8 chars): ", true);
  const again = await ask("Type it again: ", true);
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (password !== again) throw new Error("The two passwords don't match.");

  const payload = await getPayload({ config });
  const found = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
  const user = found.docs[0];
  if (!user) throw new Error(`No CMS user with email ${email}.`);

  await payload.update({
    collection: "users",
    id: user.id,
    data: { password, loginAttempts: 0, lockUntil: null } as never,
    overrideAccess: true,
    // act AS this user, so the "only an Owner can modify an Owner" guard
    // (collections/Users.ts) sees the owner changing their own password
    user: { ...user, collection: "users" } as never,
  });
  console.log(`\n✓ Password updated for ${email}. Log in at /admin.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(`\n✖ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
