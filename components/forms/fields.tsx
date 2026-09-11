"use client";

import { ReactNode } from "react";

/**
 * Posts the lead to the live handler at /api/lead. Delivery provider (email /
 * Formspree / webhook / Slack) is chosen server-side by env var — see
 * app/api/lead/route.ts and .env.example. No provider set → logged in dev.
 */
export async function submitForm(
  kind: string,
  data: Record<string, FormDataEntryValue>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _form: kind, ...data }),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.error || "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please check your connection." };
  }
}

/** Hidden anti-spam honeypot. Bots fill it; humans never see it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  half,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  half?: boolean;
}) {
  return (
    <label className={`block ${half ? "sm:col-span-1" : "sm:col-span-2"}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
        {label} {required && <span className="text-geek-deep">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-b border-mist bg-transparent py-2.5 text-ink outline-none transition focus:border-geek-cyan"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
        {label} {required && <span className="text-geek-deep">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none border-b border-mist bg-transparent py-2.5 text-ink outline-none transition focus:border-geek-cyan"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  half?: boolean;
}) {
  return (
    <label className="block sm:col-span-1">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
        {label} {required && <span className="text-geek-deep">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full border-b border-mist bg-transparent py-2.5 text-ink outline-none transition focus:border-geek-cyan"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>;
}

export function SubmitRow({
  pending,
  sent,
  error,
}: {
  pending: boolean;
  sent: boolean;
  error?: string;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || sent}
          className="bg-ink px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-geek-cyan hover:text-ink disabled:opacity-60"
        >
          {sent ? "Sent — thank you" : pending ? "Sending…" : "Send to Geek"}
        </button>
        {sent && <span className="text-sm text-geek-deep">We&apos;ll be in touch.</span>}
      </div>
      {error && !sent && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
