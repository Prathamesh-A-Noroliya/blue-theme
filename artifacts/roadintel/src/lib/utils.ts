import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function safeFilter<T>(
  value: unknown,
  predicate: (item: T, index: number, array: T[]) => boolean,
): T[] {
  return safeArray<T>(value).filter(predicate);
}

export function safeMap<T, R>(
  value: unknown,
  mapper: (item: T, index: number, array: T[]) => R,
): R[] {
  return safeArray<T>(value).map(mapper);
}

export function safeLocalStorageArray<T = unknown>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function getRiskColor(level?: string | null) {
  switch (String(level || "").toLowerCase()) {
    case "critical":
      return "#DC2626";
    case "high":
      return "#F59E0B";
    case "medium":
      return "#0EA5A4";
    case "low":
      return "#16A34A";
    default:
      return "#64748B";
  }
}

export function getHealthColor(score?: number | null) {
  const safeScore = Number(score ?? 0);

  if (safeScore >= 80) return "#16A34A";
  if (safeScore >= 60) return "#0EA5A4";
  if (safeScore >= 40) return "#F59E0B";
  return "#DC2626";
}

export function formatCurrency(value?: number | null) {
  const safeValue = Number(value ?? 0);

  if (!Number.isFinite(safeValue)) return "₹0";
  if (safeValue >= 10000000) return `₹${(safeValue / 10000000).toFixed(1)}Cr`;
  if (safeValue >= 100000) return `₹${(safeValue / 100000).toFixed(1)}L`;

  return `₹${safeValue.toLocaleString("en-IN")}`;
}

export function formatDate(date?: string | Date | null) {
  if (!date) return "N/A";

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}