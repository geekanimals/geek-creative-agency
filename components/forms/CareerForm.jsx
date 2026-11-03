"use client";

import {
  Field,
  FileField,
  FormGrid,
  Honeypot,
  SelectField,
  SubmitRow,
} from "@/components/forms/fields";
import { useLeadForm } from "@/components/forms/useLeadForm";

const EXPERIENCE = ["Fresher", "0–1 years", "1–3 years", "3–5 years", "5–8 years", "8+ years"];
const NOTICE = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days"];

/** Work at Geek — job application with resume upload (emailed as an attachment). */
export default function CareerForm() {
  const { pending, sent, error, onSubmit } = useLeadForm("career");
  return (
    <form onSubmit={onSubmit}>
      <Honeypot />
      <FormGrid>
        <Field label="Name" name="name" required half autoComplete="name" />
        <Field label="Email" name="email" type="email" required half autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required half autoComplete="tel" />
        <Field
          label="Position"
          name="position"
          required
          half
          placeholder="Role you're applying for"
        />
        <Field label="Current CTC" name="current_ctc" required half placeholder="e.g. 6 LPA" />
        <Field label="Expected CTC" name="expected_ctc" required half placeholder="e.g. 8 LPA" />
        <SelectField label="Experience" name="experience" required options={EXPERIENCE} />
        <SelectField label="Notice period" name="notice_period" required options={NOTICE} />
        <Field label="Location" name="location" required half autoComplete="address-level2" />
        <Field label="LinkedIn / Portfolio" name="portfolio" half placeholder="https://" />
        <FileField label="Upload resume" name="resume" required />
      </FormGrid>
      <SubmitRow pending={pending} sent={sent} error={error} />
    </form>
  );
}
