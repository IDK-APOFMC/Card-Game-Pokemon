export default function createBoosterView() {
  return `
    <section id="booster-view" class="view-panel" data-view="booster">
      <div class="subpage-header">
        <h2>Sobre de cartas</h2>
        <p>Haz clic en el sobre para abrirlo. Cada 10 clics consigues una carta aleatoria.</p>
      </div>

      <div class="booster-panel">
        <button id="booster-button" class="booster-button" type="button" aria-label="Dar un clic al sobre; cada 10 clics consigues una carta">
          <span class="booster-pack" aria-hidden="true">
            <span class="booster-pack-card"></span>
            <span class="booster-pack-art">★</span>
            <span class="booster-pack-title">POKÉMON</span>
            <span class="booster-pack-subtitle">TRADING CARD GAME</span>
            <span class="booster-pack-seal"></span>
            <span class="booster-pack-flap"></span>
            <span class="booster-pack-shine"></span>
          </span>
          <span class="booster-button-label">Toca para abrir</span>
          <span class="booster-button-hint">Cada clic acerca una nueva carta</span>
        </button>

        <div class="booster-progress">
          <span>Progreso</span>
          <strong id="booster-progress">0/10</strong>
        </div>
        <div class="booster-progress-track" aria-hidden="true">
          <span id="booster-progress-fill"></span>
        </div>

        <p id="booster-status" class="booster-status">
          Aún no has abierto ningún sobre.
        </p>
      </div>

      <div id="booster-result" class="booster-result" aria-live="polite"></div>

      <section class="collection-panel">
        <div class="collection-header">
          <h3>Tu colección</h3>
        </div>
        <div id="booster-collection" class="owned-card-grid"></div>
      </section>
    </section>
  `;
}
