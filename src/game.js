import Player from "./player.js";

class Game {
  constructor(random = Math.random) {
    this.random = random;
    this.human = null;
    this.computer = null;
    this.phase = "setup";
    this.winner = null;
    this.message = "Start a new game.";
  }

  start() {
    this.human = new Player("human");
    this.computer = new Player("computer");
    this.phase = "playing";
    this.winner = null;
    this.message = "Attack the computer board.";

    const fleet = [
      [5, [0, 0], "horizontal"],
      [4, [1, 0], "horizontal"],
      [3, [2, 0], "horizontal"],
      [3, [3, 0], "horizontal"],
      [2, [4, 0], "horizontal"],
    ];

    fleet.forEach(([length, coordinate, orientation]) => {
      this.human.gameboard.placeShip(length, coordinate, orientation);
      this.computer.gameboard.placeShip(length, coordinate, orientation);
    });
  }

  humanAttack(coordinate) {
    if (this.phase !== "playing") {
      return "invalid";
    }

    const result = this.computer.gameboard.receiveAttack(coordinate);

    if (result === "repeat" || result === "invalid") {
      this.message = "Choose a coordinate you have not attacked.";
      return result;
    }

    if (this.computer.gameboard.allShipsSunk()) {
      this.phase = "finished";
      this.winner = "human";
      this.message = "You win!";
      return result;
    }

    const computerAttack = this.computer.computerAttack(
      this.human.gameboard,
      this.random,
    );

    if (this.human.gameboard.allShipsSunk()) {
      this.phase = "finished";
      this.winner = "computer";
      this.message = "The computer wins.";
    } else {
      this.message = `Your attack was a ${result}. The computer's attack was a ${computerAttack.result}.`;
    }

    return result;
  }
}

export default Game;
