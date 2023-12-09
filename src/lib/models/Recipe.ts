export type RecipeDetails = {
  id: number,
  title: string,
  description: string,
  body: string,
  link: string,
}

export type ResponseBody = {
  recipe: RecipeDetails,
}

export type ErrorBody = {
  success: boolean,
  message: string,
}
