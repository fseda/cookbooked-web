<script lang="ts">
	import { enhance } from "$app/forms";
  import { LoginTextInputField, PasswordInputField } from "$lib/components";
	import SubmitBtn from "$lib/components/forms/SubmitBtn.svelte";
	import { authenticated } from "$lib/stores/user";
  import { isFieldValid, isPasswordValid } from "$lib/validation/input";
	import { fade, fly } from "svelte/transition";
	import type { ActionData, PageData } from "./$types.js";
	import { goto } from "$app/navigation";
	import GitHubMark from "$lib/components/github/GitHubMark.svelte";
	import GitHubLogo from "$lib/components/github/GitHubLogo.svelte";
	import { browser } from '$app/environment';
	import AuthTextInputField from "$lib/components/forms/AuthTextInputField.svelte";

  export let data: PageData;
  export let form: ActionData;
  
  let loading = false;
  let githubLoading = false;

  let login: string = '';
  let password: string = '';

  $: disableSubmitBtn = !isFieldValid(login) || !isPasswordValid(password);
  $: $authenticated = !!data.token;
</script>
  
{#if data?.message}
<div class="warnings">
  <small transition:fly={{ x: -1000, duration: 500 }} class="error">{data.message}</small>
</div>
{/if}

<article>
  <div>
    <hgroup>
      <h1>Log in</h1>
      <p>Log in to your account. Or <a href="/auth/signup">sign up</a> if you don't have one.</p>
    </hgroup>
    <form 
      method="post" use:enhance={() => {
        loading = true;
        
        return async ({ update, result }) => {
          await update().finally(() => {
            loading = false;
            if (result.type === "success") goto(data.redirectRoute);
          });
        }
      }}
    >
      {#if form?.error}
        <small class="error" transition:fade={{ duration: 100 }}>{form.error.message}</small>
      {/if}
      
      <LoginTextInputField
        bind:value={login}
        name="username"
        placeholder="Username or email"
        ariaLabel="Login"
        autocomplete="username"
        errorMsg="Login is required"
        validationFunc={isFieldValid}
        required
        disabled={loading}
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
        disabled={loading}
      />
      
      <SubmitBtn 
        disabled={disableSubmitBtn || loading}
        {loading}
      >Login</SubmitBtn>
    </form>
  </div>

  <hr>
  <section class="alternate-login-section">
    <p><strong>or sign in with</strong></p>

    <!-- GitHub -->
    <form method="post" action="/auth/github" use:enhance={() => {
      githubLoading = true;

      return async ({ result, update }) => {
        await update().finally(() => {
          
          // @ts-ignore
          const client_id = result.client_id;
          // @ts-ignore
          const state = result.state;

          // githubLoading = false;
          window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&state=${state}`;
        });
      }
    }}>
      <button type="submit" id="github-login" class="btn-social-login contrast" aria-busy={githubLoading} disabled={githubLoading}>
        <GitHubLogo reversed/>
        <GitHubMark reversed/>
      </button>
    </form>
  </section>
</article>

<style>
  article {
    margin: auto;
    max-width: 30rem;
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }

  .warnings {
    display: flex;
    justify-content: center;
  }

  .btn-social-login {
    font-weight: 600;
    /* max-height: 2rem */
  }

  .alternate-login-section {
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    margin-bottom: 1rem;
  }
</style>
