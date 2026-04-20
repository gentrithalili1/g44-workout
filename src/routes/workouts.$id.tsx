import {
	createFileRoute,
	Link,
	notFound,
	redirect,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "#/components/ui/progress";
import { getAuthState } from "#/functions/auth";
import { getWorkouts } from "#/functions/workouts";
import { isGitHubPagesBuild, readPagesAuth } from "#/lib/gh-pages";
import {
	allExerciseIds,
	localDateKey,
	progressStorageKey,
	readProgress,
	type SessionProgress,
	writeProgress,
} from "#/lib/progress-storage";
import { cn } from "#/lib/utils";
import type { Workout } from "#/lib/workout-types";
import workoutsJson from "../../data/workouts.json";

export const Route = createFileRoute("/workouts/$id")({
	beforeLoad: async () => {
		if (isGitHubPagesBuild()) {
			if (!readPagesAuth()) throw redirect({ to: "/" });
			return;
		}
		const { authenticated } = await getAuthState();
		if (!authenticated) throw redirect({ to: "/" });
	},
	loader: async ({ params }) => {
		if (isGitHubPagesBuild()) {
			const list = workoutsJson as Workout[];
			const workout = list.find((w) => w.id === params.id);
			if (!workout) throw notFound();
			return workout;
		}
		const data = await getWorkouts();
		if (!data.ok) throw redirect({ to: "/" });
		const workout = data.workouts.find((w) => w.id === params.id);
		if (!workout) throw notFound();
		return workout;
	},
	component: WorkoutDetail,
});

function WorkoutDetail() {
	const workout = Route.useLoaderData();
	const dateKey = useMemo(() => localDateKey(), []);
	const storageKey = progressStorageKey(workout.id, dateKey);
	const [progress, setProgress] = useState<SessionProgress>(() =>
		readProgress(storageKey),
	);

	useEffect(() => {
		setProgress(readProgress(storageKey));
	}, [storageKey]);

	const persist = useCallback(
		(next: SessionProgress) => {
			writeProgress(storageKey, next);
			setProgress(next);
		},
		[storageKey],
	);

	const total = useMemo(() => allExerciseIds(workout).length, [workout]);
	const done = useMemo(
		() => allExerciseIds(workout).filter((id) => progress.completed[id]).length,
		[workout, progress.completed],
	);
	const pct = total ? Math.round((done / total) * 100) : 0;

	function setExerciseDone(exerciseId: string, checked: boolean) {
		persist({
			...progress,
			completed: { ...progress.completed, [exerciseId]: checked },
		});
	}

	function finishWorkout() {
		const completed: Record<string, boolean> = { ...progress.completed };
		for (const id of allExerciseIds(workout)) {
			completed[id] = true;
		}
		persist({
			completed,
			finishedAt: new Date().toISOString(),
		});
	}

	return (
		<div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-3">
			<header className="flex items-center gap-2">
				<Link
					to="/workouts"
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon-lg" }),
						"shrink-0",
					)}
					aria-label="Back to workouts"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<div className="min-w-0 flex-1">
					<h1 className="truncate text-xl font-semibold">{workout.name}</h1>
					<p className="text-sm text-muted-foreground">{dateKey}</p>
				</div>
			</header>

			<div className="space-y-2">
				<Progress value={pct} className="flex-col gap-1">
					<div className="flex w-full items-center justify-between gap-2">
						<ProgressLabel>Session progress</ProgressLabel>
						<ProgressValue>
							{done}/{total}
						</ProgressValue>
					</div>
				</Progress>
			</div>

			<div className="flex flex-col gap-6">
				{workout.days.map((day) => (
					<section key={day.id} className="space-y-3">
						<h2 className="text-sm font-medium text-muted-foreground">
							{day.title}
						</h2>
						<ul className="flex flex-col gap-2">
							{day.exercises.map((ex) => (
								<li key={ex.id}>
									<Card className="border-border/80">
										<CardContent className="flex items-start gap-3 p-4">
											<Checkbox
												checked={Boolean(progress.completed[ex.id])}
												onCheckedChange={(c) =>
													setExerciseDone(ex.id, c === true)
												}
												className="mt-1 size-6 rounded-md"
												aria-label={`Done: ${ex.name}`}
											/>
											<div className="min-w-0 flex-1 space-y-1">
												<p
													className={cn(
														"font-medium leading-snug",
														progress.completed[ex.id] &&
															"text-muted-foreground line-through",
													)}
												>
													{ex.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{ex.sets} · rest {ex.rest}
												</p>
											</div>
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>

			<Button
				type="button"
				size="lg"
				className="mt-2 h-12 w-full shrink-0 text-base"
				onClick={finishWorkout}
			>
				Finish workout
			</Button>
		</div>
	);
}
