"use client";

import { FormEvent, useState } from "react";
import {
  appointmentContent,
  appointmentServices,
  appointmentShowrooms,
  emptyAppointmentForm,
  type AppointmentFormData,
} from "@/lib/appointment";

import "@/app/styles/book-appointment.css";

export function BookAppointmentForm() {
  const [form, setForm] = useState<AppointmentFormData>(emptyAppointmentForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof AppointmentFormData>(
    key: K,
    value: AppointmentFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments", {
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
      setForm(emptyAppointmentForm());
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
        <h2 className="mk-appointment-form__success-title">
          {appointmentContent.successTitle}
        </h2>
        <p className="mk-appointment-form__success-text">
          {appointmentContent.successMessage}
        </p>
        <button
          type="button"
          className="mk-appointment-form__submit"
          onClick={() => setSubmitted(false)}
        >
          Book another appointment
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
          <span className="mk-appointment-form__label">Preferred showroom *</span>
          <select
            name="showroom"
            required
            value={form.showroom}
            onChange={(event) => updateField("showroom", event.target.value)}
          >
            <option value="">Select a showroom</option>
            {appointmentShowrooms.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mk-appointment-form__field">
          <span className="mk-appointment-form__label">Service of interest *</span>
          <select
            name="service"
            required
            value={form.service}
            onChange={(event) => updateField("service", event.target.value)}
          >
            <option value="">Select a service</option>
            {appointmentServices.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mk-appointment-form__field">
        <span className="mk-appointment-form__label">Preferred date</span>
        <input
          type="date"
          name="preferredDate"
          value={form.preferredDate}
          onChange={(event) => updateField("preferredDate", event.target.value)}
        />
      </label>

      <label className="mk-appointment-form__field">
        <span className="mk-appointment-form__label">Tell us about your project</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Room type, style preferences, timeline, or any questions…"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      {error ? (
        <p className="mk-appointment-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mk-appointment-form__submit"
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Book an appointment"}
      </button>
    </form>
  );
}
