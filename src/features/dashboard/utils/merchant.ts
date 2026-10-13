const MERCHANT_STYLES: Record<string, { bg: string; text: string }> = {
  amazon: { bg: "#111111", text: "#FFFFFF" },
  "amazon india": { bg: "#111111", text: "#FFFFFF" },
  swiggy: { bg: "#FC8019", text: "#FFFFFF" },
  netflix: { bg: "#E50914", text: "#FFFFFF" },
  flipkart: { bg: "#2874F0", text: "#FFFFFF" },
  uber: { bg: "#000000", text: "#FFFFFF" },
  zomato: { bg: "#E23744", text: "#FFFFFF" },
};

const FALLBACK_PALETTE = [
  "#FF6600",
  "#5FBF68",
  "#4C8DFF",
  "#D99A32",
  "#B968FF",
  "#33B8C4",
];

function hashString(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

/**
 * Returns a display style (background + text color) for a merchant avatar.
 * Falls back to a deterministic color from a palette when the merchant isn't
 * one of the well-known brands, so the same merchant always renders the same
 * way.
 */
export function getMerchantAvatarStyle(merchant: string) {
  const key = merchant.trim().toLowerCase();
  const known = MERCHANT_STYLES[key];

  if (known) {
    return known;
  }

  const color = FALLBACK_PALETTE[hashString(key) % FALLBACK_PALETTE.length];

  return { bg: color, text: "#FFFFFF" };
}

export function getMerchantInitial(merchant: string) {
  return merchant.trim().charAt(0).toUpperCase();
}

/**
 * The API doesn't return a per-transaction coin amount yet, so we estimate
 * it client-side (1 coin per ₹100 spent) purely for display. Pending
 * transactions don't earn coins until they settle.
 */
export function estimateCoinsEarned(amount: number, status: string) {
  if (status !== "SUCCESS") {
    return null;
  }

  return Math.max(1, Math.round(amount / 100));
}
