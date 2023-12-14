<script>
  import GHL from '$lib/assets/github/github-logo.png';
  import GHLW from '$lib/assets/github/github-logo-white.png';
  import { theme } from '$lib/stores/theme';

  export let reversed = false;
</script>

{#if reversed}
  <img src={$theme === 'dark' ? GHL : GHLW} alt="GitHub Logo" class="github-logo">
{:else}
  <img src={$theme === 'dark' ? GHLW : GHL} alt="GitHub Logo" class="github-logo">
{/if}

<style>
  .github-logo {
    width: 3.5rem;
  }
</style>