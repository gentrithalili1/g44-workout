import { createFileRoute } from "@tanstack/react-router";
import { updateSession } from "@tanstack/react-start/server";
import { appPassword, timingSafePasswordEqual } from "#/server/password";
import { authSessionConfig } from "#/server/session-config";

export const Route = createFileRoute("/api/auth/login")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return Response.json(
						{ ok: false, error: "invalid_json" },
						{ status: 400 },
					);
				}
				const password =
					typeof body === "object" &&
					body !== null &&
					"password" in body &&
					typeof (body as { password: unknown }).password === "string"
						? (body as { password: string }).password
						: "";
				try {
					if (!timingSafePasswordEqual(password, appPassword())) {
						return Response.json(
							{ ok: false, error: "unauthorized" },
							{ status: 401 },
						);
					}
				} catch {
					return Response.json(
						{ ok: false, error: "server_misconfigured" },
						{ status: 500 },
					);
				}
				await updateSession<{ authenticated?: boolean }>(
					authSessionConfig(),
					() => ({ authenticated: true }),
				);
				return Response.json({ ok: true });
			},
		},
	},
});
