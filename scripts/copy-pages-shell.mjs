import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), ".output", "public");
const shell = join(out, "_shell.html");
if (!existsSync(shell)) {
	console.error(
		"Missing",
		shell,
		"— run vite build with GITHUB_PAGES=true first.",
	);
	process.exit(1);
}
for (const name of ["index.html", "404.html"]) {
	copyFileSync(shell, join(out, name));
	console.log("Wrote", join(out, name));
}
