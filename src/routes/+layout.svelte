<script lang="ts">
	import Footer from "$lib/components/layout/Footer.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import { isLoggedIn } from "$lib/stores/user";
	import { onMount } from "svelte";
  import "../app.css";
  import "@picocss/pico";
	import { browser } from "$app/environment";

  export let data;
  $: isLoggedIn.set(!!data.token);

  const handleTouchMove = (e: TouchEvent) => {
    const touchEvent = e as TouchEvent & { scale?: number };
    if (touchEvent.scale && touchEvent.scale !== 1) {
      e.preventDefault();
    }
  }

  onMount(() => {
    if (browser) 
      window.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        if (browser) 
          window.removeEventListener('touchmove', handleTouchMove);
      }
  })
</script>

<Header/>

<main class="container">
  <slot />
</main>

<!-- <Footer/> -->