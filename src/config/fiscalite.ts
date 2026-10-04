/**
 * Fiscalité française des placements, en vigueur au 1er janvier 2026. Seule source de vérité des taux du site.
 * Vérifiée le 04/10/2026 : LFSS 2026 (loi n° 2025-1403 du 30/12/2025, art. 12) porte les prélèvements sociaux
 * des revenus du capital de 17,2 % à 18,6 % (PFU 31,4 %), PEA compris ; l'assurance-vie en est exclue (17,2 %).
 * Sources : cic.fr (principales mesures fiscales 2026), meilleurtaux.com (PEA : 18,6 % en 2026).
 */
export const FISCALITE = {
  verifiedOn: "04/10/2026",
  /** Impôt sur le revenu au prélèvement forfaitaire unique. */
  pfuIncomeTaxPct: 12.8,
  /** Prélèvements sociaux sur les revenus du capital (compte-titres, PEA). */
  socialChargesPct: 18.6,
  /** Prélèvements sociaux maintenus sur l'assurance-vie. */
  lifeInsuranceSocialChargesPct: 17.2,
  /** PEA : exonération d'impôt sur le revenu après 5 ans, plafond de versements. */
  peaExemptAfterYears: 5,
  peaDepositCap: 150_000,
  /** Assurance-vie après 8 ans : abattement annuel sur les gains, puis 7,5 % (versements ≤ 150 000 €). */
  lifeInsuranceLongTermAfterYears: 8,
  lifeInsuranceAllowanceSingle: 4_600,
  lifeInsuranceAllowanceCouple: 9_200,
  lifeInsuranceLongTermIncomeTaxPct: 7.5,
} as const;

/** Flat tax totale, arrondie au dixième (12,8 + 18,6 donne 31,400000000000002 en virgule flottante). */
export const pfuTotalPct = () => Math.round((FISCALITE.pfuIncomeTaxPct + FISCALITE.socialChargesPct) * 10) / 10;

/** Un taux à la française : « 31,4 % ». */
export const rate = (pct: number) => `${pct.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
