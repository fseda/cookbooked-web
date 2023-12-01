const VITE_API_URL = import.meta.env.VITE_API_URL;
import { parseToken } from '$lib/auth/jwt.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  const token = cookies.get("token");
  if (token) {
    throw redirect(303, "/");
  }

  return;
};

type ResBody = {
  success: boolean,
  message: string,
}

export const actions = {
	default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      return {
        status: 400,
        body: "Missing username or password",
      }
    }

    const body = JSON.stringify({ username, password });

    const res = await fetch(`${VITE_API_URL}/auth/login`, {
      body,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    });

    const resBody: ResBody = await res.json();
    if (!res.ok) {
      return fail(res.status, {
        error: resBody,
      })
    }
    
    const token = res.headers.get('Authorization');
    cookies.set('token', parseToken(token), {
      path: '/',
      httpOnly: true,
    });

    throw redirect(303, "/");
	}
};
