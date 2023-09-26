import { writable, derived } from 'svelte/store';

export const password = writable('');
export const passwordConfirm = writable('');
export const passwordsMatch = derived(
  [password, passwordConfirm],
  ([$password, $passwordConfirm]) => $password === $passwordConfirm
);
