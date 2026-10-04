/** Les simulateurs du site : navigation, accueil et maillage interne en découlent. */
export const TOOLS = [
  { slug: "interets-composes", short: "Intérêts composés", title: "Simulateur d'intérêts composés", description: "Combien vaudra ton épargne dans 10, 20 ou 30 ans avec des versements mensuels ? Courbe année par année." },
  { slug: "pea-assurance-vie-compte-titres", short: "PEA, AV ou CTO", title: "PEA, assurance-vie ou compte-titres : le comparateur", description: "Ce qu'il te reste vraiment après impôts selon l'enveloppe, avec la fiscalité 2026 (flat tax 31,4 %)." },
  { slug: "frais-de-courtage", short: "Frais de courtage", title: "Le vrai coût des frais de courtage", description: "Frais par ordre et frais de garde : ce que tu paies, et surtout ce que cet argent aurait rapporté." },
  { slug: "objectif-epargne", short: "Objectif d'épargne", title: "Combien épargner par mois pour atteindre ton objectif ?", description: "Fixe un montant et une date : le simulateur calcule le versement mensuel nécessaire." },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
