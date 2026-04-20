import { readFile } from "node:fs/promises";
import type { WorkoutsFile } from "#/lib/workout-types";
import { workoutsJsonPath } from "#/server/session-config";

export async function loadWorkoutsFromDisk(): Promise<WorkoutsFile> {
	const raw = await readFile(workoutsJsonPath(), "utf8");
	return JSON.parse(raw) as WorkoutsFile;
}
