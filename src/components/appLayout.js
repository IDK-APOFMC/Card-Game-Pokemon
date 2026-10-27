import createBattleView from "./views/battleView.js";
import createBoosterView from "./views/boosterView.js";
import createCollectionView from "./views/collectionView.js";

export default function createAppLayout() {
  const app = document.createElement("main");

  app.className = "app";
  app.innerHTML = `
    <header class="app-header">
      <div class="logo">
        <span class="logo-ball">◉</span>
        <div>
          <h1>Pokémon Cards</h1>
          <p>Colección 3D</p>
        </div>
      </div>
      <p class="header-description">
        Explora Pokémon, abre sobres y reta a la CPU.
      </p>
    </header>

    <nav class="app-nav" aria-label="Navegación principal">
      <button type="button" class="nav-button is-active" data-view="collection" aria-pressed="true">
        Colección
      </button>
      <button type="button" class="nav-button" data-view="booster" aria-pressed="false">
        Sobres
      </button>
      <button type="button" class="nav-button" data-view="battle" aria-pressed="false">
        Batalla
      </button>
    </nav>

    ${createCollectionView()}
    ${createBoosterView()}
    ${createBattleView()}
  `;

  return app;
}
