import type { PackageTier } from "@/types";

export interface PackageDefinition {
  tier: PackageTier;
  name: string;
  priceAzn: number;
  stripePriceEnvKey: string;
  features: string[];
}

export const PACKAGES: PackageDefinition[] = [
  {
    tier: "basic",
    name: "Basic",
    priceAzn: 29,
    stripePriceEnvKey: "STRIPE_PRICE_BASIC",
    features: ["1 modul/ay sürəti", "Email dəstək"],
  },
  {
    tier: "standard",
    name: "Standard",
    priceAzn: 49,
    stripePriceEnvKey: "STRIPE_PRICE_STANDARD",
    features: ["Tam kurs", "Mütəxəssis rəyi", "Chat dəstək"],
  },
  {
    tier: "premium",
    name: "Premium",
    priceAzn: 79,
    stripePriceEnvKey: "STRIPE_PRICE_PREMIUM",
    features: ["Tam kurs", "Həftəlik fərdi rəy", "Prioritet dəstək", "Sertifikat"],
  },
];

export function getPackageByTier(tier: PackageTier) {
  return PACKAGES.find((p) => p.tier === tier);
}
