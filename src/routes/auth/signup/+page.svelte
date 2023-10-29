<script lang="ts">
  import { enhance } from "$app/forms";
  import { TextInputField, PasswordInputField, SubmitBtn } from "$lib/components";
  import { isEmailValid, isNewPasswordConfirmValid, isNewPasswordValid, isUsernameValid } from "$lib/validation/input";
	import { isLoggedIn } from "$lib/stores/user";

  export let data;

  let username: string = '';
  let email: string = '';
  let password: string = '';
  let passwordConfirm: string = '';

  $: disableSubmitBtn = 
    !isUsernameValid(username) || 
    !isEmailValid(email) ||
    !isNewPasswordValid(password);
    //||
    // !isNewPasswordConfirmValid(password, passwordConfirm);

    function validatePasswordMatch(event: Event) {
      const field = event.target as HTMLInputElement;
      const passMatch = isNewPasswordConfirmValid(password, passwordConfirm);
      field.setAttribute('aria-invalid', `${!passMatch}`);
    };

  isLoggedIn.set(!!data.token);
</script>
  

<article class="grid">
  <div>
    <hgroup>
      <h1>Create an account</h1>
      <h2>Create a new account to manage your recipes</h2>
    </hgroup>
    <form method="post" use:enhance>
      <!-- {#if form?.error}
        <p class="error">{JSON.stringify(form.error)}</p>
      {/if} -->

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

      <div class="grid">
        <PasswordInputField 
          style="margin-bottom: 0.2rem;"
          bind:value={password}
          bind:valueConfirm={passwordConfirm}
          name="password"
          placeholder="Password"
          ariaLabel="Confirm Password"
          autocomplete="current-password"
          errorMsg="Invalid Password. Must be at least 4 characters."
          validationFunc={isNewPasswordValid}
          validationDelay={1000}
          required
        />

        <!-- <PasswordInputField 
          style="margin-bottom: 0.2rem;"
          bind:value={passwordConfirm}
          bind:valueConfirm={password}
          name="password"
          placeholder="Confirm password"
          ariaLabel="Confirm password"
          autocomplete="current-password"
          errorMsg="Passwords do not match"
          validationFunc={isNewPasswordValid}
          required
        /> -->
      </div>
      
      <SubmitBtn disabled={disableSubmitBtn} text="Signup" />
    </form>
  </div>
</article>

<style>
  article {
    margin: auto;
    max-width: 30rem;
  }
</style>
