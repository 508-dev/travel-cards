<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LanguageCode } from "../lib/types";

  export let label: string;
  export let options: { id: LanguageCode; label: string }[];
  export let value: LanguageCode | null = null;

   const dispatch = createEventDispatcher<{ change: string }>();

  const handleChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement;
    dispatch("change", target.value);
  };
</script>

<label class="field">
  <span class="field__label">{label}</span>
  <select class="field__control" on:change={handleChange}>
    <option value="">Select language</option>
    {#each options as language}
      <option value={language.id} selected={language.id === value}>
        {language.label}
      </option>
    {/each}
  </select>
</label>

<style>
  .field {
    display: grid;
    gap: 0.65rem;
  }

  .field__label {
    font-weight: 600;
    color: #3f3528;
  }

  .field__control {
    padding: 0.75rem 0.9rem;
    border-radius: 12px;
    border: 1px solid #ccbda5;
    background: #fffdf9;
    font-size: 1rem;
    color: inherit;
  }
</style>
