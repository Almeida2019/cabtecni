"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "../i18n/en";

const ENQUIRY_INBOX = "sales@cabtecni.com";

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  requirement: string;
  destination: string;
  neededBy: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;
type Copy = Dictionary["form"];

function validate(values: Fields, copy: Copy): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = copy.errors.name;
  if (!values.email.trim()) errors.email = copy.errors.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = copy.errors.emailInvalid;
  if (!values.message.trim()) errors.message = copy.errors.messageRequired;
  else if (values.message.trim().length < 20) errors.message = copy.errors.messageShort;
  return errors;
}

function composeEmail(values: Fields, copy: Copy) {
  const subject = `${copy.submit}: ${values.requirement}${values.company ? ` (${values.company})` : ""}`;
  const body = [
    `${copy.name}: ${values.name}`,
    values.company && `${copy.company}: ${values.company}`,
    `${copy.email}: ${values.email}`,
    values.phone && `${copy.phone}: ${values.phone}`,
    `${copy.requirement} ${values.requirement}`,
    values.destination && `${copy.destination}: ${values.destination}`,
    values.neededBy && `${copy.neededBy}: ${values.neededBy}`,
    "",
    values.message,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${ENQUIRY_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EnquiryForm({ copy }: { copy: Copy }) {
  const EMPTY: Fields = {
    name: "", company: "", email: "", phone: "",
    requirement: copy.requirementTypes[0],
    destination: "", neededBy: "", message: "",
  };

  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [rejectedAt, setRejectedAt] = useState(0);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Focus after the render that unhides the summary; a hidden element cannot
  // take focus, so doing this inside the submit handler silently does nothing.
  useEffect(() => {
    if (rejectedAt > 0) summaryRef.current?.focus();
  }, [rejectedAt]);

  const update = (field: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values, copy);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setRejectedAt((count) => count + 1);
      return;
    }

    // The site ships without a mail backend, so the enquiry is handed to the
    // visitor's own mail client fully composed. To send server-side instead,
    // POST `values` to your endpoint here and keep the same success state.
    window.location.href = composeEmail(values, copy);
    setSubmitted(true);
  };

  const errorList = (Object.keys(errors) as (keyof Fields)[]).filter((key) => errors[key]);
  const summaryTitle = errorList.length === 1
    ? copy.checkFieldsOne
    : copy.checkFieldsMany.replace("{n}", String(errorList.length));

  return (
    <form className="enquiry-form" onSubmit={onSubmit} noValidate>
      <div className="form-summary" ref={summaryRef} tabIndex={-1} role="alert" hidden={errorList.length === 0}>
        <strong>{summaryTitle}</strong>
        <ul>
          {errorList.map((key) => (
            <li key={key}><a href={`#field-${key}`}>{errors[key]}</a></li>
          ))}
        </ul>
      </div>

      {submitted && errorList.length === 0 ? (
        <p className="form-success" role="status">
          {copy.successMessage.split("{email}")[0]}
          <a href={`mailto:${ENQUIRY_INBOX}`}>{ENQUIRY_INBOX}</a>
          {copy.successMessage.split("{email}")[1]}
        </p>
      ) : null}

      <div className="form-row">
        <Field id="name" label={copy.name} required error={errors.name} optionalLabel={copy.optional}>
          <input id="field-name" name="name" type="text" autoComplete="name" value={values.name} onChange={update("name")} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "error-name" : undefined} />
        </Field>
        <Field id="company" label={copy.company} error={errors.company} optionalLabel={copy.optional}>
          <input id="field-company" name="company" type="text" autoComplete="organization" value={values.company} onChange={update("company")} />
        </Field>
      </div>

      <div className="form-row">
        <Field id="email" label={copy.email} required error={errors.email} optionalLabel={copy.optional}>
          <input id="field-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update("email")} aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-email" : undefined} />
        </Field>
        <Field id="phone" label={copy.phone} error={errors.phone} optionalLabel={copy.optional}>
          <input id="field-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update("phone")} />
        </Field>
      </div>

      <div className="form-row">
        <Field id="requirement" label={copy.requirement} error={errors.requirement} optionalLabel={copy.optional}>
          <select id="field-requirement" name="requirement" value={values.requirement} onChange={update("requirement")}>
            {copy.requirementTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </Field>
        <Field id="destination" label={copy.destination} error={errors.destination} optionalLabel={copy.optional}>
          <input id="field-destination" name="destination" type="text" placeholder={copy.destinationPlaceholder} value={values.destination} onChange={update("destination")} />
        </Field>
      </div>

      <Field id="neededBy" label={copy.neededBy} error={errors.neededBy} optionalLabel={copy.optional}>
        <input id="field-neededBy" name="neededBy" type="date" value={values.neededBy} onChange={update("neededBy")} />
      </Field>

      <Field id="message" label={copy.message} required error={errors.message} hint={copy.messageHint} optionalLabel={copy.optional}>
        <textarea id="field-message" name="message" rows={6} value={values.message} onChange={update("message")} aria-required="true" aria-invalid={!!errors.message} aria-describedby={`hint-message${errors.message ? " error-message" : ""}`} />
      </Field>

      <button className="form-submit" type="submit">
        {copy.submit} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note">{copy.note.replace("{email}", ENQUIRY_INBOX)}</p>
    </form>
  );
}

function Field({
  id, label, required, error, hint, optionalLabel, children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  optionalLabel: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`form-field${error ? " has-error" : ""}`}>
      <label htmlFor={`field-${id}`}>
        {label}
        {required ? <em aria-hidden="true"> *</em> : <span> {optionalLabel}</span>}
      </label>
      {hint ? <span className="form-hint" id={`hint-${id}`}>{hint}</span> : null}
      {children}
      {error ? <span className="form-error" id={`error-${id}`}>{error}</span> : null}
    </p>
  );
}
