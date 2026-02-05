<script lang="ts">
  import PrintButton from "./PrintButton.svelte";
  import InfoBubble from "./InfoBubble.svelte";
</script>

<header class="card-view__header no-print">
  <p class="card-view__eyebrow">Travel Cards</p>
  <h1 class="card-view__title">Printable Card</h1>
  <p class="card-view__subtitle">
    This view renders the card details from the URL query parameters.
  </p>

  <div class="print-controls">
    <PrintButton />
    <InfoBubble>
      <p>
        <strong>
          Note: The card will attempt to print as two pages. Please print double
          sided, portrait mode, so that the english card will print on the opposite
          side of the local language card.
        </strong>
      </p>
    </InfoBubble>
  </div>
</header>

<style>
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

  .print-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media print {
    .card-view__header,
    :global(.no-print) {
      display: none !important;
    }
  }
</style>
