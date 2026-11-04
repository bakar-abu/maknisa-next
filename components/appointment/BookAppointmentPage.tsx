import { BookAppointmentForm } from "@/components/appointment/BookAppointmentForm";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { appointmentContent } from "@/lib/appointment";
import type { AppointmentPageContent } from "@/lib/cms/support-page";

import "@/app/styles/book-appointment.css";

type BookAppointmentPageProps = {
  content?: AppointmentPageContent;
};

export function BookAppointmentPage({ content }: BookAppointmentPageProps = {}) {
  const pageContent = content ?? {
    title: appointmentContent.title,
    intro: appointmentContent.intro,
    asideTitle: "What to expect",
    asideItems: [
      "One-to-one consultation with a Maknisa design specialist",
      "Guidance on materials, layouts, and collections for your space",
      "Showroom visit or follow-up tailored to your project",
    ],
    successTitle: appointmentContent.successTitle,
    successMessage: appointmentContent.successMessage,
  };

  return (
    <main id="main-content" role="main" className="mk-appointment-page">
      <div className="mk-appointment-page__container">
        <header className="mk-appointment-page__header">
          <MagazineBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: pageContent.title },
            ]}
          />
          <h1 className="mk-appointment-page__title">{pageContent.title}</h1>
          <p className="mk-appointment-page__intro">{pageContent.intro}</p>
        </header>

        <div className="mk-appointment-page__layout">
          <aside className="mk-appointment-page__aside">
            <h2 className="mk-appointment-page__aside-title">{pageContent.asideTitle}</h2>
            <ul className="mk-appointment-page__list">
              {pageContent.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>

          <div className="mk-appointment-page__form-wrap">
            <BookAppointmentForm
              successTitle={pageContent.successTitle}
              successMessage={pageContent.successMessage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
