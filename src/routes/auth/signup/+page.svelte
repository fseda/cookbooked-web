<script lang="ts">
  import { enhance } from "$app/forms";
  import { PasswordInputField, SubmitBtn, AuthTextInputField } from "$lib/components";
  import { isEmailValid, isNewPasswordConfirmValid, isNewPasswordValid, isUsernameValid } from "$lib/validation/input";
	import { isLoggedIn } from "$lib/stores/user";
	import type { ActionData } from "./$types.js";
	import { fade, fly } from "svelte/transition";

  export let data;
  export let form: ActionData;

  let loading = false;

  let username = form?.username?.toString() ?? '';
  let email = form?.email?.toString() ?? '';
  let password = '';

  let usernameExists = false;
  let emailExists = false;

  let usernameErrMsg = 'Invalid Username. Must be at least 3 characters long. And can contain only letters, numbers, underscores, and a dot.';
  let emailErrMsg = 'Invalid Email';

  $: disableSubmitBtn = 
    !isUsernameValid(username) || 
    !isEmailValid(email) ||
    !isNewPasswordValid(password) ||
    usernameExists || emailExists;
  
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
      
      return async ({ update, result }) => {
        await update().finally(() => loading = false);
        console.log("result", result);
      }
    }}>

      <AuthTextInputField
        bind:value={username}
        name="username"
        placeholder="Username"
        ariaLabel="Username"
        errorMsg={usernameErrMsg}
        validationFunc={isUsernameValid}
        required
        disabled={loading}
        bind:userExists={usernameExists}
      />
      {#if form?.error.username}
        <small transition:fly class="error">{form.error.username}</small>
      {/if}

      <AuthTextInputField
        bind:value={email}
        name="email"
        placeholder="Email"
        ariaLabel="Email"
        errorMsg={emailErrMsg}
        validationFunc={isEmailValid}
        required
        disabled={loading}
        bind:userExists={emailExists}
      />
      {#if form?.error.email}
        <small transition:fly class="error">{form.error.email}</small>
      {/if}

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
        disabled={loading}
      />
      
      <SubmitBtn 
        disabled={disableSubmitBtn || loading}
        {loading}
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
