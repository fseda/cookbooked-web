<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Recipe } from './+page.server.ts';

  export let data;
  let recipes: Recipe[] = [];
  let loading = true;

  $: if (data && data.body?.recipes) {
    setTimeout(() => {
      
      recipes = data.body?.recipes as Recipe[];
      loading = false;
    }, 100)
  }
</script>
  {#if loading}
      <div class="container busyBlock" aria-busy="true"></div>
  {:else if recipes.length === 0}
    <div class="container">
      <h1>You have no Recipes</h1>
      <p>Click the button below to create your first recipe</p>
      <a href="/recipes/new" class="button">Create Recipe</a>
    </div>
  {:else}
    <div class="grid" transition:fly={{ y: 200, duration: 2000 }}>
      {#each recipes as recipe}
        <article class="recipeContainer">
          <a href="/recipes/{recipe.id}">
            <hgroup>
              <h4>{recipe.title}</h4>
              <p>{recipe.description}</p>
            </hgroup>
          </a>
        </article>
      {/each}
    </div>
  {/if}


<style>
  .busyBlock {
    width: 100%;
    height: 100%;
    /* background-image: linear-gradient(90deg, #fff, #f2f2f2, #fff); */
    background-size: 200%;
    /* animation: loading 1.5s ease-in-out infinite; */
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .recipeContainer {
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  hgroup {
    margin-bottom: 0.5rem;
  }

  article {
    margin: 0;
    max-height: 20rem;
  }

  h4 {
    word-break: break-word;
    margin: 0 0 0.5rem 0;
  }

  a {
    text-decoration: none;
    color: inherit; 
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  p {
    text-decoration: none;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* Number of lines you want to display */
    -webkit-box-orient: vertical;
  }
</style>