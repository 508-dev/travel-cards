<script lang="ts">
  import type { CardSection as CardSectionType } from "./cardViewHelpers";

  export let section: CardSectionType;
</script>

<div class="card-view__section">
  <h2 class="card-view__section-title">{section.label}</h2>
  <div class="card-view__chips">
    {#each section.options as option (option.id)}
      <span class="card-view__chip">{option.label}</span>
    {/each}
  </div>
</div>

<style>
  .card-view__section {
    margin-bottom: 1.5rem;
  }

  .card-view__section-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }

  .card-view__chip {
    border: 1px solid black;
    border-radius: 3px;
    display: inline-block;
    margin: 6px 12px;
    padding: 6px 8px;
    font-size: 1.2rem;
  }

  @media print {
    .card-view__chip {
      border: 1px solid black !important;
      display: inline-block !important;
    }
  }
</style>
