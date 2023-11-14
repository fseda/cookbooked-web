<script lang="ts">
	import { isEmailValid } from "$lib/validation/input";

  const apiUrl = import.meta.env.VITE_API_URL;

  export let value = "";
  export let name: string;
  export let placeholder: string;
  export let ariaLabel: string;
  export let autocomplete: string;
  export let errorMsg: string;
  export let required: boolean;
  export let validationFunc: (value: string) => boolean;
  export let validationDelay: number = 0;
  export let disabled: boolean = false;
  export let userExists: boolean = false;

  let err = false;
  let errMsg = errorMsg;
  let timeout: any;
  let timeout2: any;
  let label = name[0].toUpperCase() + name.slice(1)
  let oldValue = value;

  function validate(event: Event) {
    clearTimeout(timeout);
    let time = event.type === 'blur' ? 0 : validationDelay;
    time = err ? 0 : time;

    timeout = setTimeout(async () => {
      const field = event.target as HTMLInputElement;
      err = !validationFunc(field.value);
      errMsg = errorMsg;

      if (err) {
        field.setAttribute('aria-invalid', `${err}`);
      } else {
        if (value === oldValue) return;

        oldValue = value;

        const res = await fetch(`${apiUrl}/users/exists?${name}=${value}`);
        const data = await res.json();
        const field = event.target as HTMLInputElement;

        field.setAttribute('aria-invalid', `${data.exists}`);
        
        err = data.exists;
        userExists = data.exists;
        errMsg = err ? `${label} already in use` : errMsg;
      }
    }, time);
  };
</script>
<label for={name}>
  {label}
</label>
<input type="text" 
  id={name}
  {name}
  {autocomplete}
  {placeholder} 
  bind:value
  on:input={validate} 
  on:blur={validate} 
  aria-label={ariaLabel}
  aria-describedby={name + 'Error'}
  {required}
  {disabled}
/>

{#if err}
  <small id={name + 'Error'} style="color: red;">{errMsg}</small>
{/if}

<style>
  label {
    display: flex;
    flex-direction: column;
  }
</style>