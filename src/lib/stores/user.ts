import { writable, type Writable } from 'svelte/store';

export const authenticated: Writable<boolean> = writable<boolean>(false);
