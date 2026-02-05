<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { getSelectionsFromSearch, defaultSelectionState } from "../../lib/query";
  import type { SelectionState } from "../../lib/types";
  
  import CardViewHeader from "./CardViewHeader.svelte";
  import CardCanvas from "./CardCanvas.svelte";
  import { buildCardSections, getLanguageData } from "./cardViewHelpers";

  let selections: SelectionState = { ...defaultSelectionState };

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

  $: targetLanguageData = getLanguageData(selections.targetLanguage);
  $: englishLanguageData = getLanguageData("en");
  $: targetSections = buildCardSections(targetLanguageData, selections);
  $: englishSections = buildCardSections(englishLanguageData, selections);
</script>

<section class="card-view">
  <CardViewHeader />
  
  <CardCanvas
    {targetLanguageData}
    {englishLanguageData}
    {targetSections}
    {englishSections}
  />
</section>

<style>
  .card-view {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 1.5rem 6rem;
    display: grid;
    gap: 2.5rem;
  }

  @media print {
    .card-view {
      padding: 1cm !important;
    }

    :global(body),
    .card-view {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
      width: 100% !important;
    }
  }
</style>
