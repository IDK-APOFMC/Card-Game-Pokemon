import createAppLayout from "./appLayout.js";
import { setupBattle } from "./battle.js";
import { initializeBooster, setupBooster } from "./booster.js";
import { setupNavigation } from "./navigation.js";
import {
  renderBattleSelection,
  renderBoosterCollection
} from "./ownedCollections.js";
import {
  loadPokemonNames,
  setupPokemonSearch,
  showInitialPokemon
} from "./pokemonSearch.js";

export default function createApp() {
  const app = createAppLayout();

  setupPokemonSearch(app);
  setupNavigation(app);
  setupBooster(app);
  setupBattle(app);
  loadPokemonNames(app);
  initializeBooster(app);
  renderBoosterCollection(app);
  renderBattleSelection(app);
  showInitialPokemon(app);

  return app;
}
