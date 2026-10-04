import { FISCALITE, pfuTotalPct, rate } from "@/config/fiscalite";
import { compound } from "./compound";

export type EnvelopeInput = {
  initial: number;
  monthly: number;
  ratePct: number;
  years: number;
  couple: boolean;
  /** Frais annuels du contrat d'assurance-vie (unités de compte), en %. */
  lifeInsuranceFeesPct: number;
  /** Frais annuels de garde du compte-titres et du PEA, en %. */
  brokerFeesPct: number;
};

export type EnvelopeResult = {
  key: "cto" | "pea" | "av";
  label: string;
  final: number;
  contributed: number;
  gains: number;
  tax: number;
  net: number;
  /** Ce que le calcul suppose ou ce qui limite l'enveloppe. */
  notes: string[];
};

/**
 * Valeur nette après impôts d'un retrait total à la fin de la durée, pour chaque enveloppe.
 * Hypothèses : fonds capitalisants (aucun impôt avant le retrait), un seul retrait, versements ≤ 150 000 € en assurance-vie.
 */
export function compareEnvelopes(input: EnvelopeInput): EnvelopeResult[] {
  const { years, couple } = input;
  const base = { initial: input.initial, monthly: input.monthly, ratePct: input.ratePct, years };

  const cto = compound({ ...base, annualFeesPct: input.brokerFeesPct });
  const ctoTax = Math.max(0, cto.gains) * (pfuTotalPct() / 100);

  const pea = compound({ ...base, annualFeesPct: input.brokerFeesPct });
  const peaLong = years >= FISCALITE.peaExemptAfterYears;
  const peaTax = Math.max(0, pea.gains) * ((peaLong ? FISCALITE.socialChargesPct : pfuTotalPct()) / 100);
  const peaNotes = [peaLong ? `Plus de ${FISCALITE.peaExemptAfterYears} ans : seuls les prélèvements sociaux (${rate(FISCALITE.socialChargesPct)}).` : `Moins de ${FISCALITE.peaExemptAfterYears} ans : flat tax de ${rate(pfuTotalPct())} et clôture du plan.`];
  if (pea.contributed > FISCALITE.peaDepositCap) peaNotes.push(`Attention : les versements dépassent le plafond de ${FISCALITE.peaDepositCap.toLocaleString("fr-FR")} €.`);
  peaNotes.push("Actions européennes ou ETF éligibles seulement.");

  const av = compound({ ...base, annualFeesPct: input.lifeInsuranceFeesPct });
  const avGains = Math.max(0, av.gains);
  const avLong = years >= FISCALITE.lifeInsuranceLongTermAfterYears;
  const allowance = couple ? FISCALITE.lifeInsuranceAllowanceCouple : FISCALITE.lifeInsuranceAllowanceSingle;
  const avTax = avLong
    ? Math.max(0, avGains - allowance) * (FISCALITE.lifeInsuranceLongTermIncomeTaxPct / 100) + avGains * (FISCALITE.lifeInsuranceSocialChargesPct / 100)
    : avGains * ((FISCALITE.pfuIncomeTaxPct + FISCALITE.lifeInsuranceSocialChargesPct) / 100);
  const avNotes = [
    avLong
      ? `Plus de ${FISCALITE.lifeInsuranceLongTermAfterYears} ans : abattement de ${allowance.toLocaleString("fr-FR")} € sur les gains, puis ${rate(FISCALITE.lifeInsuranceLongTermIncomeTaxPct)} + ${rate(FISCALITE.lifeInsuranceSocialChargesPct)} de prélèvements sociaux.`
      : `Moins de ${FISCALITE.lifeInsuranceLongTermAfterYears} ans : ${rate(FISCALITE.pfuIncomeTaxPct)} + ${rate(FISCALITE.lifeInsuranceSocialChargesPct)} de prélèvements sociaux.`,
    `Frais du contrat : ${input.lifeInsuranceFeesPct.toLocaleString("fr-FR")} % par an.`,
  ];

  return [
    { key: "pea", label: "PEA", ...pick(pea), tax: peaTax, net: pea.final - peaTax, notes: peaNotes },
    { key: "av", label: "Assurance-vie", ...pick(av), tax: avTax, net: av.final - avTax, notes: avNotes },
    { key: "cto", label: "Compte-titres", ...pick(cto), tax: ctoTax, net: cto.final - ctoTax, notes: [`Flat tax de ${rate(pfuTotalPct())} sur les gains.`, "Tous les titres du monde, sans plafond."] },
  ];
}

const pick = (r: { final: number; contributed: number; gains: number }) => ({ final: r.final, contributed: r.contributed, gains: r.gains });
