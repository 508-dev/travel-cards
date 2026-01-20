<section class="card-view">
  <header class="card-view__header">
    <p class="card-view__eyebrow">Travel Cards</p>
    <h1 class="card-view__title">Printable Card</h1>
    <p class="card-view__subtitle">
      This view will render the translated card content based on URL query
      parameters.
    </p>
  </header>

  <div class="card-view__canvas">
    <div class="card-view__card">
      <p class="card-view__card-title">Card output placeholder</p>
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
    align-items: center;
  }

  .card-view__card-title {
    margin: 0;
    color: #7a6a50;
  }
</style>
