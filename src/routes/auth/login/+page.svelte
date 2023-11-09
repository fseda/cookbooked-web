<script lang="ts">
	import { enhance } from "$app/forms";
  import { TextInputField } from "$lib/components";
	import PasswordInputField from "$lib/components/Forms/PasswordInputField.svelte";
	import SubmitBtn from "$lib/components/Forms/SubmitBtn.svelte";
	import { isLoggedIn } from "$lib/stores/user";
  import { isFieldValid, isPasswordValid } from "$lib/validation/input";
	import type { ActionData } from "./$types.js";

  export let data;
  export let form: ActionData;

  let login: string = '';
  let password: string = '';

  $: disableSubmitBtn = !isFieldValid(login) || !isPasswordValid(password);

  $: isLoggedIn.set(!!data.token);
</script>
  

<article class="grid">
  <div>
    <hgroup>
      <h1>Log in</h1>
      <p>Log in to your account. Or <a href="/auth/signup">sign up</a> if you don't have one.</p>
    </hgroup>
    <form method="post" use:enhance>
      <TextInputField
        bind:value={login}
        name="username"
        placeholder="Username or email"
        ariaLabel="Login"
        autocomplete="username"
        errorMsg="Login is required"
        validationFunc={isFieldValid}
        required
      />

      <PasswordInputField 
        style="margin-bottom: 0.2rem;"
        bind:value={password}
        name="password"
        placeholder="Password"
        ariaLabel="Password"
        autocomplete="current-password"
        errorMsg="Password is required"
        validationFunc={isPasswordValid}
        showForgotPassword={true}
        required
      />
      
      <SubmitBtn disabled={disableSubmitBtn} text="Login" />
    </form>
  </div>
</article>

<style>
  article {
    margin: auto;
    max-width: 30rem;
  }
</style>
