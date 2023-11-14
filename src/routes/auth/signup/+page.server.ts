import { API_URL } from '$env/static/private';
import { parseToken } from '$lib/auth/jwt';
import { redirect, type Actions, type ServerLoad, fail } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
  const token = event.cookies.get("token");
  if (token) {
    throw redirect(301, "/");
  }

  return {
    token: "",
  }
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const body = JSON.stringify({ username, email, password });

    const usernameExists = (await (
      await fetch(`${API_URL}/users/exists?username=${username}`)
    ).json())["exists"];

    const emailExists = (await (
      await fetch(`${API_URL}/users/exists?email=${email}`)
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
    
    const res = await fetch(`${API_URL}/auth/signup`, {
      body,
      method: 'POST',
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

    throw redirect(303, "/me");
	}
};