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