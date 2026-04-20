import { createServerFn } from "@tanstack/react-start";
import type { WorkoutsFile } from "#/lib/workout-types";
import { loadWorkoutsFromDisk } from "#/server/load-workouts";
import { authSessionConfig } from "#/server/session-config";

export const getWorkouts = createServerFn({ method: "GET" }).handler(
	async () => {
		const { getSession } = await import("@tanstack/react-start/server");
		const session = await getSession<{ authenticated?: boolean }>(
			authSessionConfig(),
		);
		if (!session?.data?.authenticated) {
			return { ok: false as const, workouts: [] as WorkoutsFile };
		}
		const workouts = await loadWorkoutsFromDisk();
		return { ok: true as const, workouts };
	},
);
