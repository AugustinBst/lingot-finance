/** Outils d'affichage communs aux simulateurs (navigateur). */
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eurCents = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatEur = (n: number) => eur.format(n);
export const formatEurCents = (n: number) => eurCents.format(n);
export const formatPct = (n: number) => `${n.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

/** Lit un champ numérique du formulaire ; virgule acceptée, valeur bornée. */
export function readNumber(form: HTMLFormElement, name: string, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const raw = (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "0";
  const n = Number(raw.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

export const setText = (id: string, text: string) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};

/**
 * Courbe en aires empilées (versements, puis gains au-dessus), en SVG pur : aucune bibliothèque, rendu instantané.
 */
export function areaChart(points: { x: number; base: number; total: number }[], label: string): string {
  if (points.length < 2) return "";
  const w = 600;
  const h = 260;
  const pad = { l: 8, r: 8, t: 12, b: 24 };
  const max = Math.max(...points.map((p) => p.total), 1);
  const lastX = points.at(-1)!.x || 1;
  const x = (v: number) => pad.l + (v / lastX) * (w - pad.l - pad.r);
  const y = (v: number) => h - pad.b - (v / max) * (h - pad.t - pad.b);
  const line = (key: "base" | "total") => points.map((p, i) => `${i ? "L" : "M"}${x(p.x).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const close = `L${x(lastX).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, Math.round(lastX / 2), lastX].map((t) => `<text x="${x(t)}" y="${h - 6}" text-anchor="middle" fill="var(--muted)" font-size="12">${t} an${t > 1 ? "s" : ""}</text>`).join("");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity="0.55"/><stop offset="1" stop-color="var(--ember)" stop-opacity="0.15"/></linearGradient></defs>
    <path d="${line("total")} ${close}" fill="url(#g)"/>
    <path d="${line("base")} ${close}" fill="oklch(1 0 0 / 10%)"/>
    <path d="${line("total")}" fill="none" stroke="var(--gold)" stroke-width="2"/>
    ${ticks}
  </svg>`;
}
