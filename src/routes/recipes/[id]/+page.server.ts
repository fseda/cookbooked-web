import { API_URL } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';

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

export type Ingredient = {
  id: number,
  icon: string,
  name: string,
  category?: Category,
}

export type RecipeIngredient = {
  id?: number,
  recipe_id: number,
  unit_id: number,
  ingredient_id: number,
  ingredient: Ingredient,
  quantity: number,
  unit: Unit,
}

export type RecipeDetails = {
  id: number,
  title: string,
  description: string,
  body: string,
  recipe_ingredients: RecipeIngredient[],
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

  if (params.id === 'new') throw redirect(303, '/recipes/new');

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
    const errorBody: ErrorBody = await res.json();
    throw error(res.status, errorBody.message);
  }

  const resBody: ResponseBody = await res.json();
  const recipe = resBody.recipe;

  const unitResBody = await (await fetch(`${API_URL}/units`)).json();
  const units: Unit[] = unitResBody.units;

  const ingredientResBody = await (await fetch(`${API_URL}/ingredients`)).json();
  const ingredients: Ingredient[] = ingredientResBody.ingredients;

  return {
    status: res.status,
    body: {
      recipe,
      units,
      ingredients,
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
    const recipeIngredients = parseIngredients(formData);

f    const recipe = {
      title,
      description,
      body,
      link: link?.length ?? "".length > 0 ? link : "a ",
    }

    const riRes = await fetch(`${API_URL}/recipes/${params.id}/ingredients`, {
      method: 'PATCH',
      body: JSON.stringify(recipeIngredients),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (riRes.status === 401) {
      cookies.delete('token');
      throw redirect(303, '/auth/login'); 
    }

    if (!riRes.ok) {
      const resBody: ErrorBody = await riRes.json();
      return fail(riRes.status, {
        recipeEdit: recipe,
        error: resBody.message,
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
        recipeEdit: recipe,
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

type IngredientFields = "unit" | "ingredient" | "quantity";

const parseIngredients = (formData: FormData) => {
  const ingredients: RecipeIngredient[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('recipe_ingredients')) {
      const [, i, field] = key.split('.');
      const index = parseInt(i);
      const ingredient = ingredients[index] || {};
      switch (field as IngredientFields) {
        case "unit":
          ingredient.unit_id = parseInt(value as string);
          break;
        case "ingredient":
          ingredient.ingredient_id = parseInt(value as string);
          break;
        case "quantity":
          ingredient.quantity = parseFloat(value as string);
          break;
      }
      ingredients[index] = ingredient;
    }
  }

  return {recipe_ingredients: ingredients};
}
