import { site } from "@/lib/site";
import { FloatingCartWidget } from "@/components/cart/FloatingCartWidget";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M8.7 4.4a1.8 1.8 0 0 0-2.4-.3L4.5 5.6a2.4 2.4 0 0 0-.8 2.2c.5 5.2 7.3 12 12.5 12.5a2.4 2.4 0 0 0 2.2-.8l1.5-1.8a1.8 1.8 0 0 0-.3-2.4l-2.5-2a1.8 1.8 0 0 0-2.3.1l-1 1a.7.7 0 0 1-.7.2 8.8 8.8 0 0 1-3.7-3.7.7.7 0 0 1 .2-.7l1-1a1.8 1.8 0 0 0 .1-2.3l-2-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M19.1 4.9A10 10 0 0 0 4.2 17.6L3 21l3.6-1.1A10 10 0 1 0 19.1 4.9Zm-7.1 15a8.3 8.3 0 0 1-4.2-1.1l-.3-.2-2.1.7.7-2-.2-.3a8.3 8.3 0 1 1 6.1 2.9Zm4.6-6.2c-.2-.1-1.1-.5-1.2-.5-.2-.1-.3-.1-.4.1-.1.2-.5.5-.6.7-.1.1-.2.1-.4 0a6.8 6.8 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.2-.2 0-.3.1-.4l.3-.3.2-.3a.4.4 0 0 0 0-.4c0-.1-.4-1.1-.6-1.5-.2-.3-.3-.3-.4-.3h-.4a.8.8 0 0 0-.6.3c-.2.2-.8.7-.8 1.8s.8 2.1.9 2.3a9 9 0 0 0 3.4 3.4c2 .8 2 .5 2.4.5.4-.1 1.1-.5 1.2-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FloatingContactWidget() {
  const whatsappNumber = site.phoneTel.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="mk-floating-contact" aria-label="Quick contact actions">
      <FloatingCartWidget />
      <a
        href={`tel:${site.phoneTel}`}
        className="mk-floating-contact__btn mk-floating-contact__btn--call"
        aria-label={`Call ${site.name}`}
        title={`Call ${site.name}`}
      >
        <PhoneIcon />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mk-floating-contact__btn mk-floating-contact__btn--whatsapp"
        aria-label={`Chat on WhatsApp with ${site.name}`}
        title={`Chat on WhatsApp with ${site.name}`}
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
