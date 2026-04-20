import type { Workout } from "#/lib/workout-types";

export type SessionProgress = {
	completed: Record<string, boolean>;
	finishedAt?: string;
};

export function localDateKey(d = new Date()): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function progressStorageKey(workoutId: string, dateKey: string): string {
	return `g44-progress:${workoutId}:${dateKey}`;
}

export function readProgress(key: string): SessionProgress {
	if (typeof window === "undefined") {
		return { completed: {} };
	}
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return { completed: {} };
		const parsed = JSON.parse(raw) as SessionProgress;
		if (!parsed || typeof parsed !== "object" || !parsed.completed) {
			return { completed: {} };
		}
		return {
			completed: parsed.completed,
			finishedAt:
				typeof parsed.finishedAt === "string" ? parsed.finishedAt : undefined,
		};
	} catch {
		return { completed: {} };
	}
}

export function writeProgress(key: string, value: SessionProgress) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function allExerciseIds(workout: Workout): string[] {
	return workout.days.flatMap((day) => day.exercises.map((e) => e.id));
}
