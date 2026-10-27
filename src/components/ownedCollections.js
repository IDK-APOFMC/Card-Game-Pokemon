import { formatPokemonName } from "../services/pokeapi.js";
import { loadCollection } from "../services/collection.js";

export function renderBoosterCollection(app) {
  const container = app.querySelector("#booster-collection");
  const collection = loadCollection();

  if (!collection.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Aún no tienes cartas. Abre un sobre para empezar.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = collection
    .map(
      (card) => `
        <article class="owned-card">
          <img src="${card.image}" alt="${formatPokemonName(card.name)}" />
          <div class="owned-card-body">
            <h4>${formatPokemonName(card.name)}</h4>
            <p>Power: ${card.power}</p>
          </div>
        </article>
      `
    )
    .join("");
}

export function renderBattleSelection(app) {
  const battlePlayerList = app.querySelector("#battle-player-list");
  const battlePlayerCard = app.querySelector("#battle-player-card");
  const battleButton = app.querySelector("#battle-button");
  const collection = loadCollection();

  if (!collection.length) {
    battlePlayerList.innerHTML = `
      <div class="empty-state">
        <p>No tienes cartas para combatir.</p>
      </div>
    `;

    battleButton.disabled = true;
    battlePlayerCard.className = "battle-card-slot empty-card-slot";
    battlePlayerCard.innerHTML = "<span>Sin selección</span>";

    return;
  }

  battlePlayerList.innerHTML = collection
    .map(
      (card, index) => `
        <button type="button" class="battle-select-button${index === 0 ? " is-selected" : ""}" data-card-id="${card.id}">
          <img src="${card.image}" alt="${formatPokemonName(card.name)}" />
          <span>${formatPokemonName(card.name)}</span>
          <strong>${card.power}</strong>
        </button>
      `
    )
    .join("");

  const selectedCard = collection[0];

  battlePlayerCard.className = "battle-card-slot";
  battlePlayerCard.innerHTML = `
    <img src="${selectedCard.image}" alt="${formatPokemonName(selectedCard.name)}" />
    <div class="battle-card-meta">
      <h4>${formatPokemonName(selectedCard.name)}</h4>
      <span>Power: ${selectedCard.power}</span>
    </div>
  `;
  battleButton.disabled = false;
}

export function refreshOwnedCollections(app) {
  renderBoosterCollection(app);
  renderBattleSelection(app);
}
