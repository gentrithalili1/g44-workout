/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GH_PAGES?: string;
	/** Injected at build for GitHub Pages only; ends up in the client bundle. */
	readonly VITE_PAGES_PASSWORD?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
