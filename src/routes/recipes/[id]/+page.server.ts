import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

type Category = {
  id: number,
  category: string,
  description: string,
}

type System = "metric" | "imperial";
type Type = "weight" | "volume" | "temperature";
type Unit = {
  id: number,
  name: string,
  symbol: string,
  system: System,
  type: Type,
}

type Ingredient = {
  id: number,
  icon: string,
  name: string,
  category: Category,
}

type RecipeIngredients = {
  id: number,
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

  const resBody: ResponseBody = await res.json();
  if (!res.ok) {
    return fail(res.status, {
      error: resBody?.message,
    })
  }

  const recipe = resBody.recipe;

  return {
    status: res.status,
    body: {recipe},
  }
}