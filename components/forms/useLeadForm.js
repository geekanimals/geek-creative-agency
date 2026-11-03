"use client";

import { useEffect, useState } from "react";
import { submitForm } from "@/components/forms/fields";
import { track } from "@/lib/analytics";

// form kind → analytics event prefix (client form = "brand" per spec)
const EVENT_PREFIX = { client: "brand", creator: "creator", career: "career", vendor: "vendor" };

/** Shared submit logic for every lead form: sending state, success, error, analytics. */
export function useLeadForm(kind) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState();
  const prefix = EVENT_PREFIX[kind] ?? kind;

  useEffect(() => {
    track(`${prefix}_form_open`, { form: kind });
  }, [kind, prefix]);

  async function onSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(undefined);
    const res = await submitForm(kind, e.currentTarget);
    setPending(false);
    if (res.ok) {
      setSent(true);
      track(`${prefix}_form_submit`, { form: kind });
      if (kind === "creator") track("creator_signup", { form: kind });
    } else setError(res.error);
  }

  return { pending, sent, error, onSubmit };
}
