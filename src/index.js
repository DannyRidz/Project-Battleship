import "./styles.css";
import Game from "./game.js";
import renderGame from "./dom.js";

const root = document.querySelector("#app");
const game = new Game();

game.startPlacement();
renderGame(game, root);
