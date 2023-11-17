<script lang="ts">
	import { isLoggedIn } from "$lib/stores/user";

  let loggedIn: boolean;
  $: loggedIn = $isLoggedIn;
</script>

<header>
  <nav class="container-fluid">
    <ul>
      <li><a href="/" class="secondary"><strong>👨‍🍳🥩 CookBooked</strong></a></li>
    </ul>
    <ul>
      <li>
        <details class="dropdown">
          <summary>Menu</summary>
          <ul dir="rtl">
            {#if loggedIn}
              <li><a href="/me" class="secondary">Profile</a></li>
              <li><a href="/recipes" class="secondary">My Recipes</a></li>
              <li><a href="/auth/logout" class="secondary">Log out</a></li>
            {:else}
              <li><a href="/auth/login" class="secondary">Log in</a></li>
              <li><a href="/auth/signup" class="secondary">Sign up</a></li>
            {/if}
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    padding: 1rem 0;
  }
</style>