import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

type ResponseBody = {
  username: string;
  email: string;
  id: number;
}

export const load = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) {
    throw redirect(303, '/auth/login');
  }

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  console.log(res.status);

  if (res.status === 401) {
    cookies.delete('token');
    throw redirect(303, '/auth/login'); 
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