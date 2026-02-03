<script lang="ts">
  import { languageList, languageDataById } from "../lib/data";
  import {
    buildSearchFromSelections,
    defaultSelectionState,
  } from "../lib/query";
  import { getPathForRoute } from "../lib/routes";
  import type {
    CategoryKey,
    LanguageCode,
    OptionEntry,
    SelectionState,
  } from "../lib/types";

  type LanguageSummary = { id: LanguageCode; label: string };

  const englishData = languageDataById.en as unknown as {
    categories: Record<CategoryKey, { label: string; options: OptionEntry[] }>;
  };

  const languageOptions: LanguageSummary[] = [
    { id: "en", label: "English" },
    { id: "es", label: "Spanish" },
    { id: "zh-Hant", label: "Mandarin Chinese (Traditional)" },
    { id: "zh-Hans", label: "Mandarin Chinese (Simplified)" },
  ];
  const sourceOptions = languageOptions.filter(
    (language) => language.id === "en",
  );
  const targetOptions = languageOptions.filter(
    (language) => language.id !== "en",
  );

  type CategoryEntry = { key: CategoryKey; label: string };

  const categoryEntries: CategoryEntry[] = (
    Object.keys(englishData.categories) as CategoryKey[]
  ).map((key) => ({
    key,
    label: englishData.categories[key].label,
  }));

  const categoryKeys = categoryEntries.map((entry) => entry.key);

  let selections: SelectionState = { ...defaultSelectionState };
  let enabledCategories = new Set<CategoryKey>();
  let inputs: Record<CategoryKey, string> = Object.fromEntries(
    categoryKeys.map((key) => [key, ""]),
  ) as Record<CategoryKey, string>;
  let showOptions: Record<CategoryKey, boolean> = Object.fromEntries(
    categoryKeys.map((key) => [key, false]),
  ) as Record<CategoryKey, boolean>;

  const updateLanguage = (
    field: "sourceLanguage" | "targetLanguage",
    value: string,
  ) => {
    selections = {
      ...selections,
      [field]: value ? (value as LanguageCode) : null,
    };
  };

  const toggleCategory = (key: CategoryKey, checked: boolean) => {
    const next = new Set(enabledCategories);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }

    enabledCategories = next;
  };

  const handleCategoryToggle = (key: CategoryKey, event: Event) => {
    const target = event.currentTarget as HTMLInputElement | null;
    if (!target) {
      return;
    }

    toggleCategory(key, target.checked);
  };

  const getCategoryOptions = (key: CategoryKey): OptionEntry[] => {
    return englishData.categories[key].options;
  };

  const getAvailableOptions = (key: CategoryKey): OptionEntry[] => {
    const selected = new Set(selections[key]);
    return getCategoryOptions(key).filter((entry) => !selected.has(entry.id));
  };

  const getLabel = (key: CategoryKey, id: number) => {
    return (
      getCategoryOptions(key).find((entry) => entry.id === id)?.label ??
      "Unknown"
    );
  };

  const addSelectionFromOption = (key: CategoryKey, option: OptionEntry) => {
    if (selections[key].includes(option.id)) {
      inputs = { ...inputs, [key]: "" };
      return;
    }

    selections = {
      ...selections,
      [key]: [...selections[key], option.id],
    };
    inputs = { ...inputs, [key]: "" };
  };

  const addSelection = (key: CategoryKey) => {
    const rawValue = inputs[key].trim();
    if (!rawValue) {
      return;
    }

    const match = getAvailableOptions(key).find(
      (entry) => entry.label.toLowerCase() === rawValue.toLowerCase(),
    );

    if (!match) {
      return;
    }

    addSelectionFromOption(key, match);
  };

  const removeSelection = (key: CategoryKey, id: number) => {
    selections = {
      ...selections,
      [key]: selections[key].filter((item) => item !== id),
    };
  };

  const handleGenerate = () => {
    if (!selections.sourceLanguage || !selections.targetLanguage) {
      return;
    }

    const search = buildSearchFromSelections(selections);
    const path = getPathForRoute("card");
    const url = search ? `${path}?${search}` : path;

    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  $: readyForDetails = Boolean(
    selections.sourceLanguage && selections.targetLanguage,
  );
  $: canGenerate =
    readyForDetails &&
    categoryEntries.some(
      (category) =>
        selections[category.key].length > 0 ||
        enabledCategories.has(category.key),
    );
</script>

<section class="maker">
  <header class="maker__header">
    <p class="maker__eyebrow">Travel Cards</p>
    <h1 class="maker__title">Card Builder</h1>
    <p class="maker__subtitle">
      Select the languages you speak and choose the items you need to
      communicate quickly while traveling.
    </p>
  </header>

  <div class="maker__panel">
    <div class="maker__inputs">
      <label class="field">
        <span class="field__label">I speak...</span>
        <select
          class="field__control"
          on:change={(event) =>
            updateLanguage("sourceLanguage", event.currentTarget.value)}
        >
          <option value="">Select language</option>
          {#each sourceOptions as language}
            {#if language}
              <option
                value={language.id}
                selected={language.id === selections.sourceLanguage}
              >
                {language.label}
              </option>
            {/if}
          {/each}
        </select>
      </label>

      <label class="field">
        <span class="field__label">I'm traveling somewhere that speaks...</span>
        <select
          class="field__control"
          on:change={(event) =>
            updateLanguage("targetLanguage", event.currentTarget.value)}
        >
          <option value="">Select language</option>
          {#each targetOptions as language}
            <option
              value={language.id}
              selected={language.id === selections.targetLanguage}
            >
              {language.label}
            </option>
          {/each}
        </select>
      </label>
    </div>

    {#if readyForDetails}
      <div class="maker__section">
        <h2 class="maker__section-title">I need to communicate</h2>
        <div class="maker__checks">
          {#each categoryEntries as categoryItem (categoryItem.key)}
            <label class="maker__check">
              <input
                type="checkbox"
                checked={enabledCategories.has(categoryItem.key)}
                on:change={(event) =>
                  handleCategoryToggle(categoryItem.key, event)}
              />
              <span>{categoryItem.label}</span>
            </label>
          {/each}
        </div>
      </div>

      {#each categoryEntries as categoryItem}
        {#if enabledCategories.has(categoryItem.key)}
          {@const available = getAvailableOptions(categoryItem.key, selections)}
          {@const isEmpty = available.length === 0}
          <div class="maker__row">
            <label class="row__label" for={`input-${categoryItem.key}`}
              >{categoryItem.label}</label
            >
            <div class="row__control">
              <input
                id={`input-${categoryItem.key}`}
                class="row__input"
                type="text"
                placeholder={isEmpty ? "No more options" : "Type to search and select"}
                list={`list-${categoryItem.key}`}
                disabled={isEmpty}
                bind:value={inputs[categoryItem.key]}
                on:change={() => addSelection(categoryItem.key)}
                on:focus={() =>
                  (showOptions = { ...showOptions, [categoryItem.key]: true })}
                on:blur={() =>
                  (showOptions = { ...showOptions, [categoryItem.key]: false })}
              />
              {#if showOptions[categoryItem.key] && !isEmpty}
                <div class="row__options" role="listbox">
                  {#each available as option}
                    <button
                      type="button"
                      class="row__option"
                      on:mousedown|preventDefault={() =>
                        addSelectionFromOption(categoryItem.key, option)}
                    >
                      {option.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
            <div class="row__selected">
              {#if selections[categoryItem.key].length === 0}
                <p class="row__empty">No selections yet.</p>
              {:else}
                {#each selections[categoryItem.key] as id}
                  <button
                    type="button"
                    class="pill"
                    on:click={() => removeSelection(categoryItem.key, id)}
                  >
                    {getLabel(categoryItem.key, id)}
                    <span aria-hidden="true">×</span>
                  </button>
                {/each}
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <p class="maker__hint">Select both languages to continue.</p>
    {/if}
  </div>
</section>

<div class="maker__footer">
  <button
    class="maker__button"
    type="button"
    disabled={!canGenerate}
    on:click={handleGenerate}
  >
    Generate card
  </button>
</div>

<style>
  .maker {
    max-width: 980px;
    margin: 0 auto;
    padding: 4rem 1.5rem 3rem;
    display: grid;
    gap: 2.5rem;
  }

  .maker__header {
    display: grid;
    gap: 0.75rem;
  }

  .maker__eyebrow {
    margin: 0;
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a6a50;
  }

  .maker__title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.25rem);
  }

  .maker__subtitle {
    margin: 0;
    max-width: 38rem;
    color: #4f463a;
  }

  .maker__panel {
    border: 1px solid #d7cbb6;
    border-radius: 24px;
    padding: 2.5rem;
    background: #fff8eb;
    display: grid;
    gap: 2rem;
  }

  .maker__inputs {
    display: grid;
    gap: 1.5rem;
  }

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

  .maker__hint {
    margin: 0;
    color: #6b5c44;
  }

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

  @media (min-width: 720px) {
    .maker__inputs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .maker__checks {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
