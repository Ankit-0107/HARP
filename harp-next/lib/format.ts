export function formatDate(iso: string | null): string {
  if (!iso) return "[TBD] date";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
