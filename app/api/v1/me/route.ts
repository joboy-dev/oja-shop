import { route } from "../_lib/handler";

/** The signed-in user (including role and phone), or null. Never 401: clients use it to learn session state. */
export const GET = route({ access: "optional" }, async ({ user }) => user);
