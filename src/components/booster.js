import { formatPokemonName, getRandomPokemon } from "../services/pokeapi.js";
import {
  createStoredCard,
  loadBoosterClicks,
  loadCollection,
  saveBoosterClicks,
  saveCollection
} from "../services/collection.js";
import { refreshOwnedCollections } from "./ownedCollections.js";

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function updateBoosterCounter(app) {
  const clicks = loadBoosterClicks();
  const progress = clicks % 10;
  const remaining = 10 - progress;
  const boosterProgress = app.querySelector("#booster-progress");
  const boosterProgressFill = app.querySelector("#booster-progress-fill");
  const boosterStatus = app.querySelector("#booster-status");

  if (progress === 0 && clicks > 0) {
    boosterProgress.textContent = "10/10";
    boosterProgressFill.style.width = "100%";
    boosterStatus.textContent = "¡Puedes abrir una carta nueva!";
    return;
  }

  boosterProgress.textContent = `${progress}/10`;
  boosterProgressFill.style.width = `${progress * 10}%`;

  if (remaining === 10) {
    boosterStatus.textContent = "Aún no has abierto ningún sobre.";
  } else {
    boosterStatus.textContent = `Faltan ${remaining} clic${remaining === 1 ? "" : "s"} para conseguir una carta.`;
  }
}

async function openBooster(app, button) {
  const boosterResult = app.querySelector("#booster-result");
  const boosterStatus = app.querySelector("#booster-status");

  button.classList.remove("is-tapping", "is-opening");
  void button.offsetWidth;
  button.classList.add("is-tapping");

  let clicks = loadBoosterClicks();
  clicks += 1;
  saveBoosterClicks(clicks);

  const progress = clicks % 10;

  if (progress === 0) {
    button.classList.add("is-opening");
    button.disabled = true;
    updateBoosterCounter(app);

    try {
      const openingDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1000;
      await wait(openingDuration);
      const result = await getRandomPokemon();
      const newCard = createStoredCard(result);
      const collection = loadCollection();

      saveCollection([...collection, newCard]);
      refreshOwnedCollections(app);
      boosterResult.innerHTML = `
        <div class="obtained-card">
          <img src="${newCard.image}" alt="${formatPokemonName(newCard.name)}" />
          <div>
            <span>¡Nueva carta!</span>
            <h4>${formatPokemonName(newCard.name)}</h4>
            <p>Power: ${newCard.power}</p>
          </div>
        </div>
      `;
      boosterStatus.textContent = `¡Has abierto un sobre y has conseguido a ${formatPokemonName(newCard.name)}!`;
    } catch (error) {
      console.error(error);
      boosterStatus.textContent = "No se pudo abrir el sobre.";
    } finally {
      button.disabled = false;
      button.classList.remove("is-opening", "is-tapping");
    }
  } else {
    boosterResult.innerHTML = "";
    boosterStatus.textContent = `Faltan ${10 - progress} clic${10 - progress === 1 ? "" : "s"} para una carta.`;
    window.setTimeout(() => button.classList.remove("is-tapping"), 450);
  }

  updateBoosterCounter(app);
}

export function setupBooster(app) {
  const button = app.querySelector("#booster-button");

  button.addEventListener("click", () => openBooster(app, button));
}

export function initializeBooster(app) {
  updateBoosterCounter(app);
}
