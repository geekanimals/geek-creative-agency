"use client";

import { useState } from "react";

/** Resume / file upload limits — mirrored on the server in app/(frontend)/api/lead/route.ts. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const UPLOAD_ACCEPT = ".pdf,.doc,.docx";

/**
 * Posts the lead to /api/lead (emailed to the Geek inbox over SMTP, see
 * app/(frontend)/api/lead/route.ts). A form with a file (the career resume) is
 * sent as multipart form data; every other form as JSON.
 */
export async function submitForm(kind, form) {
  const fd = new FormData(form);
  const hasFile = [...fd.values()].some((v) => v instanceof File && v.size > 0);
  try {
    let res;
    if (hasFile) {
      fd.set("_form", kind);
      res = await fetch("/api/lead", { method: "POST", body: fd });
    } else {
      const data = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string"));
      res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _form: kind, ...data }),
      });
    }
    const json = await res.json().catch(() => ({}));
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
    <div aria-hidden className="field-honeypot" tabIndex={-1}>
      <style href="field" precedence="default">
        {styles}
      </style>
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Field({ label, name, type = "text", required, placeholder, half, autoComplete }) {
  return (
    <label className={`field ${half ? "field--half" : "field--full"}`}>
      <style href="field" precedence="default">
        {styles}
      </style>
      <span className="field__label">
        {label} {required && <span className="field__req">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field__control"
      />
    </label>
  );
}

export function TextArea({ label, name, required, placeholder }) {
  return (
    <label className="field field--full">
      <style href="field" precedence="default">
        {styles}
      </style>
      <span className="field__label">
        {label} {required && <span className="field__req">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={3}
        className="field__control field__control--textarea"
      />
    </label>
  );
}

export function SelectField({ label, name, options, required, full }) {
  return (
    <label className={`field ${full ? "field--full" : "field--half"}`}>
      <style href="field" precedence="default">
        {styles}
      </style>
      <span className="field__label">
        {label} {required && <span className="field__req">*</span>}
      </span>
      <select name={name} required={required} defaultValue="" className="field__control">
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

/**
 * File upload (e.g. resume). Shows the chosen file name; checks type and size
 * in the browser (the server checks again).
 */
export function FileField({ label, name, required, accept = UPLOAD_ACCEPT, hint }) {
  const [fileName, setFileName] = useState("");
  const [problem, setProblem] = useState("");

  function onChange(e) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    setProblem("");
    if (!file) {
      setFileName("");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = accept.split(",").map((a) => a.replace(".", "").trim());
    if (!allowed.includes(ext)) {
      input.value = "";
      setFileName("");
      setProblem(`Please upload a ${allowed.join(", ").toUpperCase()} file.`);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      input.value = "";
      setFileName("");
      setProblem("File is too large — maximum 5 MB.");
      return;
    }
    setFileName(file.name);
  }

  return (
    <div className="field field--full">
      <style href="field" precedence="default">
        {styles}
      </style>
      <span className="field__label">
        {label} {required && <span className="field__req">*</span>}
      </span>
      <label className="field-file">
        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={onChange}
          className="field-file__input"
        />
        <span className="field-file__button">Choose file</span>
        <span className={`field-file__name ${fileName ? "field-file__name--set" : ""}`}>
          {fileName || "No file chosen"}
        </span>
      </label>
      <span className="field-file__hint">{hint ?? "PDF, DOC or DOCX · max 5 MB"}</span>
      {problem && (
        <span role="alert" className="field-file__error">
          {problem}
        </span>
      )}
    </div>
  );
}

export function FormGrid({ children }) {
  return (
    <div className="field-grid">
      <style href="field" precedence="default">
        {styles}
      </style>
      {children}
    </div>
  );
}

export function SubmitRow({ pending, sent, error }) {
  return (
    <div className="field-submit">
      <style href="field" precedence="default">
        {styles}
      </style>
      <div className="field-submit__row">
        <button type="submit" disabled={pending || sent} className="field-submit__button">
          {sent ? "Sent — thank you" : pending ? "Sending…" : "Send to Geek"}
        </button>
        {sent && <span className="field-submit__sent">We&apos;ll be in touch.</span>}
      </div>
      {error && !sent && (
        <p role="alert" className="field-submit__error">
          {error}
        </p>
      )}
    </div>
  );
}

const styles = `
.field-honeypot {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 0px;
  height: 0px;
  overflow: hidden;
}

.field {
  display: block;
}

.field__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.field__req {
  color: #137c93;
}

.field__control {
  width: 100%;
  border-bottom: 1px solid #eceeeb;
  background-color: transparent;
  padding-block: 0.625rem;
  color: #0c0d0c;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.field__control:focus {
  border-color: #32c1df;
}

.field__control--textarea {
  resize: none;
}

.field-file {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px dashed #d9dcd8;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition-property: border-color, background-color;
  transition-duration: 150ms;
}

.field-file:hover,
.field-file:focus-within {
  border-color: #32c1df;
  background-color: #f5fbfc;
}

.field-file__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.field-file__button {
  flex-shrink: 0;
  background-color: #0c0d0c;
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
}

.field-file__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #9aa09c;
}

.field-file__name--set {
  color: #0c0d0c;
}

.field-file__hint {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #9aa09c;
}

.field-file__error {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #dc2626;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 1.25rem;
  row-gap: 1rem;
}

.field-submit {
  margin-top: 2rem;
}

.field-submit__row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.field-submit__button {
  background-color: #0c0d0c;
  padding: 0.875rem 1.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.field-submit__button:hover {
  background-color: #32c1df;
  color: #0c0d0c;
}

.field-submit__button:disabled {
  cursor: default;
  opacity: 0.6;
}

.field-submit__sent {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #137c93;
}

.field-submit__error {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #dc2626;
}

@media (min-width: 640px) {
  .field--half {
    grid-column: span 1 / span 1;
  }

  .field--full {
    grid-column: span 2 / span 2;
  }

  .field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
