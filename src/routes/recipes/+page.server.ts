const VITE_API_URL = import.meta.env.VITE_API_URL;
import { fail, redirect } from "@sveltejs/kit";

export type Recipe = {
  id: number,
  title: string,
  description: string,
}

type ResponseBody = {
  recipes: Recipe[],
  error: {
    success: boolean,
    message: string,
  }
}

export const load = async ({ cookies, fetch }) => {
  const token = cookies.get('token');
  if (!token) {
    redirect(303, '/auth/login');
  }

  const res = await fetch(`${VITE_API_URL}/recipes`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    cookies.delete('token', { path: '/' });
    redirect(303, '/auth/login'); 
  }

  const resBody: ResponseBody = await res.json();
  if (!res.ok) {
    return fail(res.status, {
      error: "Some error occurred",
    })
  }

  const recipes = resBody.recipes;

  return {
    status: res.status,
    body: {recipes},
  }
}

