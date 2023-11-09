import { TOKEN_STR } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const prerender = false;

export const GET = async ({ cookies }) => {
  cookies.delete(TOKEN_STR, { path: "/" });
  throw redirect(303, "/auth/login");
};
