<script lang="ts">
	import { isEmailValid } from "$lib/validation/input";

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
  let timeout1: any;
  let timeout2: any;
  let label = name[0].toUpperCase() + name.slice(1)

  async function CheckUserExists(event: Event) {
    clearTimeout(timeout2);
    if (name === "email") {
      if (!isEmailValid(value)) {
        return;
      }
    } else if (value.length < 3) return ;

    timeout2 = setTimeout(async () => {
      const res = await fetch(`http://localhost:3000/users/exists?${name}=${value}`);
      const data = await res.json();
      console.log(data)
      const field = event.target as HTMLInputElement;
      field.setAttribute('aria-invalid', `${data.exists}`);
      err = data.exists;
      userExists = data.exists;
      errMsg = err ? `${label} already in use` : errMsg;
    }, validationDelay);
  };

  function validate(event: Event) {
    clearTimeout(timeout1);
    let time = event.type === 'blur' ? 0 : validationDelay;
    time = err ? 0 : time;

    timeout1 = setTimeout(() => {
      const field = event.target as HTMLInputElement;
      err = !validationFunc(field.value);
      if (err) {
        field.setAttribute('aria-invalid', `${err}`);
        errMsg = errorMsg;
      }
      else 
        field.removeAttribute('aria-invalid');
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
  on:input={CheckUserExists} 
  on:blur={CheckUserExists} 
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