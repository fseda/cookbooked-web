const VITE_API_URL = import.meta.env.VITE_API_URL;
import { redirect } from '@sveltejs/kit';

type ResponseBody = {
  username: string;
  email: string;
  id: number;
}

export const load = async ({ cookies, fetch }) => {
  const token = cookies.get('token');
  if (!token) {
    redirect(303, '/auth/login');
  }

  const res = await fetch(`${VITE_API_URL}/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    cookies.delete('token', { path: '/' });
    redirect(303, '/auth/login'); 
  }

  if (!res.ok) {
    return {
      status: res.status,
      body: await res.json(),
    }
  }

  const body: ResponseBody = await res.json();

  return body
}