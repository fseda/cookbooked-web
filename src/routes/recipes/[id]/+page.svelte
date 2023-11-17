<script lang="ts">
  import type { RecipeDetails, Unit } from './+page.server';
	import Modal from '$lib/components/recipes/Modal.svelte';
	import { modals } from '$lib/stores/modal';
  
  let editModal: Modal;
  let deleteModal: Modal;

  export let data;
  let recipe = data.body?.recipe as RecipeDetails;
  let units = data.body?.units as Unit[];

  let recipeEdit = {...recipe};

  // function openEditModal() {
  //   modals.open('edit-recipe');
  // }

  // function closeEditModal() {
  //   modals.close('edit-recipe');
  // }

  function handleEditModal(event: Event) {
    editModal.toggleModal(event);
  }

  function clearEditRecipe() {
    console.log("clear edit reciope")
    console.log(recipe);
    recipeEdit = {...recipe};
  }

  function handleDeleteModal(event: Event) {
    deleteModal.toggleModal(event);
  }

  function addIngredient() {
    console.log("Adding ingredient")
    recipeEdit.recipe_ingredients = [...recipeEdit.recipe_ingredients, {
      recipe_id: recipe.id,
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

  // function removeIngredient(event: Event) {
  //   recipe.recipe_ingredients = 
  // }
</script>

<article>
  <header>
    <h2>{recipeEdit.title}</h2>
    <p>{recipeEdit.description}</p>
  </header>
  
  <section>
    <h3>Ingredients</h3>
    <ul>
      {#each recipeEdit.recipe_ingredients as recipeIngredient}
        <li>
          <!-- <img src={recipeIngredient.ingredient.icon} alt={recipeIngredient.ingredient.name} /> -->
          <p><b>{recipeIngredient.ingredient.name}</b> - {recipeIngredient.quantity} {recipeIngredient.unit.symbol}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Instructions</h3>
    {@html recipeEdit.body} <!-- Use {@html} to render HTML from a string -->
  </section>

  <footer>
    <nav>
      {#if recipe.link}
        <ul>
          <li>
            <a href={recipe.link} target="_blank">Recipe Reference</a>
          </li>
        </ul>
      {/if}
      <ul>
        <li>
          <a href="#"
            role="button"
            class="outline"
            data-target="edit-recipe"
            on:click={handleEditModal}
          >Edit</a>
        </li>
        <li>
          <a id="deleteBtn" href="#" 
            role="button" 
            class="outline"
            data-target="delete-recipe"
            on:click={handleDeleteModal}
          >Delete
          </a>          
        </li>
      </ul>
    </nav>
  </footer>
</article>


<Modal id="edit-recipe" bind:this={editModal}>
  <div slot="main">
    <form action="">
      <label for="title">Title</label>
      <input type="text" name="title" id="title" bind:value={recipeEdit.title}>

      <label for="description">Description</label>
      <input type="text" name="description" id="description" bind:value={recipeEdit.description}>

      <label for="link">Link</label>
      <input type="text" name="link" id="link" bind:value={recipeEdit.link}>

      <label for="body">Body</label>
      <textarea name="body" id="body" cols="30" rows="10" bind:value={recipeEdit.body}></textarea>

      <label for="recipe_ingredients">Ingredients</label>
      {#each recipeEdit.recipe_ingredients as recipeIngredient, index (index)}
        <div role="group">
          <input type="text" name="ingredient" class="ingredient" id={recipeIngredient.ingredient.id.toString()} bind:value={recipeIngredient.ingredient.name}>
          <input type="text" name="quantity" class="quantity" bind:value={recipeIngredient.quantity}>
          <select required bind:value={recipeIngredient.unit.id}>
            <!-- {#if recipeEdit.recipe_ingredients[index].unit.id == 0}
              <option value="" disabled selected>Select a unit</option>
            {/if} -->
            {#each units as unit (unit.id)}
              <option value={unit.id}>{unit.symbol} ({unit.name})</option>
            {/each}
          </select>
        </div>
      {/each}
      <button 
        class="outline"
        on:click={addIngredient}  
      >
        Add Ingredient
      </button>
    </form>
  </div>

  <a href="#save" slot="confirm" 
    id="saveBtn"
    class="outline"
    role="button"
    data-target="edit-recipe"
    on:click={handleEditModal}
  >Save</a>
  <a href="#cancel" slot="cancel"
    role="button"
    class="outline secondary"
    data-target="edit-recipe"
    on:click={handleEditModal}
    on:click={clearEditRecipe}
  >Cancel</a>
</Modal>
<Modal id="delete-recipe" bind:this={deleteModal}></Modal>


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

  #saveBtn {
    color: #00A66E;
    border-color: #00A66E;
    // background-color: #00A66E;
  }

  nav {
    all: initial;
    display: flex;
    justify-content: right;
  }

  .quantity {
    width: 5rem;
  }
</style>
