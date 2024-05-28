import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import dotenv from "dotenv";

dotenv.config();
// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
      include: ["**/react/*"],
    }),
    tailwind(),
    icon(),
  ],
  vite: {
    define: {
      "process.env": process.env,
    },
  },
});
