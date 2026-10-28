export function naira(value, { decimals = 0, signed = false } = {}) {
  const numeric = Number(value) || 0;
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Math.abs(numeric));
  const sign = numeric < 0 ? "−" : signed && numeric > 0 ? "+" : "";
  return `${sign}₦${formatted}`;
}

export function nairaCompact(value) {
  const numeric = Number(value) || 0;
  const abs = Math.abs(numeric);
  const sign = numeric < 0 ? "−" : "";
  if (abs >= 1_000_000_000) return `${sign}₦${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}₦${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}₦${Math.round(abs / 1_000)}k`;
  return `${sign}₦${new Intl.NumberFormat("en-NG").format(abs)}`;
}

export function number(value) {
  return new Intl.NumberFormat("en-NG").format(Number(value) || 0);
}

export function percent(value, digits = 0) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}

export function initials(name = "") {
  return name
    .replace(/^(Dr|Prof|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

const AVATAR_TONES = [
  { bg: "#eaf0ff", fg: "#2f55d4" },
  { bg: "#f1edff", fg: "#6a49dd" },
  { bg: "#e9f8f2", fg: "#177d60" },
  { bg: "#fff4df", fg: "#a76a08" },
  { bg: "#fdeeed", fg: "#b8413b" },
  { bg: "#e9f5fb", fg: "#2f6c8f" }
];

export function avatarTone(name = "") {
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_TONES[total % AVATAR_TONES.length];
}

export function toneForStatus(status = "") {
  const normalized = status.toLowerCase();
  if (
    ["active", "approved", "completed", "paid", "present"].includes(
      normalized
    )
  ) {
    return "success";
  }
  if (
    ["pending", "processing", "under review", "on hold", "waitlisted", "due"].includes(
      normalized
    )
  ) {
    return "warning";
  }
  if (["probation", "declined", "failed", "overdue", "absent"].includes(normalized)) {
    return "danger";
  }
  if (["draft", "inactive", "not started"].includes(normalized)) return "neutral";
  return "info";
}

export function uid(prefix = "ID") {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(",")
    )
    .join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function downloadText(filename, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}
