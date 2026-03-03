<script lang="ts">
  import type { CardSection } from "./cardViewHelpers";
  import CardSection from "./CardSection.svelte";

  export let cardElement: HTMLElement;
  export let label: string;
  export let sections: CardSection[];
  export let emptyMessage: string;
</script>

<div bind:this={cardElement} class="card-view__card">
  <p class="card-view__card-label">{label}</p>
  
  {#if sections.length === 0}
    <p class="card-view__card-title">{emptyMessage}</p>
  {:else}
    <div class="card-view__content">
      {#each sections as section (section.key)}
        <CardSection {section} />
      {/each}
    </div>
  {/if}
</div>

<style>
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

  .card-view__card-title {
    margin: 0;
    color: #7a6a50;
  }

  @media print {
    .card-view__card {
      font-family: "Microsoft YaHei", "Heiti SC", "STHeiti", "SimSun",
        "PingFang SC", "Noto Sans CJK SC", sans-serif !important;
      background: white !important;
      border: 2px solid #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      display: flex !important;
      flex-direction: column !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
      flex-grow: 1 !important;
      flex-shrink: 0 !important;
      height: auto;
    }
  }
</style>
