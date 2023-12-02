import { browser } from "$app/environment";
import type { Ingredient, RecipeDetails, Unit } from "$lib/models/Recipe";
import { writable } from "svelte/store";

const apiURL = import.meta.env.VITE_API_URL

export const units = writable<Unit[]>([]);
export const ingredients = writable<Ingredient[]>([]);

export const fetchUnits = async () => {
  const { subscribe, set } = units;
  let currentUnits: Unit[] = [];
  subscribe((value: Unit[]) => currentUnits = value);

  if (currentUnits.length > 0) return;

  if (!browser) return;
  
  const res = await fetch(`${apiURL}/units`);
  if (!res.ok) return;

  const { units: fetchedUnits } = await res.json();
  set(fetchedUnits);
}

export const fetchIngredients = async () => {
  const { subscribe, set } = ingredients;
  let currentIngredients: Ingredient[] = [];
  subscribe((value: Ingredient[]) => currentIngredients = value);

  if (currentIngredients.length > 0) return;

  if (!browser) return;
  
  const res = await fetch(`${apiURL}/ingredients`);
  if (!res.ok) return;
  
  const { ingredients: fetchedIngredients } = await res.json();
  set(fetchedIngredients);
}

export const newRecipe = writable<RecipeDetails>({
  id: 0,
  title: '',
  description: '',
  body: '',
  link: '',
  recipe_ingredients: [],
});

export const recipeIsSaving = writable(false);
