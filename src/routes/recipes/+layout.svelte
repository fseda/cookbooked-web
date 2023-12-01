<script>
	import { fetchIngredients, fetchUnits } from "$lib/stores/recipes";
	import { onMount } from "svelte";

    onMount(async () => {
    await fetchUnits();
    await fetchIngredients();
  });
</script>

<slot></slot>