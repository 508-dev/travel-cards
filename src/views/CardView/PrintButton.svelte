<script lang="ts">
  const handlePrint = () => {
    // Remove focus from the button immediately
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Force the window to the top (Print engines prefer 0,0)
    window.scrollTo(0, 0);

    // Trigger print
    window.print();
  };
</script>

<button type="button" class="print-button" on:click={handlePrint}>
  <span aria-hidden="true">⎙</span> Print Cards
</button>

<style>
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
    color: #fefaf2;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(122, 106, 80, 0.15);
  }

  .print-button:active {
    transform: translateY(0);
  }
</style>
