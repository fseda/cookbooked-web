<script lang="ts">
  import { page } from '$app/stores';

</script>

<div>
  <span>{$page.status} - {$page.error?.message}</span>
  <a href="/">Homepage</a>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 2rem;
    font-weight: bold;
    color: red;
  }
</style>
