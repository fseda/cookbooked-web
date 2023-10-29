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

  let err = false;
  let timeout: any;


  function validate(event: Event) {
    clearTimeout(timeout);
    let time = event.type === 'blur' ? 0 : validationDelay;
    time = err ? 0 : time;

    timeout = setTimeout(() => {
      const field = event.target as HTMLInputElement;
      err = !validationFunc(field.value);
      field.setAttribute('aria-invalid', `${err}`);
    }, time);
  };
</script>

<input type="text" 
  {name}
  {autocomplete}
  {placeholder} 
  bind:value
  on:input={validate} 
  on:blur={validate} 
  aria-label={ariaLabel}
  aria-describedby={name + 'Error'}
  {required}
/>
{#if err}
  <small id={name + 'Error'} style="color: red;">{errorMsg}</small>
{/if}
