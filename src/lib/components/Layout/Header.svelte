<script lang="ts">
	import { isLoggedIn } from "$lib/stores/user";

  let loggedIn: boolean;
  $: loggedIn = $isLoggedIn;
</script>

<header class="container-fluid">
  <nav class="container-fluid">
    <ul>
      <li><a href="/" class="secondary"><strong>👨‍🍳🥩 CookBooked</strong></a></li>
    </ul>
    <details role="list" dir="rtl">
      <summary aria-haspopup="listbox" role="button" class="outline">&#9776;</summary>
      <ul role="listbox">
        {#if loggedIn}
          <li><a href="/me" class="secondary">Profile</a></li>
          <li><a href="/me/recipes" class="secondary">My Recipes</a></li>
          <li><a href="/auth/logout" class="secondary">Log out</a></li>
        {:else}
          <li><a href="/auth/login" class="secondary">Log in</a></li>
          <li><a href="/auth/signup" class="secondary">Sign up</a></li>
        {/if}
      </ul>
    </details>
  </nav>
</header>

<style>
  header {
    padding: 1rem 0;
  }

  details {
    width: 2.5rem;
  }

  details > summary {
    /* display: block; */
    justify-content: center;
    line-height: 1.5rem;
  }

  details > summary::after {
    display: none;
  }
</style>