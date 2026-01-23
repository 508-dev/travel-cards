<script lang="ts">
  import { onMount } from "svelte";
  import { getSelectionsFromSearch, defaultSelectionState } from "../lib/query";
  import { languageDataById } from "../lib/data";
  import type {
    CategoryKey,
    LanguageData,
    OptionEntry,
    SelectionState,
  } from "../lib/types";

  type CategoryData = { label: string; options: OptionEntry[] };
  type CategoryMap = Record<CategoryKey, CategoryData>;
  type LanguageDataShape = LanguageData & { categories: CategoryMap };
  type CardSection = {
    key: CategoryKey;
    label: string;
    options: OptionEntry[];
  };

  const categoryOrder: CategoryKey[] = [
    "allergies",
    "foodRestrictions",
    "medicineAllergies",
    "medicalConditions",
    "phobias",
  ];

  let selections: SelectionState = { ...defaultSelectionState };
  let sections: CardSection[] = [];

  const syncSelections = () => {
    selections = getSelectionsFromSearch(window.location.search);
  };

  onMount(() => {
    syncSelections();
    window.addEventListener("popstate", syncSelections);

    return () => {
      window.removeEventListener("popstate", syncSelections);
    };
  });

  const getLanguageData = (
    language: SelectionState["targetLanguage"],
  ): LanguageDataShape | null => {
    if (!language) {
      return null;
    }

    return (languageDataById[language] as unknown as LanguageDataShape) ?? null;
  };

  const getSelectedOptions = (
    data: LanguageDataShape,
    key: CategoryKey,
    selected: number[],
  ): OptionEntry[] => {
    const options = data.categories[key].options;
    const selectedSet = new Set(selected);
    return options.filter((option) => selectedSet.has(option.id));
  };

  $: languageData = getLanguageData(selections.targetLanguage);
  $: sections = languageData
    ? categoryOrder
        .map((key) => ({
          key,
          label: languageData.categories[key].label,
          options: getSelectedOptions(languageData, key, selections[key]),
        }))
        .filter((section) => section.options.length > 0)
    : [];
</script>

<section class="card-view">
  <header class="card-view__header no-print">
    <p class="card-view__eyebrow">Travel Cards</p>
    <h1 class="card-view__title">Printable Card</h1>
    <p class="card-view__subtitle">
      This view renders the card details from the URL query parameters.
    </p>
  </header>

  <div class="card-view__canvas">
    <div class="card-view__card">
      {#if !languageData}
        <p class="card-view__card-title">
          Select a target language to render a card.
        </p>
      {:else if sections.length === 0}
        <p class="card-view__card-title">
          No selections were provided in the URL.
        </p>
      {:else}
        <div class="card-view__content">
          {#each sections as section (section.key)}
            <div class="card-view__section">
              <h2 class="card-view__section-title">{section.label}</h2>
              <div class="card-view__chips">
                {#each section.options as option (option.id)}
                  <span class="card-view__chip">{option.label}</span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .card-view {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 1.5rem 6rem;
    display: grid;
    gap: 2.5rem;
  }

  .card-view__header {
    display: grid;
    gap: 0.75rem;
  }

  .card-view__eyebrow {
    margin: 0;
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a6a50;
  }

  .card-view__title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.25rem);
  }

  .card-view__subtitle {
    margin: 0;
    max-width: 36rem;
    color: #4f463a;
  }

  .card-view__canvas {
    border-radius: 24px;
    background: #fefaf2;
    border: 1px solid #e2d7c4;
    padding: 2.5rem;
  }

  .card-view__card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e4dccb;
    padding: 2rem;
    min-height: 220px;
    display: flex;
  }
  .card-view__section-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  .card-view__section {
    margin-bottom: 1.5rem;
  }
  .card-view__chip {
    border: 1px solid black;
    border-radius: 3px;
    margin: 6px 12px;
    padding: 6px 8px;
    font-size: 1.2rem;
  }
  .card-view__card-title {
    margin: 0;
    color: #7a6a50;
  }
  @media print {
    .no-print {
      display: none !important;
    }
  }
</style>
