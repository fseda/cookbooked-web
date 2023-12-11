<script lang="ts">
  import { Modal, RecipeEditForm } from '$lib/components';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isLoggedIn } from '$lib/stores/user';
  
	import { cloneDeep } from 'lodash';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import { recipeIsSaving } from '$lib/stores/recipes';
	import type { PageData } from './$types';

  let editModal: Modal;
  let deleteModal: Modal;
  let recipeEditForm: HTMLFormElement;
  let deleteRecipeForm: HTMLFormElement;

  export let data: PageData;
  export let form;

  let recipe = data.body?.recipe;
  let canEdit = data.body?.canEdit;

  $: recipeEdit = form?.body?.recipe ?? cloneDeep(recipe);

  const postprocess = (html: string) => {
    return DOMPurify.sanitize(html);
  }
  const toggleEditModal = (modalId: string) => {
    editModal.toggleModal(modalId);
  }
  
  const toggleDeleteModal = (modalId: string) => {
    deleteModal.toggleModal(modalId);
  }

  const clearRecipeEdit = (e: Event) => {
    recipeEdit = cloneDeep(recipe);
    toggleEditModal('edit-recipe');
  }

  const handleEditRecipeForm = (e: Event) => {
    (recipeEditForm.querySelector('button[type="submit"]') as HTMLButtonElement).click();
  }

  const handleDeleteRecipeForm = () => {
    deleteRecipeForm.submit();
  }

  let tooltipCopy = "Copy to Clipboard";
  const handleCopy = () => {
    navigator.clipboard.writeText($page.url.href);
    tooltipCopy = "Copied!";
  }
</script>

<article>
  <header>
    {#if form?.error}
      <p>{form?.error}</p>
    {/if}
    <div class="main-header">
      <hgroup>
        <h2>{recipeEdit.title}</h2>
        <p>{recipeEdit.description}</p>
      </hgroup>

      <div>
        <p data-tooltip={tooltipCopy} class="share" on:click={handleCopy}>Share</p>
      </div>
    </div>
  </header>
  
  <main>
    {@html marked(recipeEdit.body, { hooks: { preprocess: (markdown) => markdown, postprocess }})}
  </main>

  <footer>
    <nav>
      {#if recipeEdit.link}
        <ul>
          <li>
            <a class="secondary" href={recipeEdit.link} target="_blank">Recipe Reference</a>
          </li>
        </ul>
      {/if}

      {#if $isLoggedIn && canEdit}
        <ul>
          <li>
            <a href={void(0)}
              role="button"
              class="outline"
              data-target="edit-recipe"
              on:click={() => toggleEditModal('edit-recipe')}
            >Edit</a>
          </li>
          <li>
            <a href={void(0)} 
              role="button" 
              class="outline btn-delete"
              data-target="delete-recipe"
              on:click={() => toggleDeleteModal('delete-recipe')}
            >Delete
            </a>          
          </li>
        </ul>
      {/if}
    </nav>
  </footer>
</article>

{#if $isLoggedIn && canEdit}
  <form action="?/delete" hidden
    bind:this={deleteRecipeForm}
    method="post"
    use:enhance={async () => {
      $recipeIsSaving = true;

      return async ({ update }) => {
        await update().finally(async () => {
          $recipeIsSaving = false;
          toggleDeleteModal('delete-recipe');
        });
      }
    }}
  ></form>

  <Modal id="edit-recipe" bind:this={editModal}>
    <div slot="main">
      <RecipeEditForm
        bind:recipeEditForm
        bind:recipeEdit
        on:success={() => toggleEditModal('edit-recipe')}
      />
    </div>

    <a href={void(0)} slot="confirm" 
      class="outline btn-save"
      role="button"
      data-target="edit-recipe"
      on:click={handleEditRecipeForm}
      aria-busy={$recipeIsSaving}
    >
      {#if !$recipeIsSaving} Save {/if}
    </a>
    <a href={void(0)} slot="cancel"
      role="button"
      class="outline secondary"
      data-target="edit-recipe"
      on:click={clearRecipeEdit}
    >Cancel</a>
  </Modal>

  <Modal id="delete-recipe" bind:this={deleteModal}>
    <div slot="main">
      <h2>Delete recipe</h2>
      <p>Are you sure you want to delete this recipe?</p>
      <small class="delete-warning">This is a destructive action.</small>
    </div>

    <a href={void(0)} slot="confirm"
      role="button"
      class="outline btn-delete"
      data-target="delete-recipe"
      on:click={handleDeleteRecipeForm}
      aria-busy={$recipeIsSaving}
    >Delete</a>
  </Modal>
{/if}

<style>
  .main-header {
    display: flex;
    justify-content: space-between;
  }

  .share:hover {
    color: var(--pico-contrast-hover)
  }

  h2 {
    margin: 0 0 1rem 0;
  }

  p {
    margin: 0 0 1rem 0;
  }

  .btn-delete {
    color: red;
    border-color: red;
  }

  .btn-save {
    color: #00A66E;
    border-color: #00A66E;
  }

  nav {
    all: initial;
    display: flex;
    justify-content: space-between;
  }

  .delete-warning {
    color: red;
  }
</style>
