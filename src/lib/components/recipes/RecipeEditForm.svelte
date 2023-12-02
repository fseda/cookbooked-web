<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import type { RecipeDetails } from "$lib/models/Recipe";
	import RecipeFields from "./RecipeFields.svelte";
  import { recipeIsSaving } from "$lib/stores/recipes";
	import { createEventDispatcher } from "svelte";


  export let recipeEdit: RecipeDetails;
  export let recipeEditForm: HTMLFormElement;

  const dispatch = createEventDispatcher();

</script>
<style>
  
</style>

<form 
  action="?/save" 
  method="post" 
  id="recipeEditForm" 
  bind:this={recipeEditForm}
  use:enhance={async () => {
    $recipeIsSaving = true;
    return async ({ update, result }) => {
      await update().finally(async () => {
        $recipeIsSaving = false;
        if (result.type === 'success') {
          dispatch('success');
        }
      });
    }
  }}
>
  <RecipeFields bind:recipe={recipeEdit} loading={$recipeIsSaving} />
  <button type="submit" hidden></button>
</form>