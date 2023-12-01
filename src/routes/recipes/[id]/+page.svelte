<script lang="ts">
  import { Modal, RecipeForm } from '$lib/components';
  import type { Ingredient, RecipeDetails, Unit } from './+page.server';
	import { enhance } from '$app/forms';
	import { isLoggedIn } from '$lib/stores/user';
  
	import { cloneDeep } from 'lodash';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
	import { invalidateAll } from '$app/navigation';
	import { units as unitsStore, ingredients as ingredientsStore } from '$lib/stores/recipes';

  let editModal: Modal;
  let deleteModal: Modal;
  let recipeEditForm: HTMLFormElement;
  let deleteRecipeForm: HTMLFormElement;
  let loading = false;

  export let data;
  export let form;

  let recipe = data.body?.recipe as RecipeDetails;
  // let units = $unitsStore;
  // let ingredients = $ingredientsStore;
  let units = data.body?.units as Unit[];
  let ingredients = data.body?.ingredients as Ingredient[];

  $: recipeEdit = form?.body?.recipe ?? cloneDeep(recipe);

  const postprocess = (html: string) => {
    return DOMPurify.sanitize(html);
  }
  const toggleEditModal = (event: Event) => {
    editModal.toggleModal(event);
  }
  
  const toggleDeleteModal = (event: Event) => {
    deleteModal.toggleModal(event);
  }

  const clearRecipeEdit = (e: Event) => {
    recipeEdit = cloneDeep(recipe);
    toggleEditModal(e);
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
    recipeEdit.recipe_ingredients = recipeEdit.recipe_ingredients.filter((_, i) => i !== index);
  }

  const handleSubmitEditRecipeForm = (e: Event) => {
    (recipeEditForm.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    toggleEditModal(e);
  }

  const handleDeleteRecipeForm = () => {
    deleteRecipeForm.submit();
  }
</script>

<article>
  <header>
    {#if form?.error}
      <p>{form?.error}</p>
    {/if}
    <h2>{recipeEdit.title}</h2>
    <p>{recipeEdit.description}</p>
  </header>
  
  {#if recipeEdit.recipe_ingredients?.length > 0}
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
      <RecipeForm
        bind:recipeEditForm
        bind:recipeEdit
        {units}
        {ingredients}
        {loading}
      />
    </div>

    <a href={void(0)} slot="confirm" 
      id="saveBtn"
      class="outline"
      role="button"
      data-target="edit-recipe"
      on:click={handleSubmitEditRecipeForm}
    >Save</a>
    <a href={void(0)} slot="cancel"
      role="button"
      class="outline secondary"
      data-target="edit-recipe"
      on:click={clearRecipeEdit}
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
