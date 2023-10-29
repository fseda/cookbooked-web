import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  const token = cookies.get("token");
  if (token) {
    throw redirect(303, "/");
  }

  return {
    token: "",
  }
};

export const actions = {
	default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    const body = JSON.stringify({ username, password });

    const res = await fetch(`${API_URL}/auth/login`, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const resBody = await res.text()
    console.log({
      status: res.status,
      body: resBody,
    })

    if (!res.ok) {
      return {
        status: res.status,
        body: resBody,
      }
    }
    
    const token = res.headers.get('authorization');
    cookies.set('token', token?.split("Bearer ")[1] ?? "", {
      path: '/',
    });

    throw redirect(303, "/");
	}
};
