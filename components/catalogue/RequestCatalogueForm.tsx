"use client";

import { FormEvent, useState } from "react";
import {
  catalogueRequestContent,
  catalogueRequestShowrooms,
  catalogueTypeOptions,
  emptyCatalogueRequestForm,
  type CatalogueRequestFormData,
} from "@/lib/request-catalogue";

import "@/app/styles/book-appointment.css";

type RequestCatalogueFormProps = {
  successTitle?: string;
  successMessage?: string;
};

export function RequestCatalogueForm({
  successTitle = catalogueRequestContent.successTitle,
  successMessage = catalogueRequestContent.successMessage,
}: RequestCatalogueFormProps = {}) {
  const [form, setForm] = useState<CatalogueRequestFormData>(emptyCatalogueRequestForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CatalogueRequestFormData>(
    key: K,
    value: CatalogueRequestFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/request-catalogue", {
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
      setForm(emptyCatalogueRequestForm());
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
      <div className="mk-appointment-form__success" role="status">
        <h2 className="mk-appointment-form__success-title">{successTitle}</h2>
        <p className="mk-appointment-form__success-text">{successMessage}</p>
        <button
          type="button"
          className="mk-appointment-form__submit"
          onClick={() => setSubmitted(false)}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="mk-appointment-form" onSubmit={handleSubmit} noValidate>
      <div className="mk-appointment-form__row">
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">First name *</span>
          <input
            type="text"
            name="firstName"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </label>
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Last name *</span>
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

      <div className="mk-appointment-form__row">
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Email *</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Phone *</span>
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

      <div className="mk-appointment-form__row">
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Catalogue type *</span>
          <select
            name="catalogueType"
            required
            value={form.catalogueType}
            onChange={(event) => updateField("catalogueType", event.target.value)}
          >
            {catalogueTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Preferred showroom</span>
          <select
            name="showroom"
            value={form.showroom}
            onChange={(event) => updateField("showroom", event.target.value)}
          >
            <option value="">Select a showroom (optional)</option>
            {catalogueRequestShowrooms.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mk-appointment-form__field">
        <span className="mk-appointment-form__label">Delivery address</span>
        <textarea
          name="deliveryAddress"
          rows={3}
          placeholder="For printed catalogues — city, area, and full address"
          value={form.deliveryAddress}
          onChange={(event) => updateField("deliveryAddress", event.target.value)}
        />
      </label>

      <label className="mk-appointment-form__field">
        <span className="mk-appointment-form__label">Additional notes</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us which collections interest you or how you plan to use the catalogue…"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      {error ? (
        <p className="mk-appointment-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="mk-appointment-form__submit" disabled={submitting}>
        {submitting ? "Sending…" : "Request catalogue"}
      </button>
    </form>
  );
}
