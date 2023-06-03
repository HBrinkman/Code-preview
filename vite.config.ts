import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

export default defineConfig({
  plugins: [sveltekit(), crossOriginIsolation()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
