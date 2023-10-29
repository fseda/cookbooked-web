import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  const token = event.cookies.get("token");
  if (token) {
    throw redirect(301, "/");
  }

  return {
    token: "",
  }
};

export const actions = {
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

    if (!res.ok) {
      return {
        status: res.status,
        body: await res.json(),
      }
    }
    
    const token = res.headers.get('Authorization');
    cookies.set('token', token?.split("Bearer ")[1] ?? "", {
      path: '/',
    });

    throw redirect(303, "/me");
	}
};