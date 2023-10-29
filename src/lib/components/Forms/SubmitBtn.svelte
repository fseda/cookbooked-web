<script lang="ts">
  export let disabled: boolean;
  export let text: string = "Submit";
</script>

<button   
  id="submitBtn"
  type="submit" 
  class="primary outline" 
  {disabled}
>{text}</button>

<style>
  #submitBtn[disabled] {
    cursor: not-allowed;
    pointer-events: all !important;
  }
</style>

