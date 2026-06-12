const DEFAULT_CURRENCY = "USD";

export type MoneyValue = number | string | null | undefined;

// Converts API/UI money values into a safe finite number.
export function toMoneyNumber(value: MoneyValue): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

// Formats a money value using Intl currency formatting.
export function formatCurrency(
    value: MoneyValue,
    currency = DEFAULT_CURRENCY,
    options?: Intl.NumberFormatOptions,
) {
    const safeCurrency = currency || DEFAULT_CURRENCY;

    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: safeCurrency,
            maximumFractionDigits: 2,
            ...options,
        }).format(toMoneyNumber(value));
    } catch {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: DEFAULT_CURRENCY,
            maximumFractionDigits: 2,
            ...options,
        }).format(toMoneyNumber(value));
    }
}

// Formats income/expense values with a visible + or - sign.
export function formatSignedCurrency(
    value: MoneyValue,
    kind: "income" | "expense",
    currency?: string,
) {
    const prefix = kind === "income" ? "+" : "-";
    return `${prefix}${formatCurrency(value, currency)}`;
}

// Formats a string or Date value into a readable date.
export function formatDate(value: string | Date) {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}
