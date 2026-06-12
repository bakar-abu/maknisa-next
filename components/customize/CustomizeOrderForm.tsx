"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  customizeBudgetField,
  customizeOrderContent,
  customizeOrderServices,
  customizeOrderShowrooms,
  emptyCustomizeOrderForm,
  emptyDetailsForService,
  getCustomizeFieldsForService,
  resolveCustomizeService,
  type CustomizeField,
  type CustomizeOrderFormData,
} from "@/lib/customize-order";

import "@/app/styles/customize-order.css";

function renderFieldInput(
  field: CustomizeField,
  value: string,
  onChange: (value: string) => void,
) {
  if (field.type === "select") {
    return (
      <select
        name={field.id}
        required={field.required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.options?.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.id}
        required={field.required}
        rows={4}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      name={field.id}
      required={field.required}
      placeholder={field.placeholder}
      value={value}
      min={field.type === "number" ? 1 : undefined}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function CustomizeOrderForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<CustomizeOrderFormData>(emptyCustomizeOrderForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = searchParams.get("service") ?? "";
    const category = searchParams.get("category") ?? "";
    const product = searchParams.get("product") ?? "";

    if (!service && !category && !product) return;

    setForm((current) => ({
      ...current,
      service: service || current.service,
      category: category || current.category,
      product: product || current.product,
      details: service ? emptyDetailsForService(service) : current.details,
    }));
  }, [searchParams]);

  const activeService = resolveCustomizeService(form.service);
  const serviceFields = useMemo(
    () => getCustomizeFieldsForService(form.service),
    [form.service],
  );

  function updateField<K extends keyof CustomizeOrderFormData>(
    key: K,
    value: CustomizeOrderFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateDetail(fieldId: string, value: string) {
    setForm((current) => ({
      ...current,
      details: { ...current.details, [fieldId]: value },
    }));
  }

  function handleServiceChange(serviceSlug: string) {
    setForm((current) => ({
      ...current,
      service: serviceSlug,
      details: emptyDetailsForService(serviceSlug),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/customize-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      setForm(emptyCustomizeOrderForm());
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mk-customize-form__success" role="status">
        <h2 className="mk-customize-form__success-title">
          {customizeOrderContent.successTitle}
        </h2>
        <p className="mk-customize-form__success-text">
          {customizeOrderContent.successMessage}
        </p>
        <button
          type="button"
          className="mk-customize-form__submit"
          onClick={() => setSubmitted(false)}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="mk-customize-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="mk-customize-form__section">
        <legend className="mk-customize-form__legend">Your details</legend>
        <div className="mk-customize-form__row">
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">First name *</span>
            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
          </label>
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Last name *</span>
            <input
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
          </label>
        </div>
        <div className="mk-customize-form__row">
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Email *</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Phone *</span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="mk-customize-form__section">
        <legend className="mk-customize-form__legend">Project</legend>
        <label className="mk-customize-form__field">
          <span className="mk-customize-form__label">Service *</span>
          <select
            name="service"
            required
            value={form.service}
            onChange={(event) => handleServiceChange(event.target.value)}
          >
            <option value="">Select a service</option>
            {customizeOrderServices.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.label}
              </option>
            ))}
          </select>
        </label>

        {activeService ? (
          <p className="mk-customize-form__service-note">{activeService.description}</p>
        ) : null}

        <div className="mk-customize-form__row">
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Preferred showroom *</span>
            <select
              name="showroom"
              required
              value={form.showroom}
              onChange={(event) => updateField("showroom", event.target.value)}
            >
              <option value="">Select a showroom</option>
              {customizeOrderShowrooms.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">
              {customizeBudgetField.label}
            </span>
            {renderFieldInput(
              customizeBudgetField,
              form.budgetRange,
              (value) => updateField("budgetRange", value),
            )}
          </label>
        </div>

        {form.category ? (
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Category</span>
            <input type="text" name="category" readOnly value={form.category} />
          </label>
        ) : null}

        {form.product ? (
          <label className="mk-customize-form__field">
            <span className="mk-customize-form__label">Product reference</span>
            <input type="text" name="product" readOnly value={form.product} />
          </label>
        ) : null}
      </fieldset>

      {serviceFields.length > 0 ? (
        <fieldset className="mk-customize-form__section">
          <legend className="mk-customize-form__legend">
            {activeService?.label} customization
          </legend>
          <div className="mk-customize-form__fields">
            {serviceFields.map((field) => (
              <label key={field.id} className="mk-customize-form__field">
                <span className="mk-customize-form__label">
                  {field.label}
                  {field.required ? " *" : ""}
                </span>
                {renderFieldInput(
                  field,
                  form.details[field.id] ?? "",
                  (value) => updateDetail(field.id, value),
                )}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <label className="mk-customize-form__field">
        <span className="mk-customize-form__label">Additional notes</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Share inspiration, measurements, finishes, or anything else we should know…"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      {error ? (
        <p className="mk-customize-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mk-customize-form__submit"
        disabled={submitting || !form.service}
      >
        {submitting ? "Sending…" : "Submit customization request"}
      </button>
    </form>
  );
}
