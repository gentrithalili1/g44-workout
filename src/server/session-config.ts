import { join } from "node:path";
import type { SessionConfig } from "@tanstack/start-server-core";

function sessionPassword(): string {
	const p = process.env.WORKOUT_SESSION_SECRET;
	if (p && p.length >= 32) return p;
	if (process.env.NODE_ENV !== "production") {
		return "dev-dev-dev-dev-dev-dev-dev-dev-dev-dev-de";
	}
	throw new Error(
		"WORKOUT_SESSION_SECRET must be set to a random string of at least 32 characters",
	);
}

export function authSessionConfig(): SessionConfig {
	return {
		name: "g44_auth",
		password: sessionPassword(),
		maxAge: 60 * 60 * 24 * 365 * 20,
		cookie: {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		},
	};
}

export function workoutsJsonPath(): string {
	return join(process.cwd(), "data", "workouts.json");
}
