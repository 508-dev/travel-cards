<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { CategoryKey } from "../lib/types";

  export let categoryEntries: { key: CategoryKey; label: string }[];
  export let enabledCategories: Set<CategoryKey>;

  const dispatch = createEventDispatcher<{
    toggle: { key: CategoryKey; checked: boolean };
  }>();

  const handleToggle = (key: CategoryKey, event: Event) => {
    const target = event.currentTarget as HTMLInputElement | null;
    if (!target) return;
    dispatch("toggle", { key, checked: target.checked });
  };
</script>

<div class="maker__section">
  <h2 class="maker__section-title">I need to communicate</h2>
  <div class="maker__checks">
    {#each categoryEntries as categoryItem (categoryItem.key)}
      <label class="maker__check">
        <input
          type="checkbox"
          checked={enabledCategories.has(categoryItem.key)}
          on:change={(event) => handleToggle(categoryItem.key, event)}
        />
        <span>{categoryItem.label}</span>
      </label>
    {/each}
  </div>
</div>

<style>
  .maker__section {
    display: grid;
    gap: 1rem;
  }

  .maker__section-title {
    margin: 0;
    font-size: 1.1rem;
  }

  .maker__checks {
    display: grid;
    gap: 0.75rem;
  }

  .maker__check {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 500;
  }

  @media (min-width: 720px) {
    .maker__checks {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
