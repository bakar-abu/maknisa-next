import Link from "next/link";

type GrowButtonProps = {
  href: string;
  label: string;
  className?: string;
  id?: string;
  ariaLabelledBy?: string;
};

export function GrowButton({
  href,
  label,
  className = "sn_btn_grow",
  id,
  ariaLabelledBy,
}: GrowButtonProps) {
  return (
    <Link
      href={href}
      className={className}
      title={label}
      id={id}
      aria-labelledby={ariaLabelledBy}
    >
      <span className="tx">{label}</span>
      <span className="sq" aria-hidden="true" data-title={label} />
    </Link>
  );
}
