const VITE_API_URL = import.meta.env.VITE_API_URL;
import { parseToken } from '$lib/auth/jwt';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
  const token = event.cookies.get("token");
  if (token) {
    redirect(301, "/");
  }

  return {
    token: "",
  }
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const body = JSON.stringify({ username, email, password });

    const usernameExists = (await (
      await fetch(`${VITE_API_URL}/users/exists?username=${username}`)
    ).json())["exists"];

    const emailExists = (await (
      await fetch(`${VITE_API_URL}/users/exists?email=${email}`)
    ).json())["exists"];
    
    if (usernameExists || emailExists) {
      return fail(400, {
        username,
        email,
        error: {
          username: usernameExists ? "username already in use" : "",
          email: emailExists ? "email already in use" : "",
        },
      })
    }
    
    const res = await fetch(`${VITE_API_URL}/auth/signup`, {
      body,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    });

    const resBody = await res.json();

    if (!res.ok) {
      return fail(res.status, {
        username,
        email,
        error: resBody,
      })
    }
    
    const token = res.headers.get('Authorization');
    cookies.set('token', parseToken(token), {
      path: '/',
      httpOnly: true,
    });

    redirect(303, "/me");
	}
};