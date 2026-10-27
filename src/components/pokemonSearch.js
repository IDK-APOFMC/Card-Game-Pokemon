import {
  formatPokemonName,
  getPokemonComplete,
  getPokemonNames,
  getRandomPokemon
} from "../services/pokeapi.js";
import { createPokemonCard } from "./pokemonCard.js";

async function loadNames(app) {
  const datalist = app.querySelector("#pokemon-names");
  const status = app.querySelector("#status");

  try {
    const names = await getPokemonNames();

    datalist.innerHTML = "";

    names.forEach((pokemon) => {
      const option = document.createElement("option");

      option.value = pokemon.name;
      option.label = formatPokemonName(pokemon.name);
      datalist.appendChild(option);
    });

    status.textContent = `${names.length} Pokémon disponibles`;
  } catch (error) {
    status.textContent = "No se pudo cargar la lista de Pokémon.";
    console.error(error);
  }
}

async function showPokemon(app, name) {
  const status = app.querySelector("#status");
  const cardContainer = app.querySelector("#card-container");

  if (!name.trim()) {
    status.textContent = "Escribe el nombre de un Pokémon.";
    return;
  }

  try {
    status.textContent = "Cargando carta...";
    cardContainer.innerHTML = `
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <p>Preparando la carta...</p>
      </div>
    `;

    const result = await getPokemonComplete(name.trim().toLowerCase());

    cardContainer.innerHTML = "";
    cardContainer.appendChild(createPokemonCard(result));
    status.textContent = `${formatPokemonName(result.pokemon.name)} cargado correctamente.`;
  } catch (error) {
    console.error(error);

    cardContainer.innerHTML = `
      <div class="error-card">
        <h2>Pokémon no encontrado</h2>
        <p>Comprueba el nombre y vuelve a intentarlo.</p>
      </div>
    `;
    status.textContent = "Ha ocurrido un error.";
  }
}

async function showRandomPokemon(app) {
  const searchInput = app.querySelector("#pokemon-search");
  const status = app.querySelector("#status");
  const cardContainer = app.querySelector("#card-container");

  try {
    status.textContent = "Buscando Pokémon aleatorio...";
    cardContainer.innerHTML = `
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <p>Barajando el mazo...</p>
      </div>
    `;

    const result = await getRandomPokemon();

    searchInput.value = result.pokemon.name;
    cardContainer.innerHTML = "";
    cardContainer.appendChild(createPokemonCard(result));
    status.textContent = `Has sacado a ${formatPokemonName(result.pokemon.name)}.`;
  } catch (error) {
    console.error(error);
    status.textContent = "No se pudo sacar una carta.";
  }
}

export function setupPokemonSearch(app) {
  const searchInput = app.querySelector("#pokemon-search");

  app.querySelector("#search-button").addEventListener("click", () => {
    showPokemon(app, searchInput.value);
  });

  app.querySelector("#random-button").addEventListener("click", () => {
    showRandomPokemon(app);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      showPokemon(app, searchInput.value);
    }
  });
}

export function loadPokemonNames(app) {
  loadNames(app);
}

export function showInitialPokemon(app) {
  showPokemon(app, "pikachu");
}
