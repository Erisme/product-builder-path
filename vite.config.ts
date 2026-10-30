import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` relatif : le build fonctionne aussi bien à la racine d'un domaine
// que sous https://<utilisateur>.github.io/builder-path/.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
