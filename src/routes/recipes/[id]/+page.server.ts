import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

type Category = {
  id: number,
  category: string,
  description: string,
}

export type System = "metric" | "imperial";
export type Type = "weight" | "volume" | "temperature";
export type Unit = {
  id: number,
  name: string,
  symbol: string,
  system?: System,
  type?: Type,
}

type Ingredient = {
  id: number,
  icon: string,
  name: string,
  category?: Category,
}

type RecipeIngredients = {
  id?: number,
  recipe_id: number,
  ingredient: Ingredient,
  quantity: number,
  unit: Unit,
}

export type RecipeDetails = {
  id: number,
  title: string,
  description: string,
  body: string,
  recipe_ingredients: RecipeIngredients[],
  link: string,
}

export type ResponseBody = {
  recipe: RecipeDetails,
}

export type ErrorBody = {
  success: boolean,
  message: string,
}

export const load = async ({ cookies, params, fetch }) => {
  const token = cookies.get('token');
  if (!token) {
    throw redirect(303, '/auth/login');
  }

  const res = await fetch(`${API_URL}/recipes/${params.id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    cookies.delete('token');
    throw redirect(303, '/auth/login'); 
  }

  if (!res.ok) {
    const resBody: ErrorBody = await res.json();
    // console.log(resBody.message, res.status)
    return fail(400, { error: resBody.message });
  }

  const resBody: ResponseBody = await res.json();
  const recipe = resBody.recipe;

  const unitResBody = await (await fetch(`${API_URL}/units`)).json();
  const units: Unit[] = unitResBody.units;

  return {
    status: res.status,
    body: {
      recipe,
      units,
    },
  }
}

export const actions = {
  save: async ({ request, cookies, fetch, params }) => {
    const token = cookies.get('token');
    if (!token) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const body = formData.get('body');
    const link = formData.get('link');
    const recipeIngredients = formData.getAll('recipe_ingredients');

    const recipe = {
      title,
      description,
      body,
      link,
    }

    const recipe_ingredients = JSON.stringify(recipeIngredients)
    const riRes = await fetch(`${API_URL}/recipes/${params.id}/ingredients`, {
      method: 'PATCH',
      body: recipe_ingredients,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!riRes.ok) {
      const resError: ErrorBody = await riRes.json();
      return fail(riRes.status, {
        error: resError.message,
      }) 
    }

    const res = await fetch(`${API_URL}/recipes/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(recipe),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 401) {
      cookies.delete('token');
      throw redirect(303, '/auth/login'); 
    }

    if (!res.ok) {
      const resBody: ErrorBody = await res.json();
      return fail(res.status, {
        error: resBody.message,
      })
    }
    const resBody: ResponseBody = await res.json();
    const updatedRecipe = resBody.recipe;

    return {
      status: res.status,
      body: {recipe: updatedRecipe},
    }
  },

  delete: async ({ cookies, fetch, params }) => {
    const token = cookies.get('token');
    if (!token) {
      throw redirect(303, '/auth/login');
    }

    const res = await fetch(`${API_URL}/recipes/${params.id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      cookies.delete('token');
      throw redirect(303, '/auth/login'); 
    }

    if (!res.ok) {
      const resBody: ErrorBody = await res.json();
      return fail(res.status, {
        error: resBody.message,
      })
    }

    throw redirect(303, '/recipes');
  }
}