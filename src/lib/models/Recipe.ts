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

type IngredientFields = "unit" | "ingredient" | "quantity";

export const parseIngredients = (formData: FormData) => {
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