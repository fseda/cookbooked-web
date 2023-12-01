<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Ingredient, RecipeDetails, Unit } from "$lib/models/Recipe";
	import { IngredientFields } from "..";
  export let recipeEdit: RecipeDetails;
  export let loading: boolean = false;
  export let recipeEditForm: HTMLFormElement;
  export let units: Unit[];
  export let ingredients: Ingredient[];

  const addIngredient = () => {
    recipeEdit.recipe_ingredients = [...recipeEdit.recipe_ingredients ?? [], {
      recipe_id: recipeEdit.id,
      ingredient_id: 0,
      unit_id: 0,
      ingredient: {
        id: 0,
        name: '',
        icon: ''
      },
      quantity: 0,
      unit: {
        id: 0,
        name: '',
        symbol: ''
      }
    }]
  }

  const removeIngredient = (index: number) => {
    recipeEdit.recipe_ingredients = recipeEdit.recipe_ingredients.filter((_, i) => i !== index);
  }

  const handleUnitSelect = (event: CustomEvent, index: number) => {
    recipeEdit.recipe_ingredients[index].unit = 
      units.find((unit) => unit.id === parseInt((event.detail.target as HTMLSelectElement).value)) ?? 
      recipeEdit.recipe_ingredients[index].unit;
    recipeEdit.recipe_ingredients[index].unit_id = recipeEdit.recipe_ingredients[index].unit.id;
  }

  const handleIngredientSelect = (event: CustomEvent, index: number) => {
    recipeEdit.recipe_ingredients[index].ingredient = 
      ingredients.find((ingredient) => ingredient.id === 
        parseInt((event.detail.target as HTMLSelectElement).value)) ?? 
        recipeEdit.recipe_ingredients[index].ingredient;

    recipeEdit.recipe_ingredients[index].ingredient_id = recipeEdit.recipe_ingredients[index].ingredient.id;
  }
</script>
<style>
  
</style>

<form 
  action="?/save" 
  method="post" 
  id="recipeEditForm" 
  bind:this={recipeEditForm}
  use:enhance={async () => {
    loading = true;

    return async ({ update }) => {
      await update().finally(() => {
        loading = false;
      });
    }
  }}
>
  <label for="title">Title</label>
  <input type="text" name="title" id="title" bind:value={recipeEdit.title} disabled={loading}>

  <label for="description">Description</label>
  <input type="text" name="description" id="description" bind:value={recipeEdit.description} disabled={loading}>

  <label for="link">Link</label>
  <input type="text" name="link" id="link" bind:value={recipeEdit.link} disabled={loading}>

  <label for="body">Body</label>
  <textarea name="body" id="body" cols="30" rows="10" bind:value={recipeEdit.body} disabled={loading}></textarea>

  {#if recipeEdit.recipe_ingredients?.length > 0}
    <label for="recipe_ingredients">Ingredients</label>        
    {#each recipeEdit.recipe_ingredients as recipeIngredient, index (index)}
      <IngredientFields 
        bind:recipeIngredient
        {units}
        {ingredients}
        {index}
        disabled={loading}
        on:ingredientSelect={(e) => handleIngredientSelect(e, index)}
        on:unitSelect={(e) => handleUnitSelect(e, index)}
        on:removeIngredient={() => removeIngredient(index)}
      />
    {/each}
  {/if}
  <button 
    class="outline"
    on:click={addIngredient}  
    disabled={loading}
  >
    Add Ingredient
  </button>
  <button type="submit" hidden></button>
</form>