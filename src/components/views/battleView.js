export default function createBattleView() {
  return `
    <section id="battle-view" class="view-panel" data-view="battle">
      <div class="subpage-header">
        <h2>Batalla contra la CPU</h2>
        <p>Elige una carta de tu colección. El poder total depende de sus estadísticas y de sus tipos.</p>
      </div>

      <p id="battle-status" class="battle-status">
        Selecciona una carta para empezar la batalla.
      </p>

      <div class="battle-grid">
        <div class="battle-side">
          <h3>Tu carta</h3>
          <div id="battle-player-card" class="battle-card-slot empty-card-slot">
            <span>Sin selección</span>
          </div>
          <div id="battle-player-list" class="owned-card-grid"></div>
        </div>

        <div class="battle-side">
          <h3>CPU</h3>
          <div id="battle-cpu-card" class="battle-card-slot empty-card-slot">
            <span>Esperando rival</span>
          </div>
        </div>
      </div>

      <button id="battle-button" class="battle-button" type="button" disabled>
        Luchar
      </button>
    </section>
  `;
}
