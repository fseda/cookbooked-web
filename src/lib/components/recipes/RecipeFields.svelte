<script lang="ts">
	import { goto } from "$app/navigation";
  import { IngredientFields } from "$lib/components";
  import type { Ingredient, RecipeDetails, Unit } from "$lib/models/Recipe";
  import { units, ingredients, newRecipe } from "$lib/stores/recipes";
  import { resetRecipe } from "$lib/utils/recipes";

  export let recipe: RecipeDetails;
  export let loading = false;
  export let actionBtns = false;

  const addIngredient = () => {
    recipe.recipe_ingredients = [...recipe.recipe_ingredients ?? [], {
      recipe_id: recipe.id,
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
    }];

    // scroll to the bottom of the window
    window.scrollTo(0, document.body.scrollHeight);
    
  }

  const removeIngredient = (index: number) => {
    recipe.recipe_ingredients = recipe.recipe_ingredients.filter((_, i) => i !== index);
  }

  const handleUnitSelect = (event: CustomEvent, index: number) => {
    recipe.recipe_ingredients[index].unit = 
      $units.find((unit: Unit) => unit.id === parseInt((event.detail.target as HTMLSelectElement).value)) ?? 
      recipe.recipe_ingredients[index].unit;
    recipe.recipe_ingredients[index].unit_id = recipe.recipe_ingredients[index].unit.id;
  }

  const handleIngredientSelect = (event: CustomEvent, index: number) => {
    recipe.recipe_ingredients[index].ingredient = 
      $ingredients.find((ingredient: Ingredient) => ingredient.id === 
        parseInt((event.detail.target as HTMLSelectElement).value)) ?? 
        recipe.recipe_ingredients[index].ingredient;

    recipe.recipe_ingredients[index].ingredient_id = recipe.recipe_ingredients[index].ingredient.id;
  }

  const handleCancelCreate = () => {
    goto("/recipes");
    $newRecipe = resetRecipe();
  }

</script>


<label for="title">Title</label>
<input type="text" name="title" id="title" bind:value={recipe.title} disabled={loading}>

<label for="description">Description</label>
<input type="text" name="description" id="description" bind:value={recipe.description} disabled={loading}>

<label for="link">Link</label>
<input type="text" name="link" id="link" bind:value={recipe.link} disabled={loading}>

<label for="body">Body</label>
<textarea name="body" id="body" cols="30" rows="10" bind:value={recipe.body} disabled={loading}></textarea>

{#if recipe?.recipe_ingredients?.length > 0}
  <label for="recipe_ingredients">Ingredients</label>        
  {#each recipe.recipe_ingredients as recipeIngredient, index (index)}
    <IngredientFields 
      bind:recipeIngredient
      units={$units}
      ingredients={$ingredients}
      {index}
      disabled={loading}
      on:ingredientSelect={(e) => handleIngredientSelect(e, index)}
      on:unitSelect={(e) => handleUnitSelect(e, index)}
      on:removeIngredient={() => removeIngredient(index)}
    />
  {/each}
{/if}
<div class="btns">
  <button 
    class="outline btn-add-ingredient"
    on:click={addIngredient}  
    disabled={loading}
  >
    Add Ingredient
  </button>

  {#if actionBtns}
    <div class="action-btns">
      <button type="button" class="outline secondary" on:click={handleCancelCreate} disabled={loading}>Cancel</button>
      <button type="submit" class="outline btn-save" disabled={loading} aria-busy={loading}>
        {#if !loading} Save {/if}
      </button>
    </div>
  {/if}

</div>

<style>
  .btns {
    display: flex;
    justify-content: space-between;
  }

  .btn-save {
    color: #00A66E;
    border-color: #00A66E;
  }

  .btn-add-ingredient {
    margin-bottom: 1rem;
  }
</style>