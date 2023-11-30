<script lang="ts">
	import { createEventDispatcher } from "svelte";
  import type { Ingredient, RecipeIngredient, Unit } from "../../../routes/recipes/[id]/+page.server";
	import { TrashIcon } from "$lib/components";

  export let recipeIngredient: RecipeIngredient;
  export let units: Unit[];
  export let ingredients: Ingredient[];
  export let index: number;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleIngredientSelect(e: Event) {
    dispatch("ingredientSelect", { index, target: e.target });
  }
  
  function handleUnitSelect(e: Event) {
    dispatch("unitSelect", { index, target: e.target });
  }

  function handleRemove() {
    dispatch("removeIngredient");
  }
</script>

<div style="display:flex; gap:1rem;">
  <div role="group">
    <select 
      required 
      name={`recipe_ingredients.${index}.ingredient`} 
      on:change={(e) => handleIngredientSelect(e)} 
      bind:value={recipeIngredient.ingredient.id}
      {disabled}
    >
      <option value="" disabled selected>Select an ingredient</option>
      {#each ingredients as ingredient (ingredient.id)}
        <option value={ingredient.id}>{ingredient.name}</option>
      {/each}
    </select>
    
    <input type="number" name={`recipe_ingredients.${index}.quantity`} class="quantity" bind:value={recipeIngredient.quantity}>
    
    <select 
      required 
      name={`recipe_ingredients.${index}.unit`}
      on:change={(e) => handleUnitSelect(e)} 
      bind:value={recipeIngredient.unit.id}
      {disabled}
    >
      <option value="" disabled selected>Select an unit</option>
      {#each units as unit (unit.id)}
        <option value={unit.id}>{unit.symbol} ({unit.name})</option>
      {/each}
    </select>

  </div>
  <div class="icon-wrapper" on:click={handleRemove} on:keyup={handleRemove}>
    <TrashIcon />
  </div>
</div>

<style>
  .quantity {
    width: 5rem;
  }

  div[role="group"] {
    width: 100%;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--color-danger);
    color: var(--color-white);
    cursor: pointer;
  }
</style>