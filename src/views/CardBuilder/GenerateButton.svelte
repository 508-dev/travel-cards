<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let disabled: boolean;

  const dispatch = createEventDispatcher<{ click: void }>();
</script>

<div class="maker__footer">
  <button
    class="maker__button"
    type="button"
    {disabled}
    on:click={() => dispatch("click")}
  >
    Generate card
  </button>
</div>

<style>
  .maker__footer {
    position: sticky;
    bottom: 0;
    padding: 1.5rem;
    background: linear-gradient(
      180deg,
      rgba(245, 242, 234, 0) 0%,
      rgba(245, 242, 234, 0.9) 40%,
      rgba(245, 242, 234, 1) 100%
    );
    display: flex;
    justify-content: center;
  }

  .maker__button {
    border: none;
    border-radius: 999px;
    padding: 0.9rem 2.5rem;
    background: #1d1b16;
    color: #fefaf2;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .maker__button:disabled {
    background: #b8a98f;
    cursor: not-allowed;
  }
</style>
