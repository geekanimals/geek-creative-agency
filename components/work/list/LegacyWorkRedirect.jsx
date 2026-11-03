"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { legacyWorkHref } from "@/lib/work/routes";

/**
 * Old filter links (/work?brand=lays, /work?service=ugc …) now live at their own
 * URL (/work/lays). Sends any such visitor straight to the new page.
 */
export default function LegacyWorkRedirect() {
  const router = useRouter();
  const params = useSearchParams();
  const target = legacyWorkHref(params);

  useEffect(() => {
    if (target) router.replace(target);
  }, [router, target]);

  return null;
}
