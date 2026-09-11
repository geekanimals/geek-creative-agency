import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Leave draft preview and return to the public site. */
export async function GET() {
  const dm = await draftMode();
  dm.disable();
  redirect("/work");
}
