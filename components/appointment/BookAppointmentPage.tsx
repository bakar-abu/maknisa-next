import { BookAppointmentForm } from "@/components/appointment/BookAppointmentForm";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { appointmentContent } from "@/lib/appointment";
import { site } from "@/lib/site";

import "@/app/styles/book-appointment.css";

export function BookAppointmentPage() {
  return (
    <main id="main-content" role="main" className="mk-appointment-page">
      <div className="mk-appointment-page__container">
        <header className="mk-appointment-page__header">
          <MagazineBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: appointmentContent.title },
            ]}
          />
          <h1 className="mk-appointment-page__title">{appointmentContent.title}</h1>
          <p className="mk-appointment-page__intro">{appointmentContent.intro}</p>
        </header>

        <div className="mk-appointment-page__layout">
          <aside className="mk-appointment-page__aside">
            <h2 className="mk-appointment-page__aside-title">What to expect</h2>
            <ul className="mk-appointment-page__list">
              <li>One-to-one consultation with a {site.name} design specialist</li>
              <li>Guidance on materials, layouts, and collections for your space</li>
              <li>Showroom visit or follow-up tailored to your project</li>
            </ul>
          </aside>

          <div className="mk-appointment-page__form-wrap">
            <BookAppointmentForm />
          </div>
        </div>
      </div>
    </main>
  );
}
