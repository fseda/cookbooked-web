<script lang="ts">
	import { isNewPasswordConfirmValid } from "$lib/validation/input";
	import { blur, fade, fly } from "svelte/transition";

  export let value: string;
  export let ariaLabel: string;
  export let errorMsg: string;
  export let validationFunc: (value: string) => boolean;
  export let showForgotPassword: boolean = false;
  export let validationDelay: number = 0;
  export let disabled = false;

  let err = false;
  let timeout: any;
  let showPassword: boolean = false;

  $: justifyContentValue = (() => {
    if (err && showForgotPassword) return 'space-between';
    if (err) return 'flex-start';
    return 'flex-end';
  })();
  $: showPasswordInfo = err || showForgotPassword;

  function validate(event: Event) {
    clearTimeout(timeout);
    let time = event.type === 'blur' ? 0 : validationDelay;
    time = err ? 0 : time;

    timeout = setTimeout(() => {
      const field = event.target as HTMLInputElement;
      err = !validationFunc(field.value);
      if (err)
        field.setAttribute('aria-invalid', `${err}`);
      else 
        field.removeAttribute('aria-invalid');
    }, time);
  };
</script>

<fieldset>
  <div class="passwordInput">
    <label for="password">
      Password
      <input id="password"
      type="password"
      name="password"
      placeholder="Password" 
      bind:value
      on:input={validate}
      on:blur={validate}
      aria-label={ariaLabel}
      aria-describedby={'Password Error'}
      style={$$props.style}
      required
      {disabled}
      >
    </label>
    <label id="showPassword" for="showPasswordToggle">
      {showPassword ? 'Hide' : 'Show'}
      <input type="checkbox" id="showPasswordToggle" name="showPassword" role="switch" bind:checked={showPassword}>
    </label>
  </div>

  {#if showPassword}
    <small transition:fly id="rawPassword">{value}</small>
  {/if}

  <div id="passwordInfo" 
  style:justify-content={justifyContentValue}
  style:display={showPasswordInfo ? 'flex' : 'none'}
  >
    {#if err}
      <small id={name + 'Error'} class="error">{errorMsg}</small>
    {/if}
    {#if showForgotPassword}
      <small id="forgotPassword"><a href="/auth/forgot-password">Forgot password?</a></small>
    {/if}
  </div>
</fieldset>

<style lang="scss">
  .error {
    color: red;
  }

  #passwordInfo {
    display: flex;
    margin-top: 0.2rem;
  }

  .passwordInput {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    #showPassword {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: right;
    }
  }

  #rawPassword {
    font-size: 0.8rem;
    color: #999;
  }
</style>
