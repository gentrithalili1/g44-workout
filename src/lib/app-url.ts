/** Path for same-origin fetches (respects Vite `base` on GitHub Pages / subpaths). */
export function appPath(path: string): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const base = import.meta.env.BASE_URL;
	if (base === "/" || base === "") return normalized;
	return `${base.replace(/\/$/, "")}${normalized}`;
}
