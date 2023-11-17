<script lang="ts">
	import { onMount } from "svelte";
  import { modals } from "$lib/stores/modal";

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

  export const toggleModal = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement;
    const modalId = target.dataset.target;
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
    console.log("asdf;aksdjfl;ajsl;fjdlkj")

    // Clean up event listeners
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  });
</script>

<dialog {id} open={isOpen}>
  <article>
    <a href="#close"
      aria-label="Close"
      class="close"
      data-target="edit-recipe"
      on:click={toggleModal}>
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
          on:click={toggleModal}>
          Cancel
        </a>
      </slot>
      <slot name="confirm">
        <a href="#confirm"
          role="button"
          data-target={id}
          on:click={toggleModal}>
          Confirm
        </a>
      </slot>
    </footer>
  </article>
</dialog>

