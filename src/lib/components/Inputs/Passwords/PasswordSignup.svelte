<script lang="ts">
  import { Label, Input } from 'flowbite-svelte';
  import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
  import { password, passwordConfirm } from '$lib/components/Inputs/Passwords/stores';

  let showPassword: boolean = false;

  function togglePasswordVisibility(): void {
    showPassword = !showPassword;
  }

</script>

<Label class="space-y-2" for="password">
  <span>Your Password</span>
  <Input 
    id="password"
    type={ showPassword ? "text" : "password" } 
    name="password" 
    required
    bind:value={$password}
  >
    <button 
      type="button"
      slot="left" 
      on:click={togglePasswordVisibility} 
      class="pointer-events-auto"
    >
      {#if showPassword}
        <EyeOutline class="w-6 h-6" />
      {:else}
        <EyeSlashOutline class="w-6 h-6" />
      {/if}
    </button>
  </Input>
</Label>
<Label class="space-y-2" for="password-confirm">
  <span>Confirm password</span>
  <Input 
    style="color: #as2f2f"
    id="password-confirm"
    type={ showPassword ? "text" : "password" } 
    name="password-confirm" 
    bind:value={$passwordConfirm}
    required
  >
    <button 
      type="button"
      slot="left" 
      on:click={togglePasswordVisibility} 
      class="pointer-events-auto"
    >
      {#if showPassword}
        <EyeOutline class="w-6 h-6" />
      {:else}
        <EyeSlashOutline class="w-6 h-6" />
      {/if}
    </button>
  </Input>
</Label>
