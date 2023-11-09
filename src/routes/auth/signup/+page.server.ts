import { API_URL } from '$env/static/private';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';

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
    
    const res = await fetch(`${API_URL}/auth/signup`, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const resBody = await res.json();

    console.log({
      status: res.status,
      body: resBody,
    })

    if (!res.ok) {
      return {
        status: res.status,
        error: resBody,
      }
    }
    
    const token = res.headers.get('Authorization');
    cookies.set('token', token?.split("Bearer ")[1] ?? "", {
      path: '/',
      httpOnly: true,
    });

    throw redirect(303, "/me");
	}
};