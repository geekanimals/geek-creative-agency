"use client";

import { Field, FormGrid, Honeypot, SubmitRow, TextArea } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/useLeadForm";

/** Build my brand — for clients. */
export default function ClientForm() {
  const { pending, sent, error, onSubmit } = useLeadForm("client");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half autoComplete="name" />
        <Field label="Company" name="company" required half autoComplete="organization" />
        <Field label="Designation" name="designation" half autoComplete="organization-title" />
        <Field label="Email" name="email" type="email" required half autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required half autoComplete="tel" />
        <Field label="Approx budget" name="budget" half />
        <Field label="Timeline" name="timeline" half />
        <TextArea label="What are you trying to achieve?" name="goal" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}
