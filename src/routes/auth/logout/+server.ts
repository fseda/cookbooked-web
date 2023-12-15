import { redirect } from "@sveltejs/kit";

export const prerender = false;

export const GET = async ({ cookies }) => {
  cookies.delete("token", { path: "/" });
  throw redirect(303, "/auth/login");
};
