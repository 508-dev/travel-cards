<script lang="ts">
  import { onMount, afterUpdate, tick } from "svelte";
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
  let targetSections: CardSection[] = [];
  let englishSections: CardSection[] = [];

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

  const buildSections = (data: LanguageDataShape | null, state: SelectionState): CardSection[] => {
    if (!data) return [];

    return categoryOrder
      .map((key) => ({
        key,
        label: data.categories[key].label,
        options: getSelectedOptions(data, key, state[key]),
      }))
      .filter((section) => section.options.length > 0);
  };

  $: targetLanguageData = getLanguageData(selections.targetLanguage);
  $: englishLanguageData =
    (languageDataById.en as unknown as LanguageDataShape) ?? null;

  $: targetSections = buildSections(targetLanguageData, selections);
  $: englishSections = buildSections(englishLanguageData, selections);

  let card1Element: HTMLElement;
  let card2Element: HTMLElement;
  let syncedHeight: number | null = null;
  const syncHeights = async () => {
    if (!card1Element || !card2Element) return;

    // 1. Force the elements to match the print width (100% per your CSS)
    // and reset height so we can measure the "natural" growth
    [card1Element, card2Element].forEach(el => {
      el.style.setProperty('width', '100%', 'important');
      el.style.setProperty('height', 'auto', 'important');
    });

    await tick();
    await new Promise(r => setTimeout(r, 30));

    // 2. Measure how tall they actually are when squeezed into the print width
    const h1 = card1Element.scrollHeight;
    const h2 = card2Element.scrollHeight;
    const finalH = Math.max(h1, h2);

    // 3. Apply that shared height
    const hStr = `${finalH*1}px`;
    [card1Element, card2Element].forEach(el => {
      el.style.setProperty('height', hStr, 'important');
      el.style.setProperty('min-height', hStr, 'important');
      el.style.width = ''; // Let CSS take over width again
    });
  };
  const handlePrint = () => {
    // 1. Remove focus from the button immediately
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 2. Force the window to the top (Print engines prefer 0,0)
    window.scrollTo(0, 0);

    // 3. Trigger print
    window.print();
  };
  onMount(() => {
    syncSelections();
    syncHeights(); // Run once DOM is ready
    
    window.addEventListener("popstate", syncSelections);
    window.addEventListener("beforeprint", syncHeights);

    return () => {
      window.removeEventListener("popstate", syncSelections);
      window.removeEventListener("beforeprint", syncHeights);
    };
  });

  // Trigger whenever data changes and Svelte updates the DOM
  afterUpdate(() => {
    syncHeights();
  });
</script>

<section class="card-view">
  <header class="card-view__header no-print">
    <p class="card-view__eyebrow">Travel Cards</p>
    <h1 class="card-view__title">Printable Card</h1>
    <p class="card-view__subtitle">
      This view renders the card details from the URL query parameters.
    </p>
    
    <div class="print-controls">
      <button class="print-button" on:click={handlePrint}>
        <span aria-hidden="true">⎙</span> Print Cards
      </button>

      <div class="info-bubble" aria-label="Printing help">
        <span class="info-icon">i</span>
        <div class="info-content">
          <p><strong>Note: The card will attempt to print as two pages. Please print double sided, portrait mode, so that the english card will print on the opposite side of the local language card.</p>
        </div>
      </div>
    </div>
  </header>

  <div class="card-view__canvas">
    <div class="card-view__cards">
      <div 
        bind:this={card1Element} 
        class="card-view__card"
      >
        <p class="card-view__card-label">
          {targetLanguageData ? targetLanguageData.label : "Target language"}
        </p>
        {#if !targetLanguageData}
          <p class="card-view__card-title">
            Select a target language to render a card.
          </p>
        {:else if targetSections.length === 0}
          <p class="card-view__card-title">
            No selections were provided in the URL.
          </p>
        {:else}
          <div class="card-view__content">
            {#each targetSections as section (section.key)}
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
    <div class="card-view__cards">
        <div 
          bind:this={card2Element} 
          class="card-view__card" 
        >
          <p class="card-view__card-label">English (reverse side)</p>
        {#if englishSections.length === 0}
          <p class="card-view__card-title">
            No selections were provided in the URL.
          </p>
        {:else}
          <div class="card-view__content">
            {#each englishSections as section (section.key)}
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

  .card-view__cards {
    display: grid;
    gap: 1.75rem;
  }

  .card-view__card {
    box-sizing: border-box;
    background: white;
    border-radius: 16px;
    border: 1px solid #e4dccb;
    padding: 2rem;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card-view__card-label {
    margin: 0;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7a6a50;
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
    display: inline-block; /* Match Print */
    margin: 6px 12px;
    padding: 6px 8px;
    font-size: 1.2rem;
  }
  .card-view__card-title {
    margin: 0;
    color: #7a6a50;
  }

  @media print {
    .no-print, .card-view__header {
      display: none !important;
    }
    @page {
      margin: 0;
    }

    .card-view {
      padding: 1cm !important; 
    }

    :global(body), .card-view, .card-view__canvas {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
      width: 100% !important;
    }

    .card-view__cards:nth-of-type(2) {
      page-break-before: always !important;
      break-before: page !important;
    }

    .card-view__card {
      /* Typography & Colors */
      font-family: "Microsoft YaHei", "Heiti SC", "STHeiti", "SimSun", "PingFang SC", "Noto Sans CJK SC", sans-serif !important;
      background: white !important;
      border: 2px solid #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      display: flex !important;
      flex-direction: column !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
      /* Force the box to be exactly the height assigned */
      flex-grow: 1 !important; 
      flex-shrink: 0 !important;
      
      /* Critical: remove any auto-height constraints */
      height: auto; 
    }

    .card-view__cards {
      display: block !important;
      height: auto !important;
      clear: both !important;
    }
    .card-view__chip {
      border: 1px solid black !important;
      display: inline-block !important;
    }
  }
  .print-button {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    width: fit-content;    
    justify-self: start;  
    /* Styling */
    background: transparent;
    color: #7a6a50;
    border: 1.5px solid #7a6a50;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    
    /* Typography */
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: none;
    
    /* Animation */
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .print-button:hover {
    background: #7a6a50;
    color: #fefaf2; /* Matches your beige canvas background */
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(122, 106, 80, 0.15);
  }

  .print-button:active {
    transform: translateY(0);
  }
.print-controls {
  display: flex;
  align-items: center; /* Vertical centering */
  gap: 12px;           /* Space between button and bubble */
}

.info-bubble {
  position: relative;
  cursor: help;
}

.info-icon {
  width: 20px;
  height: 20px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Georgia", serif;
  font-style: italic;
  font-weight: bold;
  font-size: 13px;
  color: #555;
  border: 1px solid #ccc;
}

.info-content {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 130%; /* Appear above the icon */
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: #222;
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  z-index: 100;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Tooltip Arrow */
.info-content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: #222 transparent transparent transparent;
}

.info-bubble:hover .info-content {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

</style>
