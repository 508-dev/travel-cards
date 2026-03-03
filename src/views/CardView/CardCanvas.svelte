<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
  import type { CardSection, LanguageDataShape } from "./cardViewHelpers";
  import Card from "./Card.svelte";

  export let targetLanguageData: LanguageDataShape | null;
  export let englishLanguageData: LanguageDataShape | null;
  export let targetSections: CardSection[];
  export let englishSections: CardSection[];

  let card1Element: HTMLElement;
  let card2Element: HTMLElement;

  const syncHeights = async () => {
    if (!card1Element || !card2Element) return;

    // Force the elements to match the print width and reset height
    [card1Element, card2Element].forEach((el) => {
      el.style.setProperty("width", "100%", "important");
      el.style.setProperty("height", "auto", "important");
    });

    await tick();
    await new Promise((r) => setTimeout(r, 30));

    // Measure how tall they actually are
    const h1 = card1Element.scrollHeight;
    const h2 = card2Element.scrollHeight;
    const finalH = Math.max(h1, h2);

    // Apply shared height
    const hStr = `${finalH * 1}px`;
    [card1Element, card2Element].forEach((el) => {
      el.style.setProperty("height", hStr, "important");
      el.style.setProperty("min-height", hStr, "important");
      el.style.width = "";
    });
  };

  onMount(() => {
    syncHeights();
    window.addEventListener("beforeprint", syncHeights);

    return () => {
      window.removeEventListener("beforeprint", syncHeights);
    };
  });

  afterUpdate(() => {
    syncHeights();
  });
</script>

<div class="card-view__canvas">
  <div class="card-view__cards">
    <Card
      bind:cardElement={card1Element}
      label={targetLanguageData ? targetLanguageData.label : "Target language"}
      sections={targetSections}
      emptyMessage={!targetLanguageData
        ? "Select a target language to render a card."
        : "No selections were provided in the URL."}
    />
  </div>
  
  <div class="card-view__cards card-view__cards--page-break">
    <Card
      bind:cardElement={card2Element}
      label="English (reverse side)"
      sections={englishSections}
      emptyMessage="No selections were provided in the URL."
    />
  </div>
</div>

<style>
  .card-view__canvas {
    border-radius: 24px;
    background: #fefaf2;
    border: 1px solid #e2d7c4;
    padding: 2.5rem;
  }

  .card-view__cards {
    display: grid;
    gap: 1.75rem;
  }

  @media print {
    .card-view__canvas {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
      width: 100% !important;
    }

    .card-view__cards {
      display: block !important;
      height: auto !important;
      clear: both !important;
    }

    .card-view__cards--page-break {
      page-break-before: always !important;
      break-before: page !important;
    }
  }
</style>
