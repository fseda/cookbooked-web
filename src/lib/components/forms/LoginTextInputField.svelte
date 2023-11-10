<script lang="ts">
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

  let err = false;
  let timeout: any;
  let label = name[0].toUpperCase() + name.slice(1)

  function validate(event: Event) {
    clearTimeout(timeout);
    let time = event.type === 'blur' ? 0 : validationDelay;
    time = err ? 0 : time;

    timeout = setTimeout(() => {
      const field = event.target as HTMLInputElement;
      err = !validationFunc(field.value);
      if (err) {
        field.setAttribute('aria-invalid', `${err}`);
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
  on:blur={validate} 
  aria-label={ariaLabel}
  aria-describedby={name + 'Error'}
  {required}
  {disabled}
/>

{#if err}
  <small id={name + 'Error'} style="color: red;">{errorMsg}</small>
{/if}

<style>
  label {
    display: flex;
    flex-direction: column;
  }
</style>