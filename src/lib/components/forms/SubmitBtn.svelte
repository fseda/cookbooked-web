<script lang="ts">
  export let disabled: boolean;
  export let loading: boolean = false;
</script>

<button   
  id="submitBtn"
  type="submit" 
  class="primary outline" 
  aria-busy={loading} 
  {disabled}
>
  {#if !loading}
    <slot/>
  {/if}
</button>

<style>
  #submitBtn[disabled] {
    cursor: not-allowed;
    pointer-events: all !important;
  }
</style>

