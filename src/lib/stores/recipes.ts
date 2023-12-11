import type { RecipeDetails } from "$lib/models/Recipe";
import { writable } from "svelte/store";

export const newRecipe = writable<RecipeDetails>({
  id: 0,
  title: '',
  description: '',
  body: '',
  link: '',
});

export const recipeIsSaving = writable(false);
