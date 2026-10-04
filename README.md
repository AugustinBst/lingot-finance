# Lingot Finance

Simulateurs financiers gratuits en français, à jour de la fiscalité 2026 : intérêts composés, PEA / assurance-vie / compte-titres après impôts, coût réel des frais de courtage, objectif d'épargne.

En ligne : https://augustinbst.github.io/lingot-finance/

- Site statique (Astro), sans serveur, sans base, sans cookie ni traceur : il tourne seul et ne coûte rien.
- Publication automatique sur GitHub Pages à chaque push sur `main` (`.github/workflows/deploy.yml`), après tests et vérification des types.

## Développer

```bash
npm install
npm run dev
```

Vérifications : `npm test` puis `npm run build` (qui lance `astro check`).

## Revenus

Renseigner les liens dans `src/config/site.ts` : `referralUrl` (parrainage Trading 212) et `donationUrl` (page de don). Tant qu'ils sont vides, leurs encarts ne s'affichent pas.

## Fiscalité

Tous les taux sont dans `src/config/fiscalite.ts`, avec la date de vérification et les sources. Une loi de finances change un taux : on le modifie là, et nulle part ailleurs.
