const STORAGE_KEY = "g44_pages_auth";

export function isGitHubPagesBuild(): boolean {
	return import.meta.env.VITE_GH_PAGES === "true";
}

export function readPagesAuth(): boolean {
	if (typeof sessionStorage === "undefined") return false;
	return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function setPagesAuth(): void {
	sessionStorage.setItem(STORAGE_KEY, "1");
}

export function clearPagesAuth(): void {
	sessionStorage.removeItem(STORAGE_KEY);
}

export function verifyPagesPassword(password: string): boolean {
	const expected = import.meta.env.VITE_PAGES_PASSWORD;
	if (typeof expected !== "string" || expected.length === 0) {
		return false;
	}
	return password === expected;
}
