<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { CategoryKey, OptionEntry } from "../lib/types";
  import { getCategoryOptions } from "./categoryHelpers";

  export let category: { key: CategoryKey; label: string };
  export let selections: number[];
  export let inputValue: string;

  const dispatch = createEventDispatcher<{
    updateInput: string;
    updateSelections: number[];
  }>();

  let showOptions = false;

  const getAvailableOptions = (selectedItems: number[]): OptionEntry[] => {
    const selected = new Set(selectedItems);
    return getCategoryOptions(category.key).filter(
      (entry) => !selected.has(entry.id),
    );
  };

  const getLabel = (id: number) => {
    return (
      getCategoryOptions(category.key).find((entry) => entry.id === id)?.label ??
      "Unknown"
    );
  };

  const addSelectionFromOption = (option: OptionEntry) => {
    if (selections.includes(option.id)) {
      dispatch("updateInput", "");
      return;
    }
    dispatch("updateSelections", [...selections, option.id]);
    dispatch("updateInput", "");
  };

  const addSelection = () => {
    const rawValue = inputValue.trim();
    if (!rawValue) return;

    const match = getAvailableOptions(selections).find(
      (entry) => entry.label.toLowerCase() === rawValue.toLowerCase(),
    );

    if (!match) return;
    addSelectionFromOption(match);
  };

  const removeSelection = (id: number) => {
    dispatch(
      "updateSelections",
      selections.filter((item) => item !== id),
    );
  };
</script>

<div class="maker__row">
  <label class="row__label" for={`input-${category.key}`}>{category.label}</label>
  <div class="row__control">
    <input
      id={`input-${category.key}`}
      class="row__input"
      type="text"
      placeholder="Type to search and select"
      value={inputValue}
      on:input={(e) => dispatch("updateInput", e.currentTarget.value)}
      on:change={addSelection}
      on:focus={() => (showOptions = true)}
      on:blur={() => (showOptions = false)}
    />
    {#if showOptions}
      <div class="row__options" role="listbox">
        {#each getAvailableOptions(selections) as option (option.id)}
          <button
            type="button"
            class="row__option"
            on:mousedown|preventDefault={() => addSelectionFromOption(option)}
            on:click={() => addSelectionFromOption(option)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <div class="row__selected">
    {#if selections.length === 0}
      <p class="row__empty">No selections yet.</p>
    {:else}
      {#each selections as id}
        <button type="button" class="pill" on:click={() => removeSelection(id)}>
          {getLabel(id)}
          <span aria-hidden="true">×</span>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .maker__row {
    display: grid;
    gap: 0.75rem;
    padding: 1.5rem;
    border-radius: 18px;
    background: #fff6e5;
    border: 1px solid #e1d4bd;
  }

  .row__label {
    font-weight: 600;
    color: #4a3e2f;
  }

  .row__control {
    display: grid;
    gap: 0.5rem;
    position: relative;
  }

  .row__input {
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    border: 1px solid #ccbda5;
    background: #fffdf9;
    font-size: 1rem;
  }

  .row__options {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    z-index: 5;
    background: #fffdf9;
    border-radius: 12px;
    border: 1px solid #ccbda5;
    box-shadow: 0 14px 30px rgba(29, 27, 22, 0.12);
    max-height: 220px;
    overflow-y: auto;
    padding: 0.35rem;
    display: grid;
    gap: 0.2rem;
  }

  .row__option {
    border: none;
    background: transparent;
    padding: 0.6rem 0.7rem;
    border-radius: 10px;
    text-align: left;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .row__option:hover,
  .row__option:focus {
    background: #f0e2cc;
    outline: none;
  }

  .row__selected {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .row__empty {
    margin: 0;
    color: #6b5c44;
  }

  .pill {
    border: none;
    border-radius: 999px;
    padding: 0.4rem 0.75rem;
    background: #f0e2cc;
    color: #3f3528;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .pill span {
    font-size: 1rem;
  }
</style>
