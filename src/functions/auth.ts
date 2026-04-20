import { createServerFn } from "@tanstack/react-start";
import { authSessionConfig } from "#/server/session-config";

export const getAuthState = createServerFn({ method: "GET" }).handler(
	async () => {
		const { getSession } = await import("@tanstack/react-start/server");
		const session = await getSession<{ authenticated?: boolean }>(
			authSessionConfig(),
		);
		return { authenticated: Boolean(session?.data?.authenticated) };
	},
);
