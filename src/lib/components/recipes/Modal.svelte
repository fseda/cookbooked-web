<script lang="ts">
	import { onMount } from "svelte";
  import { modals } from "$lib/stores/modal";

  export let loading = false;

  const isOpenClass = "modal-is-open";
  const openingClass = "modal-is-opening";
  const closingClass = "modal-is-closing";
  const animationDuration = 400; // ms
  let visibleModal: HTMLDialogElement | null = null;
  export let id: string;

  let isOpen = false;
  modals.subscribe($modals => {
    isOpen = $modals[id] || false;
  });

  export const toggleModal = (modalId: string) => {
    const modal = modalId ? document.getElementById(modalId) : null;
    
    if (modal) {
      isOpen
      ? closeModal(modal as HTMLDialogElement) 
      : openModal(modal as HTMLDialogElement);
    }
  };

  const openModal = (modal: HTMLDialogElement) => {
    if (isScrollbarVisible()) {
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${getScrollbarWidth()}px`
      );
    }

    document.documentElement.classList.add(isOpenClass, openingClass);
    setTimeout(() => {
      visibleModal = modal;
      document.documentElement.classList.remove(openingClass);
    }, animationDuration);
    modals.open(id);
  };

  export const closeModal = (modal: HTMLDialogElement) => {
    document.documentElement.classList.add(closingClass);
    setTimeout(() => {
      document.documentElement.classList.remove(closingClass, isOpenClass);
      modals.close(id);
      visibleModal = null;
    }, animationDuration);
  };

  const getScrollbarWidth = () => {
    // Creating invisible container
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear
    // outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement("div");
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  };

  const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
  };

  onMount(() => {
    // Close with a click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (visibleModal) {
        const modalContent = visibleModal.querySelector("article");
        if (modalContent && !modalContent.contains(event.target as Node)) {
          closeModal(visibleModal);
        }
      }
    };

    // Close with Esc key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Clean up event listeners
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  });
</script>

<dialog {id} open={isOpen} aria-busy={loading}>
  <article>
    <a href="#close"
      aria-label="Close"
      class="close"
      data-target="edit-recipe"
      on:click={() => toggleModal(id)}>
    </a>
    <slot name="main">
      <h2>Fill me</h2>
      <p>Give me some children</p>
    </slot>
    <footer>
      <slot name="cancel">
        <a href="#cancel"
          role="button"
          class="outline secondary"
          data-target={id}
          on:click={() => toggleModal(id)}>
          Cancel
        </a>
      </slot>
      <slot name="confirm">
        <a href="#confirm"
          role="button"
          data-target={id}
          on:click={() => toggleModal(id)}>
          Confirm
        </a>
      </slot>
    </footer>
  </article>
</dialog>

<style>
  @media (min-width: 1024px) {
    article {
      max-width: 80%;
    }
  }
</style>
