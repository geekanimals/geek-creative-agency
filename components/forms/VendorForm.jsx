"use client";

import { Field, FormGrid, Honeypot, SubmitRow, TextArea } from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/useLeadForm";

/** Work with Geek — for vendors and partners. */
export default function VendorForm() {
  const { pending, sent, error, onSubmit } = useLeadForm("vendor");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half autoComplete="name" />
        <Field label="Company" name="company" required half autoComplete="organization" />
        <Field label="Email" name="email" type="email" required half autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required half autoComplete="tel" />
        <Field
          label="Service / Category"
          name="service"
          required
          half
          placeholder="e.g. Production, Printing"
        />
        <Field label="City" name="city" required half autoComplete="address-level2" />
        <Field label="Website / Portfolio" name="website" half placeholder="https://" />
        <TextArea label="About your work" name="about" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}
