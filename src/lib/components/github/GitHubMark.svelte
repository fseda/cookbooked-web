<script>
  import GHM from '$lib/assets/github/github-mark.svg';
  import GHMW from '$lib/assets/github/github-mark-white.svg';
  import { theme } from '$lib/stores/theme';

  export let reversed = false;
</script>

{#if reversed}
  <img src={$theme === 'dark' ? GHM : GHMW} alt="GitHub Mark" class="github-icon">
{:else}
  <img src={$theme === 'dark' ? GHMW : GHM} alt="GitHub Mark" class="github-icon">
{/if}

<style>
  .github-icon {
    width: 32px;
    height: 32px;
  }
</style>
