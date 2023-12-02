import type { RecipeDetails } from "$lib/models/Recipe"

export const resetRecipe = (): RecipeDetails => {
  return {
    id: 0,
    title: '',
    description: '',
    link: '',
    body: '',
    recipe_ingredients: [],
  }
}