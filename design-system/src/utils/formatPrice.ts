export function formatPrice(n: number): string {
  if (n <= 0) return "0 ₽";
  return `${n.toLocaleString("ru-RU").replace(/,/g, " ")} ₽`;
}
