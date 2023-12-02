<script>
	import { RecipeForm } from "$lib/components";

  export let form;
</script>

{#if form?.error}
  <p>{form?.error}</p>
{/if}

<h1>New Recipe</h1>
<section>
  <RecipeForm loading={false}></RecipeForm>
</section>
