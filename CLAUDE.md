# Lingot Finance : instructions pour les agents IA

## Le projet

Site de simulateurs financiers gratuits en français (créé le 04/10/2026), pour faire venir du trafic depuis Google et le monétiser par un lien de parrainage Trading 212 et un bouton de don. Astro 7 statique, TypeScript strict, Vitest. Publié sur GitHub Pages (dépôt public `AugustinBst/lingot-finance`, base `/lingot-finance`).

## Où chercher

- `src/config/fiscalite.ts` : taux fiscaux 2026, seule source de vérité, datée et sourcée.
- `src/config/site.ts` : nom, liens de revenus (vides = encarts masqués).
- `src/config/tools.ts` : liste des simulateurs (navigation, accueil, pied de page).
- `src/lib/calc/` : calculs purs et testés (`calc.test.ts`). `src/lib/ui.ts` : formatage et graphique SVG côté navigateur.
- `src/pages/` : une page par simulateur, avec sa FAQ (données structurées FAQPage pour Google).

## Règles

- Jamais de conseil personnalisé : simulations indicatives, avertissement en pied de page.
- Liens de parrainage toujours signalés comme tels, avec `rel="sponsored"`.
- Aucun cookie, traceur ni collecte de données : sinon il faudrait un bandeau de consentement.
- Un taux change : le modifier dans `fiscalite.ts`, mettre à jour `verifiedOn` et les sources, adapter les tests.
- Couleurs en tokens CSS (`src/styles/global.css`), pensé d'abord pour 390 px.

## Vérifications

`npm test`, `npm run build` (inclut `astro check`), puis `npm run preview` à 390 px et en desktop.
