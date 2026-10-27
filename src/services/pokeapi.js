const API_URL = "https://pokeapi.co/api/v2";

const pokemonCache = new Map();
const speciesCache = new Map();
const typeCache = new Map();

let pokemonNamesCache = null;

/**
 * Obtiene un Pokémon por nombre o ID.
 */
export async function getPokemon(nameOrId) {
  const key = String(nameOrId).toLowerCase();

  if (pokemonCache.has(key)) {
    return pokemonCache.get(key);
  }

  const response = await fetch(`${API_URL}/pokemon/${key}`);

  if (!response.ok) {
    throw new Error("No se ha encontrado ese Pokémon.");
  }

  const pokemon = await response.json();

  pokemonCache.set(key, pokemon);

  return pokemon;
}

/**
 * Obtiene la información de la especie.
 * Aquí conseguimos descripción, género de especie, etc.
 */
export async function getSpecies(url) {
  if (speciesCache.has(url)) {
    return speciesCache.get(url);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudo obtener la información de la especie.");
  }

  const species = await response.json();

  speciesCache.set(url, species);

  return species;
}

async function getPokemonType(typeName) {
  if (typeCache.has(typeName)) {
    return typeCache.get(typeName);
  }

  const response = await fetch(`${API_URL}/type/${encodeURIComponent(typeName)}`);

  if (!response.ok) {
    throw new Error(`No se pudieron obtener las relaciones del tipo ${typeName}.`);
  }

  const type = await response.json();
  typeCache.set(typeName, type);

  return type;
}

/**
 * Indica si alguno de los tipos atacantes es supereficaz contra los tipos defensores.
 */
export async function hasTypeAdvantage(attackingTypes, defendingTypes) {
  if (attackingTypes.length === 0 || defendingTypes.length === 0) {
    return false;
  }

  const defendingTypeData = await Promise.all(
    defendingTypes.map((typeName) => getPokemonType(typeName))
  );

  return attackingTypes.some((attackerType) => {
    const multiplier = defendingTypeData.reduce((total, type) => {
      const relations = type.damage_relations;

      if (relations.no_damage_from.some((item) => item.name === attackerType)) {
        return 0;
      }

      if (relations.double_damage_from.some((item) => item.name === attackerType)) {
        return total * 2;
      }

      if (relations.half_damage_from.some((item) => item.name === attackerType)) {
        return total / 2;
      }

      return total;
    }, 1);

    return multiplier > 1;
  }
  );
}

/**
 * Obtiene Pokémon + información adicional de especie.
 */
export async function getPokemonComplete(nameOrId) {
  const pokemon = await getPokemon(nameOrId);

  let species = null;

  try {
    species = await getSpecies(pokemon.species.url);
  } catch (error) {
    console.warn("No se pudo cargar la especie:", error);
  }

  return {
    pokemon,
    species
  };
}

/**
 * Obtiene todos los nombres disponibles en PokéAPI.
 */
export async function getPokemonNames() {
  if (pokemonNamesCache) {
    return pokemonNamesCache;
  }

  // Primero averiguamos cuántos Pokémon hay.
  const countResponse = await fetch(
    `${API_URL}/pokemon?limit=1&offset=0`
  );

  if (!countResponse.ok) {
    throw new Error("No se pudo obtener la cantidad de Pokémon.");
  }

  const countData = await countResponse.json();

  // Después pedimos la lista completa de nombres.
  const response = await fetch(
    `${API_URL}/pokemon?limit=${countData.count}&offset=0`
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de Pokémon.");
  }

  const data = await response.json();

  pokemonNamesCache = data.results;

  return pokemonNamesCache;
}

/**
 * Devuelve un nombre bonito.
 * pikachu -> Pikachu
 * mr-mime -> Mr Mime
 */
export function formatPokemonName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Pokémon aleatorio.
 */
export async function getRandomPokemon() {
  const names = await getPokemonNames();

  const randomIndex = Math.floor(Math.random() * names.length);

  return getPokemonComplete(names[randomIndex].name);
}