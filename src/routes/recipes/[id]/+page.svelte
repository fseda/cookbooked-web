<script lang="ts">
  import type { Ingredient, RecipeDetails, Unit } from './+page.server';
	import Modal from '$lib/components/recipes/Modal.svelte';
	import IngredientFields from '$lib/components/recipes/Ingredient.svelte';
	import { enhance } from '$app/forms';
	import { isLoggedIn } from '$lib/stores/user';
  
	import { cloneDeep } from 'lodash';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
	import { invalidateAll } from '$app/navigation';

  let editModal: Modal;
  let deleteModal: Modal;
  let editRecipeForm: HTMLFormElement;
  let deleteRecipeForm: HTMLFormElement;
  let loading = false;

  export let data;
  export let form;

  let recipe = data.body?.recipe as RecipeDetails;
  let units = data.body?.units as Unit[];
  let ingredients = data.body?.ingredients as Ingredient[];

  // $: recipeEdit = form?.recipeEdit ?? cloneDeep(recipe);
  $: recipeEdit = cloneDeep(recipe);

  const postprocess = (html: string) => {
    return DOMPurify.sanitize(html);
  }
  const toggleEditModal = (event: Event) => {
    editModal.toggleModal(event);
  }
  
  const toggleDeleteModal = (event: Event) => {
    deleteModal.toggleModal(event);
  }

  const clearEditRecipe = () => {
    recipeEdit = cloneDeep(recipe);
  }

  const addIngredient = () => {
    recipeEdit.recipe_ingredients = [...recipeEdit.recipe_ingredients, {
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
    }]
  }

  const removeIngredient = (index: number) => {
    console.log("Removing ingredient")
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

  const handleSubmitEditRecipeForm = () => {
    editRecipeForm.submit();
  }

  const handleDeleteRecipeForm = () => {
    deleteRecipeForm.submit();
  }

  // function removeIngredient(event: Event) {
  //   recipe.recipe_ingredients = 
  // }
</script>

<article>
  <header>
    {#if form?.error}
      <p>{form?.error}</p>
    {/if}
    <h2>{recipeEdit.title}</h2>
    <p>{recipeEdit.description}</p>
  </header>
  
  {#if recipeEdit.recipe_ingredients.length > 0}
    <section>
      <h3>Ingredients</h3>
      <ul>
        {#each recipeEdit.recipe_ingredients as recipeIngredient}
          <li>
            <!-- <img src={recipeIngredient.ingredient.icon} alt={recipeIngredient.ingredient.name} /> -->
            <p><b>{recipeIngredient.ingredient.name}</b> <kbd>{recipeIngredient.quantity} {recipeIngredient.unit.symbol}</kbd></p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <section>
    <h3>Instructions</h3>
    {@html marked(recipeEdit.body, { hooks: { preprocess: (markdown) => markdown, postprocess }})}
  </section>

  <footer>
    <nav>
      {#if recipeEdit.link}
        <ul>
          <li>
            <a class="secondary" href={recipeEdit.link} target="_blank">Recipe Reference</a>
          </li>
        </ul>
      {/if}

      {#if $isLoggedIn}
        <ul>
          <li>
            <a href={void(0)}
              role="button"
              class="outline"
              data-target="edit-recipe"
              on:click={toggleEditModal}
            >Edit</a>
          </li>
          <li>
            <a id="deleteBtn" href={void(0)} 
              role="button" 
              class="outline"
              data-target="delete-recipe"
              on:click={toggleDeleteModal}
            >Delete
            </a>          
          </li>
        </ul>
      {/if}
    </nav>
  </footer>
</article>

{#if $isLoggedIn}
  <form action="?/delete" hidden
    bind:this={deleteRecipeForm}
    method="post"
    on:submit={() => console.log("form submitted")}
    use:enhance={async () => {
      loading = true;

      return async ({ update }) => {
        await update().finally(async () => {
          loading = false;

          await invalidateAll();
        });
      }
    }}
  ></form>

  <Modal id="edit-recipe" bind:this={editModal} {loading}>
    <div slot="main">
      <form 
        action="?/save" 
        method="post" 
        id="editRecipeForm" 
        bind:this={editRecipeForm}
        on:submit={() => console.log("form submitted")}
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

        {#if recipeEdit.recipe_ingredients.length > 0}
          <label for="recipe_ingredients">Ingredients</label>        
          {/if}
        {#each recipeEdit.recipe_ingredients as recipeIngredient, index (index)}
          <IngredientFields 
            bind:recipeIngredient 
            {units}
            {ingredients}
            {index}
            disabled={loading}
            on:ingredientSelect={(e) => handleIngredientSelect(e, index)}
            on:unitSelect={(e) => handleUnitSelect(e, index)}
          />
        {/each}
        <button 
          class="outline"
          on:click={addIngredient}  
          disabled={loading}
        >
          Add Ingredient
        </button>
      </form>
    </div>

    <a href={void(0)} slot="confirm" 
      id="saveBtn"
      class="outline"
      role="button"
      data-target="edit-recipe"
      on:click={handleSubmitEditRecipeForm}
      on:click={toggleEditModal}
    >Save</a>
    <a href={void(0)} slot="cancel"
      role="button"
      class="outline secondary"
      data-target="edit-recipe"
      on:click={toggleEditModal}
      on:click={clearEditRecipe}
    >Cancel</a>
  </Modal>

  <Modal id="delete-recipe" bind:this={deleteModal} {loading}>
    <div slot="main">
      <h2>Delete recipe</h2>
      <p>Are you sure you want to delete this recipe?</p>
      <small class="delete-warning">This is a destructive action.</small>
    </div>

    <a href={void(0)} slot="confirm"
      role="button"
      class="outline btn-confirm-delete"
      data-target="delete-recipe"
      on:click={handleDeleteRecipeForm}
    >Delete</a>
  </Modal>
{/if}

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
    justify-content: space-between;
    // align-items: right;
  }

  .delete-warning {
    color: red;
  }

  .btn-confirm-delete {
    color: red;
    border-color: red;
  }
</style>
