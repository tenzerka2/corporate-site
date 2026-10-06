// Order form rules. Nothing leaves the browser in the demo.

/** Ten national digits of a Russian phone number, typed with or without +7 / 8. */
export function phoneDigits(value: string) {
  const trimmed = value.trim();
  let digits = trimmed.startsWith("+7") ? trimmed.slice(2).replace(/\D/g, "") : trimmed.replace(/\D/g, "");
  if (!trimmed.startsWith("+7") && /^[78]/.test(digits) && digits.length !== 10) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** +7 (900) 123-45-67, built while the user types. */
export function formatPhone(value: string) {
  const d = phoneDigits(value);
  if (!d) return "";
  let out = `+7 (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ")";
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export type OrderFields = { name: string; phone: string; consent: boolean };
export type OrderErrors = Partial<Record<keyof OrderFields, true>>;

export function validateOrder(fields: OrderFields): OrderErrors {
  const errors: OrderErrors = {};
  if (fields.name.trim().length < 2) errors.name = true;
  if (phoneDigits(fields.phone).length !== 10) errors.phone = true;
  if (!fields.consent) errors.consent = true;
  return errors;
}

/** ОН-261006-4821: date and four digits. */
export function orderNumber(date = new Date(), random = Math.random()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `ОН-${String(date.getFullYear()).slice(2)}${p(date.getMonth() + 1)}${p(date.getDate())}-${1000 + Math.floor(random * 9000)}`;
}
