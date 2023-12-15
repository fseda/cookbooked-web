import type { ErrorBody, ResponseBody } from '$lib/models/Recipe.js';
import { fail, redirect } from '@sveltejs/kit';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const actions = {
  save: async ({ request, cookies, fetch }) => {
    const token = cookies.get('token');
    if (!token) {
      redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const body = formData.get('body');
    const link = formData.get('link');

    const recipe = {
      title,
      description,
      body,
      link: link?.length ?? "".length > 0 ? link : "a ",
    }

    const res = await fetch(`${VITE_API_URL}/recipes/new`, {
      method: 'POST',
      body: JSON.stringify(recipe),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 401) {
      cookies.delete('token', { path: '/' });
      redirect(303, '/auth/login'); 
    }

    if (!res.ok) {
      const resBody: ErrorBody = await res.json();
      return fail(res.status, {
        recipe,
        error: resBody.message,
      })
    }
    const resBody: ResponseBody = await res.json();
    const newRecipe = resBody.recipe;

    return {
      location: `/recipes/${newRecipe.id}`,
    };
  },
};