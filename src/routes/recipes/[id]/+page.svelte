<script lang="ts">
  import type { RecipeDetails } from './+page.server';
  
  export let data;
  let recipe: RecipeDetails = data.body?.recipe as RecipeDetails;
</script>

<article>
  <header>
    <h2>{recipe.title}</h2>
    <p>{recipe.description}</p>
  </header>
  
  <section>
    <h3>Ingredients</h3>
    <ul>
      {#each recipe.recipe_ingredients as recipeIngredient}
        <li>
          <!-- <img src={recipeIngredient.ingredient.icon} alt={recipeIngredient.ingredient.name} /> -->
          <p><b>{recipeIngredient.ingredient.name}</b> - {recipeIngredient.quantity} {recipeIngredient.unit.symbol}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Instructions</h3>
    {@html recipe.body} <!-- Use {@html} to render HTML from a string -->
  </section>

  {#if recipe.link}
    <footer>
      <nav>
        <ul>
          <li>
            <a href={recipe.link} target="_blank">Recipe Reference</a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/recipes/{recipe.id}/edit" role="button" class="outline">Edit</a>
          </li>
          <li>
            <a id="deleteBtn" href="/recipes/{recipe.id}/delete" role="button" class="outline">Delete</a>
          </li>
        </ul>
      </nav>
    </footer>
  {/if}
</article>

<style lang="scss">
  h2 {
    margin: 0 0 1rem 0;
  }

  p {
    margin: 0 0 1rem 0;
  }

  #deleteBtn {
    color: red;
    border-color: red;
  }
</style>
