import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

function pagesBase(): string {
	if (process.env.VITE_BASE_PATH) return process.env.VITE_BASE_PATH;
	if (process.env.GITHUB_PAGES === "true") {
		const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
		return repo ? `/${repo}/` : "/";
	}
	return "/";
}

const base = pagesBase();

export default defineConfig({
	base,
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart({
			spa: {
				enabled: process.env.GITHUB_PAGES === "true",
			},
		}),
		viteReact(),
	],
});
