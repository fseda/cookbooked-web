<script lang="ts">
	import { enhance } from "$app/forms";
	import type { RecipeDetails } from "$lib/models/Recipe";
  import { RecipeFields } from "$lib/components";
  import { newRecipe } from "$lib/stores/recipes";
	import { resetRecipe } from "$lib/utils/recipes";
	import { goto } from "$app/navigation";

  export let loading: boolean = false;
</script>

<form 
  action="?/save" 
  method="post" 
  id="recipeForm" 
  use:enhance={async () => {
    loading = true;

    return async ({ update, result }) => {
      await update().finally(async () => {
        loading = false; 
        if (result.type === 'success') {
          $newRecipe = resetRecipe();
          goto(`${result.data?.location}`);
        }
      });
    }
  }}
>

  <RecipeFields actionBtns bind:recipe={$newRecipe} {loading} />
</form>
