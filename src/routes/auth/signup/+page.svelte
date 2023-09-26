<script lang="ts">
  import { Section, Register } from 'flowbite-svelte-blocks';
  import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
  import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
  import { PasswordSignup } from '$lib/components';

</script>

<Section name="register">
  <Register href="/">
    <svelte:fragment slot="top">
      <img class="w-8 h-8 mr-2" src="/flowbite-logo.svg" alt="logo" />
      CookBooked
    </svelte:fragment>
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <form class="flex flex-col space-y-6" action="/">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create an account</h3>
        <Label class="space-y-2">
          <span>Your email</span>
          <Input type="email" name="email" placeholder="john@doe.com" required />
        </Label>

        <PasswordSignup />

        <!-- <div class="flex items-start">
          <Checkbox>I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/"> Terms and Conditions</a></Checkbox>
        </div> -->

        <Button type="submit" class="w-full1">Create account</Button>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          Already have an account? <a href="/auth/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
        </div>
      </form>
    </div>
  </Register>
</Section>
