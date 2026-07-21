import Gameboard from "./gameboard.js";

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
    this.targetQueue = [];
  }

  addAdjacentTargets([row, column], enemyGameboard) {
    const adjacentCoordinates = [
      [row + 1, column],
      [row - 1, column],
      [row, column + 1],
      [row, column - 1],
    ];

    adjacentCoordinates.forEach(([nextRow, nextColumn]) => {
      const coordinateKey = `${nextRow},${nextColumn}`;
      const isOnBoard =
        nextRow >= 0 && nextRow < 10 && nextColumn >= 0 && nextColumn < 10;

      const isAlreadyQueued = this.targetQueue.some(
        ([queuedRow, queuedColumn]) =>
          queuedRow === nextRow && queuedColumn === nextColumn,
      );

      if (
        isOnBoard &&
        !enemyGameboard.attacks.has(coordinateKey) &&
        !isAlreadyQueued
      ) {
        this.targetQueue.push([nextRow, nextColumn]);
      }
    });
  }

  computerAttack(enemyGameboard, random = Math.random) {
    let result;
    let coordinate;

    do {
      if (this.targetQueue.length > 0) {
        coordinate = this.targetQueue.shift();
      } else {
        const row = Math.floor(random() * 10);
        const column = Math.floor(random() * 10);
        coordinate = [row, column];
      }

      result = enemyGameboard.receiveAttack(coordinate);
    } while (result === "repeat" || result === "invalid");

    if (result === "hit") {
      this.addAdjacentTargets(coordinate, enemyGameboard);
    }

    return { coordinate, result };
  }
}

export default Player;
