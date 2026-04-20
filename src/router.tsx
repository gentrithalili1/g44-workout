import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const basepath = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
	return createTanStackRouter({
		routeTree,
		basepath: basepath === "/" ? "/" : basepath,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
