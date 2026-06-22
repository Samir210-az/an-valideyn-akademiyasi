import type { PackageTier } from "@/types";

export interface PackageDefinition {
  tier: PackageTier;
  name: string;
  priceAzn: number;
  features: string[];
}

export const PACKAGES: PackageDefinition[] = [
  {
    tier: "basic",
    name: "Basic",
    priceAzn: 29,
    features: ["1 modul/ay sürəti", "Email dəstək"],
  },
  {
    tier: "standard",
    name: "Standard",
    priceAzn: 49,
    features: ["Tam kurs", "Mütəxəssis rəyi", "Chat dəstək"],
  },
  {
    tier: "premium",
    name: "Premium",
    priceAzn: 79,
    features: ["Tam kurs", "Həftəlik fərdi rəy", "Prioritet dəstək", "Sertifikat"],
  },
];

export function getPackageByTier(tier: PackageTier) {
  return PACKAGES.find((p) => p.tier === tier);
}
