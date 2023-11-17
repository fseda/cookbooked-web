import { writable } from 'svelte/store';

type ModalState = {
  [id: string]: boolean;
};

function createModalStore() {
  const { subscribe, update } = writable<ModalState>({});

  return {
    subscribe,
    open: (id: string) => update(modals => ({ ...modals, [id]: true })),
    close: (id: string) => update(modals => ({ ...modals, [id]: false })),
    toggle: (id: string) => update(modals => ({ ...modals, [id]: !modals[id] }))
  };
}

export const modals = createModalStore();