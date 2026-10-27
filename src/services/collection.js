const COLLECTION_KEY = "pokemon-collection-v1";
const BOOSTER_KEY = "pokemon-booster-clicks-v1";

export function getCardImage(pokemon) {
  return (
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.front_default ||
    ""
  );
}

export function getCardPower(pokemon) {
  return (pokemon.stats ?? []).reduce(
    (total, stat) => total + Number(stat.base_stat || 0),
    0
  );
}

export function createStoredCard(data) {
  const { pokemon } = data;
  const image = getCardImage(pokemon);

  return {
    id: pokemon.id,
    name: pokemon.name,
    image,
    power: getCardPower(pokemon),
    types: (pokemon.types ?? []).map(({ type }) => type.name),
    sprite: image
  };
}

export function loadCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("No se pudo cargar la colección:", error);

    return [];
  }
}

export function saveCollection(collection) {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

export function loadBoosterClicks() {
  const raw = Number(localStorage.getItem(BOOSTER_KEY) || 0);

  return Number.isFinite(raw) ? raw : 0;
}

export function saveBoosterClicks(value) {
  localStorage.setItem(BOOSTER_KEY, String(value));
}
