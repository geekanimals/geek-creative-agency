/**
 * Lead API UTF-8 byte-ceiling test (no DB, no network).
 * Run: npx tsx scripts/lead-bytes-test.ts
 *
 * Proves the body-size guard measures ACTUAL UTF-8 bytes, not JS UTF-16 code
 * units. The regression: a multibyte body can be under MAX_BODY_BYTES by
 * `text.length` (UTF-16 units) yet exceed it on the wire (UTF-8 bytes).
 */
import { POST } from "../app/(frontend)/api/lead/route";

const MAX = 16 * 1024; // must match MAX_BODY_BYTES in the route

/** Minimal request stub — POST only reads headers.get() and text(). Omitting
 *  content-length forces the check past the fast Content-Length gate onto the
 *  post-read byte measurement (the fix under test). */
function req(body: string): Parameters<typeof POST>[0] {
  return { headers: new Headers(), text: async () => body } as unknown as Parameters<typeof POST>[0];
}

let pass = 0, fail = 0;
const check = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  console.log(`  ${ok ? "✓" : "✗"} ${name}: got ${got}, want ${want}`);
  ok ? pass++ : fail++;
};

async function main() {
  // "😀" = 2 UTF-16 code units, 4 UTF-8 bytes. 5000 of them:
  //   UTF-16 length = 10,000  (< 16,384 → OLD text.length check would PASS)
  //   UTF-8 bytes   = 20,000  (> 16,384 → correct check must REJECT with 413)
  const emoji = "😀".repeat(5000);
  const multibyteBody = JSON.stringify({ _form: "client", name: emoji });
  console.log(`multibyte body: utf16=${multibyteBody.length} utf8Bytes=${Buffer.byteLength(multibyteBody, "utf8")}`);
  check("utf16 length is under the limit (would fool text.length)", multibyteBody.length < MAX, true);
  check("utf8 bytes exceed the limit", Buffer.byteLength(multibyteBody, "utf8") > MAX, true);
  const tooBig = await POST(req(multibyteBody));
  check("multibyte over-limit body → 413", tooBig.status, 413);

  // Control: a small multibyte body must NOT be rejected as too large.
  const smallBody = JSON.stringify({ _form: "client", name: "Mañana 😀 café" });
  const small = await POST(req(smallBody));
  check("small multibyte body → not 413", small.status !== 413, true);

  console.log(`\n${fail === 0 ? "PASS" : "FAIL"} — ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}
main();
