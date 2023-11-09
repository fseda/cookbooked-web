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

type ResBody = {
  success: boolean,
  message: string,
}

export const actions = {
	default: async ({ request, cookies }) => {
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

    const res = await fetch(`${API_URL}/auth/login`, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const resBody: ResBody = await res.json();
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
      httpOnly: true,
    });

    throw redirect(303, "/");
	}
};
