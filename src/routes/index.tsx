import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { getAuthState } from "#/functions/auth";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const { authenticated } = await getAuthState();
		if (authenticated) throw redirect({ to: "/workouts" });
	},
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();
	const navigate = useNavigate({ from: "/" });
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setPending(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "content-type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ password }),
			});
			if (!res.ok) {
				setError("Wrong password");
				return;
			}
			await router.invalidate();
			await navigate({ to: "/workouts" });
		} finally {
			setPending(false);
		}
	}

	return (
		<main className="flex flex-1 flex-col justify-center px-6 py-12">
			<form onSubmit={onSubmit} className="flex flex-col gap-6">
				<div className="space-y-2">
					<Label htmlFor="pw" className="text-muted-foreground">
						Password
					</Label>
					<Input
						id="pw"
						name="password"
						type="password"
						autoComplete="current-password"
						autoFocus
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="h-12 text-base"
						placeholder="••••••••"
					/>
				</div>
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				<Button
					type="submit"
					size="lg"
					className="h-12 w-full text-base"
					disabled={pending}
				>
					{pending ? "Checking…" : "Enter"}
				</Button>
			</form>
		</main>
	);
}
