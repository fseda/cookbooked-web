import { redirect } from "@sveltejs/kit";

export const prerender = false;

export const GET = async ({ cookies }): Promise<void> => {
  cookies.delete("token", { path: "/" });
  redirect(303, "/auth/login");
};
