<script lang="ts">
  import { enhance } from "$app/forms";
  import { TextInputField, PasswordInputField, SubmitBtn } from "$lib/components";
  import { isEmailValid, isNewPasswordConfirmValid, isNewPasswordValid, isUsernameValid } from "$lib/validation/input";
	import { isLoggedIn } from "$lib/stores/user";
	import type { ActionData } from "./$types.js";

  export let data;
  export let form: ActionData;

  let loading = false;

  let username = '';
  let email = '';
  let password = '';

  $: disableSubmitBtn = 
    !isUsernameValid(username) || 
    !isEmailValid(email) ||
    !isNewPasswordValid(password);
  
  $: isLoggedIn.set(!!data.token);
</script>
  

<article class="grid">
  <div>
    <hgroup>
      <h1>Create an account</h1>
      <h2>Create a new account to manage your recipes</h2>
    </hgroup>
    <form method="post" use:enhance={() => {
      loading = true;
      
      return async ({ update }) => {
        await update();
        loading = false;
      }
    }}>
      {#if form?.error}
        <small class="error">{form.error.message}</small>
      {/if}

      <TextInputField
        bind:value={username}
        name="username"
        placeholder="Username"
        ariaLabel="Username"
        autocomplete="username"
        errorMsg="Invalid Username. Must be at least 3 characters long. And can contain only letters, numbers, underscores, and a dot."
        validationFunc={isUsernameValid}
        validationDelay={1000}
        required
      />

      <TextInputField
        bind:value={email}
        name="email"
        placeholder="Email"
        ariaLabel="Email"
        autocomplete="email"
        errorMsg="Invalid Email"
        validationFunc={isEmailValid}
        validationDelay={1000}
        required
      />

      <PasswordInputField 
        style="margin-bottom: 0.2rem;"
        bind:value={password}
        name="password"
        placeholder="Password"
        ariaLabel="Confirm Password"
        autocomplete="current-password"
        errorMsg="Invalid Password. Must have at least 4 characters."
        validationFunc={isNewPasswordValid}
        validationDelay={1000}
        required
      />
      
      <SubmitBtn 
        disabled={disableSubmitBtn}
        loading={loading}
      >Signup</SubmitBtn>
    </form>
  </div>
</article>

<style>
  article {
    margin: auto;
    max-width: 30rem;
  }

  .error {
    color: red;
  }
</style>
