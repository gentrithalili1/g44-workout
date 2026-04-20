import { createFileRoute } from "@tanstack/react-router";
import { clearSession } from "@tanstack/react-start/server";
import { authSessionConfig } from "#/server/session-config";

export const Route = createFileRoute("/api/auth/logout")({
	server: {
		handlers: {
			POST: async () => {
				await clearSession(authSessionConfig());
				return Response.json({ ok: true });
			},
		},
	},
});
