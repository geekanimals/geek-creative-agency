"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Field,
  FormGrid,
  Honeypot,
  SelectField,
  SubmitRow,
  TextArea,
  submitForm,
} from "./fields";
import { track } from "@/lib/analytics";

// form kind → analytics event prefix (client form = "brand" per spec)
const EVENT_PREFIX: Record<string, string> = { client: "brand", creator: "creator", career: "career", vendor: "vendor" };

function useSubmit(kind: string) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const prefix = EVENT_PREFIX[kind] ?? kind;

  useEffect(() => {
    track(`${prefix}_form_open`, { form: kind });
  }, [kind, prefix]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(undefined);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await submitForm(kind, data);
    setPending(false);
    if (res.ok) {
      setSent(true);
      track(`${prefix}_form_submit`, { form: kind });
      if (kind === "creator") track("creator_signup", { form: kind });
    } else setError(res.error);
  }
  return { pending, sent, error, onSubmit };
}

export function ClientForm() {
  const { pending, sent, error, onSubmit } = useSubmit("client");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half />
        <Field label="Company" name="company" required half />
        <Field label="Designation" name="designation" half />
        <Field label="Email" name="email" type="email" required half />
        <Field label="Phone" name="phone" type="tel" half />
        <Field label="Approx budget" name="budget" half />
        <Field label="Timeline" name="timeline" half />
        <TextArea label="What are you trying to achieve?" name="goal" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}

export function CreatorForm() {
  const { pending, sent, error, onSubmit } = useSubmit("creator");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half />
        <Field label="Instagram handle" name="instagram" required half />
        <Field label="City" name="city" half />
        <SelectField
          label="Category"
          name="category"
          options={["Fashion", "Food", "Tech", "Lifestyle", "Comedy", "Beauty", "Travel", "Fitness", "Regional", "Other"]}
        />
        <Field label="Followers" name="followers" half />
        <Field label="Email" name="email" type="email" required half />
        <Field label="Phone" name="phone" type="tel" half />
        <TextArea label="Other social links" name="links" />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}

export function CareerForm() {
  const { pending, sent, error, onSubmit } = useSubmit("career");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half />
        <Field label="Email" name="email" type="email" required half />
        <Field label="Phone" name="phone" type="tel" half />
        <Field label="Role" name="role" required half />
        <Field label="LinkedIn" name="linkedin" half />
        <Field label="Resume / portfolio (URL)" name="portfolio" half />
        <TextArea label="Why Geek?" name="why" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}

export function VendorForm() {
  const { pending, sent, error, onSubmit } = useSubmit("vendor");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name / Company" name="company" required half />
        <Field label="Service" name="service" required half />
        <Field label="City" name="city" half />
        <Field label="Email" name="email" type="email" required half />
        <Field label="Phone" name="phone" type="tel" half />
        <Field label="Website / Portfolio" name="website" half />
        <TextArea label="About your work" name="about" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}
