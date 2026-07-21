import Gameboard from "./gameboard.js";

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  computerAttack(enemyGameboard, random = Math.random) {
    let result;
    let coordinate;

    do {
      const row = Math.floor(random() * 10);
      const column = Math.floor(random() * 10);
      coordinate = [row, column];
      result = enemyGameboard.receiveAttack(coordinate);
    } while (result === "repeat" || result === "invalid");

    return { coordinate, result };
  }
}

export default Player;
