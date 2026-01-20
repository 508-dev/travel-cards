<section class="maker">
  <header class="maker__header">
    <p class="maker__eyebrow">Travel Cards</p>
    <h1 class="maker__title">Card Builder</h1>
    <p class="maker__subtitle">
      Choose languages and the items you need to communicate. This screen will
      evolve into the guided checklist flow.
    </p>
  </header>

  <div class="maker__panel">
    <p class="maker__placeholder">Form controls will live here.</p>
  </div>
</section>

<style>
  .maker {
    max-width: 920px;
    margin: 0 auto;
    padding: 4rem 1.5rem 6rem;
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
    max-width: 36rem;
    color: #4f463a;
  }

  .maker__panel {
    border: 1px solid #d7cbb6;
    border-radius: 24px;
    padding: 2.5rem;
    background: #fff8eb;
  }

  .maker__placeholder {
    margin: 0;
    color: #6b5c44;
  }
</style>
