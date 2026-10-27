import {
  formatPokemonName,
  getRandomPokemon,
  hasTypeAdvantage
} from "../services/pokeapi.js";
import {
  createStoredCard,
  loadCollection,
  saveCollection
} from "../services/collection.js";
import { refreshOwnedCollections } from "./ownedCollections.js";

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function setBattleCpuCard(app, card, message = "Esperando rival") {
  const battleCpuCard = app.querySelector("#battle-cpu-card");

  if (!card) {
    battleCpuCard.className = "battle-card-slot empty-card-slot";
    battleCpuCard.innerHTML = `<span>${message}</span>`;
    return;
  }

  battleCpuCard.className = "battle-card-slot";
  battleCpuCard.innerHTML = `
    <img src="${card.image}" alt="${formatPokemonName(card.name)}" />
    <div class="battle-card-meta">
      <h4>${formatPokemonName(card.name)}</h4>
      <span>Poder base: ${card.power}</span>
    </div>
  `;
}

function selectPlayerCard(app, button) {
  const collection = loadCollection();
  const selectedCard = collection.find((card) => String(card.id) === button.dataset.cardId);

  if (!selectedCard) {
    return;
  }

  const battlePlayerList = app.querySelector("#battle-player-list");
  const battlePlayerCard = app.querySelector("#battle-player-card");
  const battleButton = app.querySelector("#battle-button");
  const battleStatus = app.querySelector("#battle-status");

  battlePlayerList.querySelectorAll(".battle-select-button").forEach((item) => {
    item.classList.toggle("is-selected", item === button);
  });

  battlePlayerCard.className = "battle-card-slot";
  battlePlayerCard.innerHTML = `
    <img src="${selectedCard.image}" alt="${formatPokemonName(selectedCard.name)}" />
    <div class="battle-card-meta">
      <h4>${formatPokemonName(selectedCard.name)}</h4>
      <span>Power: ${selectedCard.power}</span>
    </div>
  `;

  battleButton.disabled = false;
  battleStatus.textContent = `Seleccionada: ${formatPokemonName(selectedCard.name)}. Ahora la CPU elige un rival.`;
}

async function fight(app) {
  const collection = loadCollection();
  const selected = app.querySelector("#battle-player-list .battle-select-button.is-selected");
  const battleStatus = app.querySelector("#battle-status");
  const battleButton = app.querySelector("#battle-button");
  const battlePlayerCard = app.querySelector("#battle-player-card");

  if (!selected) {
    battleStatus.textContent = "Selecciona una carta de tu colección antes de luchar.";
    return;
  }

  const playerCard = collection.find((card) => String(card.id) === selected.dataset.cardId);

  if (!playerCard) {
    battleStatus.textContent = "No se ha podido localizar tu carta.";
    return;
  }

  battleButton.disabled = true;
  setBattleCpuCard(app, null, "Oponente eligiendo carta...");
  battleStatus.textContent = "Oponente eligiendo carta...";

  try {
    await wait(1000 + Math.random() * 1000);
    const cpuResult = await getRandomPokemon();
    const cpuCard = createStoredCard(cpuResult);
    const playerTypes = playerCard.types ?? [];
    const cpuTypes = cpuCard.types ?? [];
    const playerIsCountered = await hasTypeAdvantage(cpuTypes, playerTypes);
    const cpuIsCountered = await hasTypeAdvantage(playerTypes, cpuTypes);
    const playerBattlePower = playerIsCountered
      ? playerCard.power / 2
      : playerCard.power;
    const cpuBattlePower = cpuIsCountered
      ? cpuCard.power / 2
      : cpuCard.power;

    setBattleCpuCard(app, cpuCard);
    battlePlayerCard.querySelector(".battle-card-meta").innerHTML = `
      <h4>${formatPokemonName(playerCard.name)}</h4>
      <span>Poder base: ${playerCard.power}</span>
      <span class="battle-effective-power">
        Poder en batalla: ${playerBattlePower}${playerIsCountered ? " (debilidad de tipo)" : ""}
      </span>
    `;
    app.querySelector("#battle-cpu-card .battle-card-meta").innerHTML = `
      <h4>${formatPokemonName(cpuCard.name)}</h4>
      <span>Poder base: ${cpuCard.power}</span>
      <span class="battle-effective-power">
        Poder en batalla: ${cpuBattlePower}${cpuIsCountered ? " (debilidad de tipo)" : ""}
      </span>
    `;

    if (playerBattlePower > cpuBattlePower) {
      const nextCollection = [...collection];

      if (!nextCollection.some((card) => card.id === cpuCard.id)) {
        nextCollection.push(cpuCard);
      }

      saveCollection(nextCollection);
      battleStatus.textContent = `¡Has ganado! Poder en batalla: ${playerBattlePower} contra ${cpuBattlePower}.${playerIsCountered ? " Tu carta tenía desventaja de tipo y su poder se redujo a la mitad." : ""}${cpuIsCountered ? " La CPU tenía desventaja de tipo y su poder se redujo a la mitad." : ""} Te llevas la carta de ${formatPokemonName(cpuCard.name)}.`;
    } else if (playerBattlePower < cpuBattlePower) {
      const nextCollection = collection.filter((card) => card.id !== playerCard.id);

      saveCollection(nextCollection);
      battleStatus.textContent = `Has perdido. Poder en batalla: ${playerBattlePower} contra ${cpuBattlePower}.${playerIsCountered ? " Tu carta tenía desventaja de tipo y su poder se redujo a la mitad." : ""}${cpuIsCountered ? " La CPU tenía desventaja de tipo y su poder se redujo a la mitad." : ""} Pierdes tu carta de ${formatPokemonName(playerCard.name)}.`;
    } else {
      battleStatus.textContent = `Empate técnico. Ambos tienen ${playerBattlePower} de poder en batalla.${playerIsCountered ? " Tu carta tenía desventaja de tipo." : ""}${cpuIsCountered ? " La CPU tenía desventaja de tipo." : ""}`;
    }

    refreshOwnedCollections(app);
  } catch (error) {
    console.error(error);
    battleStatus.textContent = "No se pudo crear un rival válido.";
    battleButton.disabled = loadCollection().length === 0;
    setBattleCpuCard(app, null);
  }
}

export function setupBattle(app) {
  const battlePlayerList = app.querySelector("#battle-player-list");

  battlePlayerList.addEventListener("click", (event) => {
    const button = event.target.closest(".battle-select-button");

    if (button && battlePlayerList.contains(button)) {
      selectPlayerCard(app, button);
    }
  });
  app.querySelector("#battle-button").addEventListener("click", () => fight(app));
}
