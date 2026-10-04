import { describe, expect, it } from "vitest";
import { FISCALITE } from "@/config/fiscalite";
import { compound, monthlyNeeded, monthlyRate } from "./compound";
import { compareEnvelopes } from "./envelopes";
import { brokerFees } from "./fees";

describe("intérêts composés", () => {
  it("retrouve la formule fermée d'un capital placé seul", () => {
    const r = compound({ initial: 10_000, monthly: 0, ratePct: 5, years: 10 });
    expect(r.final).toBeCloseTo(10_000 * 1.05 ** 10, 6);
    expect(r.series).toHaveLength(11);
  });

  it("additionne simplement les versements à rendement nul", () => {
    const r = compound({ initial: 1_000, monthly: 100, ratePct: 0, years: 2 });
    expect(r.final).toBeCloseTo(3_400, 9);
    expect(r.gains).toBeCloseTo(0, 9);
  });

  it("applique les frais annuels sur l'encours", () => {
    const r = compound({ initial: 10_000, monthly: 0, ratePct: 5, years: 1, annualFeesPct: 1 });
    expect(r.final).toBeCloseTo(10_000 * 1.05 * 0.99, 6);
    expect(monthlyRate(0)).toBe(0);
  });

  it("trouve le versement mensuel qui atteint l'objectif", () => {
    const m = monthlyNeeded(100_000, 5_000, 6, 15);
    expect(compound({ initial: 5_000, monthly: m, ratePct: 6, years: 15 }).final).toBeCloseTo(100_000, 4);
    expect(monthlyNeeded(1_000, 2_000, 5, 10)).toBe(0);
  });
});

describe("enveloppes", () => {
  const input = { initial: 10_000, monthly: 200, ratePct: 6, years: 10, couple: false, lifeInsuranceFeesPct: 0.6, brokerFeesPct: 0 };

  it("taxe le compte-titres à 31,4 % et le PEA de plus de 5 ans à 18,6 % des gains", () => {
    const [pea, , cto] = compareEnvelopes(input);
    expect(cto.tax).toBeCloseTo(cto.gains * 0.314, 6);
    expect(pea.tax).toBeCloseTo(pea.gains * FISCALITE.socialChargesPct / 100, 6);
    expect(pea.net).toBeGreaterThan(cto.net);
  });

  it("applique l'abattement de l'assurance-vie après 8 ans, doublé pour un couple", () => {
    const [, single] = compareEnvelopes(input);
    const [, couple] = compareEnvelopes({ ...input, couple: true });
    const expected = (single.gains - 4_600) * 0.075 + single.gains * 0.172;
    expect(single.tax).toBeCloseTo(expected, 6);
    expect(couple.tax).toBeLessThan(single.tax);
  });

  it("revient à la flat tax avant 5 ans sur le PEA et signale le plafond", () => {
    const [pea] = compareEnvelopes({ ...input, years: 3 });
    expect(pea.tax).toBeCloseTo(pea.gains * 0.314, 6);
    const [big] = compareEnvelopes({ ...input, initial: 200_000 });
    expect(big.notes.join(" ")).toMatch(/plafond/);
  });
});

describe("frais de courtage", () => {
  it("ne coûte rien sans frais", () => {
    const r = brokerFees({ initial: 1_000, monthly: 100, ratePct: 5, years: 10, orderFixed: 0, orderPct: 0, custodyPct: 0 });
    expect(r.lost).toBeCloseTo(0, 6);
    expect(r.feesPaid).toBeCloseTo(0, 6);
  });

  it("chiffre les frais payés et le manque à gagner, plus grand que les frais eux-mêmes", () => {
    const r = brokerFees({ initial: 0, monthly: 100, ratePct: 7, years: 20, orderFixed: 2, orderPct: 0, custodyPct: 0 });
    expect(r.feesPaid).toBeCloseTo(2 * 240, 6);
    expect(r.lost).toBeGreaterThan(r.feesPaid);
  });
});
