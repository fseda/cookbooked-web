<script lang="ts">
	import { goto } from "$app/navigation";
  import type { RecipeDetails } from "$lib/models/Recipe";
  import { newRecipe } from "$lib/stores/recipes";
  import { resetRecipe } from "$lib/utils/recipes";

  export let recipe: RecipeDetails;
  export let loading = false;
  export let actionBtns = false;

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

<div class="btns">
  {#if actionBtns}
      <nav>
        <ul></ul>
        <ul>
          <li>
            <button type="button" class="outline secondary" on:click={handleCancelCreate} disabled={loading}>Cancel</button>
          </li>
          <li>
            <button type="submit" class="outline btn-save" disabled={loading} aria-busy={loading}>
              {#if !loading} Save {/if}
            </button>
          </li>
        </ul>
      </nav>
  {/if}
</div>

<style>
  .btn-save {
    color: #00A66E;
    border-color: #00A66E;
  }

</style>