import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// Publié sur GitHub Pages : https://augustinbst.github.io/lingot-finance/
export default defineConfig({
  site: "https://augustinbst.github.io",
  base: "/lingot-finance",
  trailingSlash: "always",
  integrations: [sitemap()],
});
