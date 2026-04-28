const moneyFormatter = new Intl.NumberFormat("uz-UZ");

export function formatMoney(value: number) {
  const prefix = value < 0 ? "-" : "";
  return `${prefix}${moneyFormatter.format(Math.abs(value))} so'm`;
}

export function formatCompactMoney(value: number) {
  const abs = Math.abs(value);
  const prefix = value < 0 ? "-" : "";

  if (abs >= 1_000_000) {
    return `${prefix}${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)} mln`;
  }

  if (abs >= 1_000) {
    return `${prefix}${Math.round(abs / 1_000)}k`;
  }

  return `${prefix}${moneyFormatter.format(abs)}`;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
