import { formatPokemonName } from "../services/pokeapi.js";

export function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSpanishFlavorText(species) {
  if (!species?.flavor_text_entries) {
    return "No hay descripción disponible.";
  }

  const spanishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "es"
  );

  if (!spanishEntry) {
    return "No hay descripción disponible en español.";
  }

  return spanishEntry.flavor_text
    .replace(/\n/g, " ")
    .replace(/\f/g, " ");
}

function getSpanishGenus(species) {
  if (!species?.genera) {
    return "Pokémon";
  }

  const spanishGenus = species.genera.find(
    (entry) => entry.language.name === "es"
  );

  return spanishGenus?.genus || "Pokémon";
}

function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(
    (item) => item.stat.name === statName
  );

  return stat ? stat.base_stat : 0;
}

export function getPokemonImage(pokemon) {
  return (
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.front_default ||
    ""
  );
}

function createStatHTML(label, value) {
  return `
    <div class="stat-row">
      <span>${label}</span>
      <strong>${value}</strong>
      <div class="stat-bar">
        <div
          class="stat-bar-fill"
          style="width: ${Math.min(value, 100)}%"
        ></div>
      </div>
    </div>
  `;
}

export function createPokemonCardData(pokemon, species) {
  const name = formatPokemonName(pokemon.name);
  const types = pokemon.types
    .map((type) => `
      <span class="type-badge type-${type.type.name}">
        ${formatPokemonName(type.type.name)}
      </span>
    `)
    .join("");
  const abilities = pokemon.abilities
    .map((ability) => `
      <span class="info-chip">
        ${formatPokemonName(ability.ability.name)}
      </span>
    `)
    .join("");
  const moves = pokemon.moves
    .map((move) => `
      <span class="move-chip">
        ${formatPokemonName(move.move.name)}
      </span>
    `)
    .join("");
  const forms = pokemon.forms
    .map((form) => `
      <span class="info-chip">
        ${formatPokemonName(form.name)}
      </span>
    `)
    .join("");
  const heldItems = pokemon.held_items.length > 0
    ? pokemon.held_items
        .map((item) => `
          <span class="info-chip">
            ${formatPokemonName(item.item.name)}
          </span>
        `)
        .join("")
    : `<span class="empty-info">Ninguno</span>`;

  return {
    name,
    image: getPokemonImage(pokemon),
    types,
    abilities,
    moves,
    forms,
    heldItems,
    genus: escapeHTML(getSpanishGenus(species)),
    flavorText: escapeHTML(getSpanishFlavorText(species)),
    stats: {
      hp: createStatHTML("PS", getStat(pokemon, "hp")),
      attack: createStatHTML("Ataque", getStat(pokemon, "attack")),
      defense: createStatHTML("Defensa", getStat(pokemon, "defense")),
      specialAttack: createStatHTML("At. Esp.", getStat(pokemon, "special-attack")),
      specialDefense: createStatHTML("Def. Esp.", getStat(pokemon, "special-defense")),
      speed: createStatHTML("Velocidad", getStat(pokemon, "speed"))
    }
  };
}
