import { escapeHTML } from "./pokemonCardData.js";

function createCardFront(pokemon, cardData) {
  return `
    <article class="card-face card-front">
      <div class="card-header">
        <span class="pokemon-number">
          #${String(pokemon.id).padStart(4, "0")}
        </span>
        <span class="pokemon-genus">
          ${cardData.genus}
        </span>
      </div>

      <div class="pokemon-name">
        ${escapeHTML(cardData.name)}
      </div>
      <div class="type-list">
        ${cardData.types}
      </div>
      <div class="pokemon-image-container">
        <img
          src="${cardData.image}"
          alt="${escapeHTML(cardData.name)}"
          class="pokemon-image"
        />
      </div>

      <div class="basic-info">
        <div class="basic-item">
          <span>Altura</span>
          <strong>${pokemon.height / 10} m</strong>
        </div>
        <div class="basic-item">
          <span>Peso</span>
          <strong>${pokemon.weight / 10} kg</strong>
        </div>
        <div class="basic-item">
          <span>EXP base</span>
          <strong>${pokemon.base_experience ?? "—"}</strong>
        </div>
      </div>

      <div class="front-description">
        ${cardData.flavorText}
      </div>
      <div class="flip-hint">
        Toca y arrastra para girar
      </div>
    </article>
  `;
}

function createCardBack() {
  return `
    <article class="card-face card-back">
      <div class="card-back-inner">
        <div class="pokemon-back-logo pokemon-logo-top">
          Pokémon
        </div>
        <div class="pokeball-back">
          <div class="pokeball-top"></div>
          <div class="pokeball-middle"></div>
          <div class="pokeball-bottom"></div>
          <div class="pokeball-center">
            <span></span>
          </div>
        </div>
        <div class="pokemon-back-logo pokemon-logo-bottom">
          Pokémon
        </div>
      </div>
    </article>
  `;
}

function createPokemonInformation(pokemon, cardData) {
  return `
    <section class="pokemon-information">
      <div class="information-title">
        <div>
          <span class="information-number">
            #${String(pokemon.id).padStart(4, "0")}
          </span>
          <h2>${escapeHTML(cardData.name)}</h2>
        </div>
        <div class="type-list">
          ${cardData.types}
        </div>
      </div>

      <section class="info-section">
        <h3>Estadísticas</h3>
        ${cardData.stats.hp}
        ${cardData.stats.attack}
        ${cardData.stats.defense}
        ${cardData.stats.specialAttack}
        ${cardData.stats.specialDefense}
        ${cardData.stats.speed}
      </section>

      <section class="info-section">
        <h3>Descripción</h3>
        <p class="description-text">
          ${cardData.flavorText}
        </p>
      </section>

      <section class="info-section">
        <h3>Habilidades</h3>
        <div class="chip-list">
          ${cardData.abilities || `<span class="empty-info">Ninguna</span>`}
        </div>
      </section>

      <section class="info-section">
        <h3>Formas</h3>
        <div class="chip-list">
          ${cardData.forms}
        </div>
      </section>

      <section class="info-section">
        <h3>Objetos</h3>
        <div class="chip-list">
          ${cardData.heldItems}
        </div>
      </section>

      <section class="info-section">
        <h3>Movimientos</h3>
        <div class="moves-list">
          ${cardData.moves}
        </div>
      </section>
    </section>
  `;
}

export default function createPokemonCardTemplate(pokemon, cardData) {
  return `
    <div class="card-controls">
      <button
        class="auto-rotate-button"
        type="button"
        aria-pressed="true"
      >
        ⏸ Pausar giro
      </button>
      <span class="rotate-status">
        Giro automático activado
      </span>
    </div>

    <div class="pokemon-card" tabindex="0">
      ${createCardFront(pokemon, cardData)}
      ${createCardBack()}
    </div>

    ${createPokemonInformation(pokemon, cardData)}
  `;
}
