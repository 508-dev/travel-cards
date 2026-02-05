<div class="info-bubble" aria-label="Printing help">
  <span class="info-icon">i</span>
  <div class="info-content">
    <slot />
  </div>
</div>

<style>
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
    bottom: 130%;
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
