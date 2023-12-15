import { error, redirect } from '@sveltejs/kit';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const prerender = false;

export const GET = async ({ cookies, fetch, url }): Promise<void> => {
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  let authenticating = !!code;

  const token = cookies.get('token');
  let authenticated = !!token;

  if (!authenticated && authenticating) {
    const storesState = cookies.get('github_oauth_state');
    cookies.delete('github_oauth_state');
    if (storesState !== state) error(400, "Stored state doesn't match value returned from GitHub");

    const response = await fetch(VITE_API_URL + "/auth/github/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code }),
    });
  
    if (!response.ok) {
      error(response.status, "Failed to get GitHub access token");
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

type AccessTokenResponse = {
  token: string;
  refresh_token?: string;
}
