import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { getAuthState } from "#/functions/auth";
import { getWorkouts } from "#/functions/workouts";

export const Route = createFileRoute("/workouts/")({
	beforeLoad: async () => {
		const { authenticated } = await getAuthState();
		if (!authenticated) throw redirect({ to: "/" });
	},
	loader: async () => {
		const data = await getWorkouts();
		if (!data.ok) throw redirect({ to: "/" });
		return data.workouts;
	},
	component: WorkoutsList,
});

function WorkoutsList() {
	const workouts = Route.useLoaderData();
	const router = useRouter();

	async function logout() {
		await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
		await router.invalidate();
	}

	return (
		<div className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-4">
			<header className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">Workouts</h1>
				<Button
					type="button"
					variant="ghost"
					size="icon-lg"
					className="shrink-0"
					onClick={() => void logout()}
					aria-label="Log out"
				>
					<LogOut className="size-5" />
				</Button>
			</header>
			<ul className="flex flex-col gap-3">
				{workouts.map((w) => (
					<li key={w.id}>
						<Link
							to="/workouts/$id"
							params={{ id: w.id }}
							className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<Card className="border-border/80 transition-colors hover:bg-muted/40">
								<CardHeader className="flex flex-row items-center gap-3 space-y-0 py-4">
									<div className="min-w-0 flex-1">
										<CardTitle className="text-lg">{w.name}</CardTitle>
										<CardDescription>
											{w.days.length} day{w.days.length === 1 ? "" : "s"} ·{" "}
											{w.days.reduce((n, d) => n + d.exercises.length, 0)}{" "}
											exercises
										</CardDescription>
									</div>
									<ChevronRight className="size-5 shrink-0 text-muted-foreground" />
								</CardHeader>
							</Card>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
