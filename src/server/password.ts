import { createHash, timingSafeEqual } from "node:crypto";

function sha256(s: string): Buffer {
	return createHash("sha256").update(s, "utf8").digest();
}

export function timingSafePasswordEqual(
	guess: string,
	expected: string,
): boolean {
	const a = sha256(guess);
	const b = sha256(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function appPassword(): string {
	const p = process.env.WORKOUT_APP_PASSWORD;
	if (p) return p;
	if (process.env.NODE_ENV !== "production") {
		return "workout";
	}
	throw new Error("WORKOUT_APP_PASSWORD must be set");
}
