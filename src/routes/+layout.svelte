<script lang="ts">
	import Footer from "$lib/components/Layout/Footer.svelte";
	import Header from "$lib/components/Layout/Header.svelte";
	import { isLoggedIn } from "$lib/stores/user";
  import "../app.css";
  import "@picocss/pico";

  export let data;

  $: console.log("token in layout", data.token);
  $: console.log("is logged in in layout", $isLoggedIn);

  $: isLoggedIn.set(!!data.token);
</script>

<Header/>

<main class="container">
  <slot />
</main>

<Footer/>