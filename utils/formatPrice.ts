export function formatPrice(priceCents: number, currency = "ALL"): string {
  const safePrice = Number.isFinite(priceCents) ? priceCents : 0;
  const amount = safePrice / 100;

  try {
    return new Intl.NumberFormat("sq-AL", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount)} ${currency}`;
  }
}