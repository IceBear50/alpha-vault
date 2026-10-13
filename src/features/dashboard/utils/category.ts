import {
  Car,
  Gift,
  Plane,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Visual identity (icon + accent color) for known spend categories. The
 * palette runs from bright to deep orange so the donut chart reads as one
 * cohesive family, matching the design.
 */
export const CATEGORY_STYLES: Record<
  string,
  { icon: LucideIcon; color: string }
> = {
  Shopping: { icon: ShoppingBag, color: "#FF6600" },
  "Food & Dining": { icon: UtensilsCrossed, color: "#E0781F" },
  "Bills & Utilities": { icon: Receipt, color: "#A85A2B" },
  Travel: { icon: Plane, color: "#7A4A2E" },
  Transport: { icon: Car, color: "#7A4A2E" },
  Others: { icon: Gift, color: "#B8763A" },
};

const FALLBACK_COLORS = ["#FF6600", "#E0781F", "#A85A2B", "#7A4A2E", "#B8763A", "#C98A4A"];

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_STYLES[category]?.icon ?? Gift;
}

export function getCategoryColor(category: string, index = 0): string {
  return CATEGORY_STYLES[category]?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}
