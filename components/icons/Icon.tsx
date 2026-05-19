type IconProps = {
  id: string;
  className?: string;
  viewBox?: string;
};

export function Icon({ id, className = "", viewBox = "0 0 80 80" }: IconProps) {
  return (
    <i className={`sn_sprite ${className}`.trim()} aria-hidden>
      <svg viewBox={viewBox}>
        <use xlinkHref={`#${id}`} />
      </svg>
    </i>
  );
}
