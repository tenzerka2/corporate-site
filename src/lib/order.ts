// Order form rules. The demo site keeps submitted data in the browser only.

export type OrderFields = {
  name: string;
  phone: string;
  company: string;
  inn: string;
  comment: string;
  consent: boolean;
};

export type OrderErrors = Partial<
  Record<"name" | "phone" | "inn" | "consent", string>
>;

export const orderMessages = {
  name: "Укажите имя",
  phone: "Укажите номер полностью: 10 цифр после +7",
  inn: "ИНН состоит из 10 цифр для компании или 12 для ИП",
  innChecksum: "Проверьте ИНН: контрольная цифра не сходится",
  consent: "Нужно согласие на обработку данных",
};

/** Keeps the ten national digits of a Russian number. */
export function phoneDigits(value: string) {
  const trimmed = value.trim();
  let digits = trimmed.startsWith("+7")
    ? trimmed.slice(2).replace(/\D/g, "")
    : trimmed.replace(/\D/g, "");
  // Typed or pasted with the trunk prefix: 8 900… or 7 900….
  if (!trimmed.startsWith("+7") && /^[78]/.test(digits) && digits.length !== 10)
    digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Formats input as +7 (999) 123-45-67 while the user types. */
export function formatPhone(value: string) {
  const digits = phoneDigits(value);
  if (digits.length === 0) return "";
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ];
  let result = `+7 (${parts[0]}`;
  if (digits.length >= 3) result += ")";
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}

function innControl(digits: number[], weights: number[]) {
  const sum = weights.reduce((total, weight, i) => total + weight * digits[i], 0);
  return (sum % 11) % 10;
}

/** Checks length and control digits of a Russian taxpayer number. */
export function isValidInn(value: string) {
  if (!/^\d{10}$|^\d{12}$/.test(value)) return false;
  const digits = [...value].map(Number);
  if (digits.length === 10)
    return innControl(digits, [2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[9];
  const first = innControl(digits, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
  const second = innControl(digits, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
  return first === digits[10] && second === digits[11];
}

export function validateOrder(fields: OrderFields): OrderErrors {
  const errors: OrderErrors = {};
  if (fields.name.trim().length < 2) errors.name = orderMessages.name;
  if (phoneDigits(fields.phone).length !== 10)
    errors.phone = orderMessages.phone;
  const inn = fields.inn.replace(/\s/g, "");
  if (inn) {
    if (!/^\d{10}$|^\d{12}$/.test(inn)) errors.inn = orderMessages.inn;
    else if (!isValidInn(inn)) errors.inn = orderMessages.innChecksum;
  }
  if (!fields.consent) errors.consent = orderMessages.consent;
  return errors;
}

/** Order number like ОН-251005-4821: date and four random digits. */
export function createOrderNumber(date = new Date(), random = Math.random()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${String(date.getFullYear()).slice(2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const suffix = String(1000 + Math.floor(random * 9000));
  return `ОН-${stamp}-${suffix}`;
}
