import { TOKEN_STR } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
  // const token = cookies.get(TOKEN_STR);

  // const res = await fetch(`${API_URL}/auth/signout`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // if (!res.ok) {
  //   return new Response(await res.text());
  // }

  cookies.set(TOKEN_STR, "", {
    path: "/",
  });

  throw redirect(303, "/auth/login");
};