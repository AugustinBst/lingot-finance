import { monthlyRate } from "./compound";

export type FeesInput = {
  initial: number;
  monthly: number;
  ratePct: number;
  years: number;
  /** Frais par ordre : part fixe en € et part proportionnelle en %. */
  orderFixed: number;
  orderPct: number;
  /** Frais de garde annuels, en % de l'encours. */
  custodyPct: number;
};

export type FeesResult = { withoutFees: number; withFees: number; feesPaid: number; lost: number; lostPct: number };

/**
 * Coût réel des frais de courtage : ce qui est payé, et ce que cet argent aurait rapporté s'il était resté investi.
 * Un ordre par versement mensuel (et un pour le versement initial).
 */
export function brokerFees({ initial, monthly, ratePct, years, orderFixed, orderPct, custodyPct }: FeesInput): FeesResult {
  const orderCost = (amount: number) => (amount > 0 ? orderFixed + (amount * orderPct) / 100 : 0);
  const r = monthlyRate(ratePct);
  const rNet = monthlyRate(ratePct, custodyPct);
  const firstFee = Math.min(initial, orderCost(initial));
  let clean = initial;
  let net = initial - firstFee;
  let feesPaid = firstFee;
  for (let month = 1; month <= Math.round(years * 12); month++) {
    clean = clean * (1 + r) + monthly;
    const before = net * (1 + r);
    const after = net * (1 + rNet);
    const fee = Math.min(monthly, orderCost(monthly));
    feesPaid += before - after + fee;
    net = after + monthly - fee;
  }
  const lost = clean - net;
  return { withoutFees: clean, withFees: net, feesPaid, lost, lostPct: clean > 0 ? (lost / clean) * 100 : 0 };
}
