import { createPokemonCardData } from "./pokemonCardData.js";
import { setupPokemonCardInteractions } from "./pokemonCardInteractions.js";
import createPokemonCardTemplate from "./pokemonCardTemplate.js";

export function createPokemonCard({ pokemon, species }) {
  const container = document.createElement("div");
  const cardData = createPokemonCardData(pokemon, species);

  container.className = "card-stage";
  container.innerHTML = createPokemonCardTemplate(pokemon, cardData);
  setupPokemonCardInteractions(container);

  return container;
}
