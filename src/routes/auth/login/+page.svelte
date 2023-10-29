<script lang="ts">
	import { enhance } from "$app/forms";
  import { TextInputField } from "$lib/components";
	import PasswordInputField from "$lib/components/Forms/PasswordInputField.svelte";
	import SubmitBtn from "$lib/components/Forms/SubmitBtn.svelte";
	import { isLoggedIn } from "$lib/stores/user";
  import { isFieldValid, isPasswordValid } from "$lib/validation/input";

  export let data;

  let login: string = '';
  let password: string = '';

  $: disableSubmitBtn = !isFieldValid(login) || !isPasswordValid(password);

  isLoggedIn.set(!!data.token);
</script>
  

<article class="grid">
  <div>
    <hgroup>
      <h1>Log in</h1>
      <h2>Log in to your account</h2>
    </hgroup>
    <form method="post" use:enhance>
      <TextInputField
        bind:value={login}
        name="username"
        placeholder="Username or email"
        ariaLabel="Login"
        autocomplete="username"
        errorMsg="Invalid Login"
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
        errorMsg="Invalid Password"
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
