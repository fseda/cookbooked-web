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
    <div class="container busy-block" aria-busy="true"></div>
{:else if recipes.length === 0}
  <div class="container no-recipes">
    <section style="text-align: center;">
      <h1>You have no Recipes</h1>
      <p>Click the button below to create your first recipe</p>
    </section>
    <section>
      <a href="/recipes/new" role="button">New Recipe</a>
    </section>
  </div>
{:else}
  <section style="display:flex; justify-content: start;">
    <a href="/recipes/new" role="button" class="outline">New Recipe</a>
  </section>    
  <section>
    <div class="grid" transition:fly={{ y: 200, duration: 2000 }}>
      {#each recipes as recipe}
      <article class="recipe-container">
        <a class="recipe-link" href="/recipes/{recipe.id}">
          <hgroup>
            <h4>{recipe.title}</h4>
            <p>{recipe.description}</p>
          </hgroup>
        </a>
      </article>
      {/each}
    </div>
  </section>
  <section style="display:flex; justify-content: start;">
    <a href="/recipes/new" role="button" class="outline">New Recipe</a>
  </section>   
{/if}


<style>
  .busy-block {
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

  .recipe-container {
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .no-recipes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
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

  a.recipe-link {
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
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
</style>