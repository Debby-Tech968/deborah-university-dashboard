import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../context/AppContext";
import { avatarTone, classNames, initials, toneForStatus } from "../lib/format";
import { Icon } from "./Icon";

export function Crest({ size = "md", light = false }) {
  return (
    <span className={classNames("crest", `crest--${size}`, light && "crest--light")}>
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 2.6 28 7v9.3c0 7-4.9 11.7-12 14.1C8.9 28 4 23.3 4 16.3V7l12-4.4Z"
          fill="#F2B544"
        />
        <path
          d="M16 9.2v11.4M11 12.1v6.8M21 12.1v6.8"
          stroke="#0B1428"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Brand({ compact = false, dark = true }) {
  return (
    <div className={classNames("brand", compact && "brand--compact", !dark && "brand--dark-text")}>
      <Crest size="sm" />
      <span className="brand-text">
        <strong>Deborah</strong>
        <small>University</small>
      </span>
    </div>
  );
}

export function Avatar({ name, size = "", className = "" }) {
  const tone = avatarTone(name);
  return (
    <span
      className={classNames("avatar", size && `avatar--${size}`, className)}
      style={{ background: tone.bg, color: tone.fg }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function Badge({ children, tone, dot = true, className = "" }) {
  const resolvedTone = tone || toneForStatus(String(children));
  return (
    <span className={classNames("badge", `badge--${resolvedTone}`, className)}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  return <Badge tone={toneForStatus(status)}>{status}</Badge>;
}

export function Panel({ children, className = "", flush = false, ...rest }) {
  return (
    <article className={classNames("panel", flush && "panel--flush", className)} {...rest}>
      {children}
    </article>
  );
}

export function PanelHead({ title, subtitle, actions, plain = false, className = "" }) {
  return (
    <div className={classNames("panel-head", plain && "panel-head--plain", className)}>
      <div className="panel-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function PanelLink({ children, onClick, href, className = "", type = "button" }) {
  if (href) {
    return (
      <a className={classNames("panel-link", className)} href={href}>
        {children} <Icon name="arrow-right" />
      </a>
    );
  }
  return (
    <button className={classNames("panel-link", className)} type={type} onClick={onClick}>
      {children} <Icon name="arrow-right" />
    </button>
  );
}

export function MiniStat({ icon, tone = "", value, label }) {
  return (
    <div className="mini-stat">
      <span className={classNames("stat-icon", tone && `stat-icon--${tone}`)}>
        <Icon name={icon} />
      </span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

export function Sparkline({ points = [], tone = "" }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const coords = points
    .map((value, index) => {
      const x = 3 + (index / Math.max(1, points.length - 1)) * 74;
      const y = 25 - ((value - min) / span) * 20;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className={classNames("spark", tone && `spark--${tone}`)}
      viewBox="0 0 80 28"
      aria-hidden="true"
    >
      <polyline points={coords} />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  icon,
  tone = "",
  delta,
  deltaTone = "up",
  note,
  spark
}) {
  return (
    <article className="kpi">
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        <span className={classNames("stat-icon", tone && `stat-icon--${tone}`)}>
          <Icon name={icon} />
        </span>
      </div>
      <div className="kpi-body">
        <strong className="kpi-value">{value}</strong>
        {spark && <Sparkline points={spark} tone={tone === "mint" ? "mint" : tone} />}
      </div>
      <p className="kpi-meta">
        {delta && (
          <span className={classNames("delta", `is-${deltaTone}`)}>
            {deltaTone === "up" && <Icon name="trending-up" />}
            {delta}
          </span>
        )}{" "}
        {note}
      </p>
    </article>
  );
}

export function Meter({ value, tone = "", label }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className={classNames("meter", tone && `meter--${tone}`)}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <span style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Donut({ segments, centerValue, centerLabel }) {
  let running = 0;
  const stops = segments.map((segment) => {
    const start = running;
    running += segment.value;
    return `${segment.color} ${start}% ${running}%`;
  });
  const label = segments.map((segment) => `${segment.label} ${segment.value}%`).join(", ");
  return (
    <div className="donut" style={{ background: `conic-gradient(${stops.join(", ")})` }} role="img" aria-label={label}>
      <div className="donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
    </div>
  );
}

export function BarChart({ items, maxValue, tone = "", valueFormatter = (value) => value }) {
  const max = maxValue || Math.max(...items.map((item) => item.value));
  return (
    <div className={classNames("bars-chart", tone && `bars-chart--${tone}`)}>
      {items.map((item) => {
        const height = Math.max(8, (item.value / max) * 100);
        return (
          <div className="bar-col" key={item.label}>
            <span className="bar-value">{valueFormatter(item.value)}</span>
            <div className="bar-track">
              <span className="bar-fill" style={{ height: `${height}%` }} />
            </div>
            <span className="bar-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon = "search", title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, index) => index + 1);
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-btn"
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" />
      </button>
      {numbers.map((number) => (
        <button
          key={number}
          className={classNames("page-btn", number === page && "is-active")}
          type="button"
          onClick={() => onChange(number)}
          aria-label={`Page ${number}`}
          aria-current={number === page ? "page" : undefined}
        >
          {number}
        </button>
      ))}
      <button
        className="page-btn"
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
}

export function Modal({ open, onClose, title, subtitle, children, wide = false, footer }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal is-open">
      <div className="modal-backdrop" onClick={onClose} />
      <div
        className={classNames("modal-card", wide && "modal-card--wide")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({ open, onClose, title, children, footer }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="drawer-head">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close panel">
            <Icon name="x" />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </>,
    document.body
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div className={classNames("toast", `toast--${toast.tone}`)} key={toast.id} role="status">
          <span className="toast-icon">
            <Icon
              name={
                toast.tone === "success"
                  ? "check-circle"
                  : toast.tone === "danger"
                    ? "alert-circle"
                    : "info"
              }
            />
          </span>
          <p>{toast.message}</p>
          <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
            <Icon name="x" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Field({ label, htmlFor, error, required, children, className = "" }) {
  return (
    <div className={classNames("field", error && "has-error", className)}>
      <label htmlFor={htmlFor}>
        {label} {required && <span>*</span>}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
