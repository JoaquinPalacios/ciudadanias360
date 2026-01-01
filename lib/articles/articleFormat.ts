export type EsArDateStyle = NonNullable<
  Intl.DateTimeFormatOptions["dateStyle"]
>;

export function formatEsArDate(value: string, dateStyle: EsArDateStyle) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { dateStyle }).format(d);
}
