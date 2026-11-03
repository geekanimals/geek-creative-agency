"use client";

import {
  Field,
  FormGrid,
  Honeypot,
  SelectField,
  SubmitRow,
  TextArea,
} from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/useLeadForm";

const CATEGORIES = [
  "Fashion",
  "Food",
  "Tech",
  "Lifestyle",
  "Comedy",
  "Beauty",
  "Travel",
  "Fitness",
  "Regional",
  "Other",
];

/** Work with brands — for creators. */
export default function CreatorForm() {
  const { pending, sent, error, onSubmit } = useLeadForm("creator");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half autoComplete="name" />
        <Field label="Instagram handle" name="instagram" required half placeholder="@yourhandle" />
        <Field label="Email" name="email" type="email" required half autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required half autoComplete="tel" />
        <Field label="City" name="city" required half autoComplete="address-level2" />
        <SelectField label="Category" name="category" required options={CATEGORIES} />
        <Field label="Followers" name="followers" required half placeholder="e.g. 25K" />
        <TextArea label="Other social links" name="links" placeholder="YouTube, Moj, LinkedIn…" />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}
