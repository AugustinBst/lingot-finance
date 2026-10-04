/** Taux mensuel équivalent à un rendement annuel net de frais annuels (en %). */
export function monthlyRate(annualPct: number, annualFeesPct = 0): number {
  const netAnnual = (1 + annualPct / 100) * (1 - annualFeesPct / 100);
  return Math.pow(netAnnual, 1 / 12) - 1;
}

export type CompoundInput = {
  initial: number;
  monthly: number;
  /** Rendement annuel moyen espéré, en %. */
  ratePct: number;
  years: number;
  /** Frais annuels de gestion ou de garde, en % de l'encours. */
  annualFeesPct?: number;
};

export type YearPoint = { year: number; contributed: number; value: number };

export type CompoundResult = { final: number; contributed: number; gains: number; series: YearPoint[] };

/** Capital après versements mensuels (en fin de mois) et capitalisation mensuelle. */
export function compound({ initial, monthly, ratePct, years, annualFeesPct = 0 }: CompoundInput): CompoundResult {
  const r = monthlyRate(ratePct, annualFeesPct);
  let value = initial;
  let contributed = initial;
  const series: YearPoint[] = [{ year: 0, contributed, value }];
  for (let month = 1; month <= Math.round(years * 12); month++) {
    value = value * (1 + r) + monthly;
    contributed += monthly;
    if (month % 12 === 0) series.push({ year: month / 12, contributed, value });
  }
  return { final: value, contributed, gains: value - contributed, series };
}

/** Versement mensuel nécessaire pour atteindre un objectif (0 si le capital de départ suffit). */
export function monthlyNeeded(target: number, initial: number, ratePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (n <= 0) return Math.max(0, target - initial);
  const r = monthlyRate(ratePct);
  if (Math.abs(r) < 1e-12) return Math.max(0, (target - initial) / n);
  const growth = Math.pow(1 + r, n);
  return Math.max(0, ((target - initial * growth) * r) / (growth - 1));
}
