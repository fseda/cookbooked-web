<script lang="ts">
	import { authenticated } from "$lib/stores/user";

  let loggedIn: boolean;
  $: loggedIn = $authenticated;
</script>

<header>
  <nav class="container-fluid">
    <ul>
      <li><a href="/" class="secondary"><strong>👨‍🍳🥩 CookBooked</strong></a></li>
    </ul>
    <ul>
      <li>
        <details class="dropdown mobile-only">
          <summary>Menu</summary>
          <ul dir="rtl">
            {#if loggedIn}
              <li><a href="/recipes" class="secondary">My Recipes</a></li>
              <li><a href="/me" class="secondary">Profile</a></li>
              <li><a href="/auth/logout" class="secondary">Log out</a></li>
            {:else}
              <li><a href="/auth/login" class="secondary">Log in</a></li>
              <li><a href="/auth/signup" class="secondary">Sign up</a></li>
            {/if}
          </ul>
        </details>

        <ul class="desktop-only">
          {#if loggedIn}
          <li><a href="/recipes" role="button" class="secondary">My Recipes</a></li>
            <li><a href="/me" role="button" class="secondary">Profile</a></li>
            <li><a href="/auth/logout" class="secondary">Log out</a></li>
          {:else}
            <li><a href="/auth/login" class="secondary">Log in</a></li>
            <li><a href="/auth/signup" class="secondary">Sign up</a></li>
          {/if}
        </ul>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    padding: 1rem 0;
  }

  .mobile-only {
    display: inline-block;
  }

  .desktop-only {
    display: none;
  }

  @media (min-width: 768px) {
    .mobile-only {
      display: none;
    }

    .desktop-only {
      display: block;
    }
  }
</style>