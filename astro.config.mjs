import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    icon(), 
    compress({
      Image: false, // Disable image compression to avoid build crashes
      HTML: true,
      CSS: true,
      JavaScript: true,
      SVG: false,
    })
  ],
  output: "static",
  image: {
    service: {
      entrypoint: 'astro/assets/services/squoosh',
    }
  },
  // If deploying to a subdirectory, uncomment and set the base path:
  // base: '/repository-name'
});