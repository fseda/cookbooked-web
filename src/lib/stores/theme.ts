import { writable } from 'svelte/store';

export type ColorScheme = 'dark' | 'light';
export const theme = writable<ColorScheme>('light');
