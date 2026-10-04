/**
 * Réglages du site. Les liens de revenus restent vides tant qu'Augustin ne les a pas fournis :
 * leurs encarts ne s'affichent alors pas du tout.
 */
export const SITE = {
  name: "Lingot Finance",
  tagline: "Simulateurs financiers gratuits, clairs et à jour de la fiscalité 2026",
  author: "Augustin Bost",
  /** Lien de parrainage Trading 212 (app → Inviter des amis). Toujours signalé comme lien de parrainage. */
  referralUrl: "",
  /** Page de don (Buy Me a Coffee, Ko-fi…). */
  donationUrl: "",
  repoUrl: "https://github.com/AugustinBst/lingot-finance",
} as const;
