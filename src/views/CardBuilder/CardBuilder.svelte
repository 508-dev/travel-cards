<script lang="ts">
  import { buildSearchFromSelections, defaultSelectionState } from "../../lib/query";
  import { getPathForRoute } from "../../lib/routes";
  import type { CategoryKey, LanguageCode, SelectionState } from "../../lib/types";
  
  import CardBuilderHeader from "./CardBuilderHeader.svelte";
  import LanguageSelector from "./LanguageSelector.svelte";
  import CategoryCheckboxes from "./CategoryCheckboxes.svelte";
  import CategoryInput from "./CategoryInput.svelte";
  import GenerateButton from "./GenerateButton.svelte";
  import { languageOptions, categoryEntries } from "./cardBuilderData";

  const sourceOptions = languageOptions.filter((language) => language.id === "en");
  const targetOptions = languageOptions.filter((language) => language.id !== "en");
  const categoryKeys = categoryEntries.map((entry) => entry.key);

  let selections: SelectionState = { ...defaultSelectionState };
  let enabledCategories = new Set<CategoryKey>();
  let inputs: Record<CategoryKey, string> = Object.fromEntries(
    categoryKeys.map((key) => [key, ""]),
  ) as Record<CategoryKey, string>;

  const updateLanguage = (field: "sourceLanguage" | "targetLanguage", value: string) => {
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

  const updateSelections = (key: CategoryKey, newSelections: number[]) => {
    selections = {
      ...selections,
      [key]: newSelections,
    };
  };

  const updateInput = (key: CategoryKey, value: string) => {
    inputs = { ...inputs, [key]: value };
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

  $: readyForDetails = Boolean(selections.sourceLanguage && selections.targetLanguage);
  $: canGenerate =
    readyForDetails &&
    categoryEntries.some(
      (category) =>
        selections[category.key].length > 0 || enabledCategories.has(category.key),
    );
</script>

<section class="maker">
  <CardBuilderHeader />

  <div class="maker__panel">
    <div class="maker__inputs">
      <LanguageSelector
        label="I speak..."
        options={sourceOptions}
        value={selections.sourceLanguage}
        on:change={(e) => updateLanguage("sourceLanguage", e.detail)}
      />

      <LanguageSelector
        label="I'm traveling somewhere that speaks..."
        options={targetOptions}
        value={selections.targetLanguage}
        on:change={(e) => updateLanguage("targetLanguage", e.detail)}
      />
    </div>

    {#if readyForDetails}
      <CategoryCheckboxes
        {categoryEntries}
        {enabledCategories}
        on:toggle={(e) => toggleCategory(e.detail.key, e.detail.checked)}
      />

      {#each categoryEntries as categoryItem}
        {#if enabledCategories.has(categoryItem.key)}
          <CategoryInput
            category={categoryItem}
            selections={selections[categoryItem.key]}
            inputValue={inputs[categoryItem.key]}
            on:updateInput={(e) => updateInput(categoryItem.key, e.detail)}
            on:updateSelections={(e) => updateSelections(categoryItem.key, e.detail)}
          />
        {/if}
      {/each}
    {:else}
      <p class="maker__hint">Select both languages to continue.</p>
    {/if}
  </div>
</section>

<GenerateButton disabled={!canGenerate} on:click={handleGenerate} />

<style>
  .maker {
    max-width: 980px;
    margin: 0 auto;
    padding: 4rem 1.5rem 3rem;
    display: grid;
    gap: 2.5rem;
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

  .maker__hint {
    margin: 0;
    color: #6b5c44;
  }

  @media (min-width: 720px) {
    .maker__inputs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
