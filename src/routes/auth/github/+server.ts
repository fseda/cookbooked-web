import { error, redirect, type NumericRange } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export const prerender = false;

export const GET = async ({ cookies, fetch, url }) => {
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  let authenticating = !!code;

  const token = cookies.get('token');
  let authenticated = !!token;

  if (!authenticated && authenticating) {
    const storesState = cookies.get('github_oauth_state');
    cookies.delete('github_oauth_state', { path: '/auth' });
    if (storesState !== state) error(400, "Stored state doesn't match value returned from GitHub");

    const response = await fetch(VITE_API_URL + "/auth/github/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code }),
    });
  
    if (!response.ok) {
      const status = response.status as NumericRange<400, 599>;
      error(status, "Failed to get GitHub access token");
    }
  
    const { token }: AccessTokenResponse = await response.json();

    cookies.set('token', token, { path: '/' });
    authenticated = true;
    authenticating = false;
  } 

  if (authenticated) {
    redirect(303, '/');
  }

  redirect(303, '/auth/login');
}

export const POST = ({ cookies }) => {
  const state = uuidv4();
  cookies.set('github_oauth_state', state, { path: '/auth' });

  return new Response(JSON.stringify({
    client_id: CLIENT_ID,
    state,
  }))
}

type AccessTokenResponse = {
  token: string;
  refresh_token?: string;
}
