export default function createCollectionView() {
  return `
    <section id="collection-view" class="view-panel is-active" data-view="collection">
      <section class="controls">
        <div class="search-container">
          <label for="pokemon-search">Buscar Pokémon</label>
          <input
            id="pokemon-search"
            type="text"
            list="pokemon-names"
            placeholder="Escribe Pikachu, Charizard..."
            autocomplete="off"
          />
          <datalist id="pokemon-names"></datalist>
        </div>
        <div class="button-container">
          <button id="search-button" class="primary-button">Ver carta</button>
          <button id="random-button" class="secondary-button">Pokémon aleatorio</button>
        </div>
      </section>

      <section class="status-area">
        <p id="status">Cargando Pokémon...</p>
      </section>

      <section id="card-container" class="card-container"></section>

      <section class="instructions">
        <div class="instruction">
          <strong>1</strong>
          <span>Busca un Pokémon</span>
        </div>
        <div class="instruction">
          <strong>2</strong>
          <span>La carta gira automáticamente</span>
        </div>
        <div class="instruction">
          <strong>3</strong>
          <span>Tócala y arrastra para girarla</span>
        </div>
      </section>
    </section>
  `;
}
