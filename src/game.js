import Player from "./player.js";

class Game {
  constructor(random = Math.random) {
    this.random = random;
    this.human = null;
    this.computer = null;
    this.phase = "setup";
    this.winner = null;
    this.message = "Start a new game.";
    this.pendingFleet = [];
    this.placementOrientation = "horizontal";
    this.mode = "computer";
    this.currentPlayer = "human";
    this.awaitingPass = false;
  }

  start() {
    this.human = new Player("human");
    this.computer = new Player("computer");
    this.phase = "playing";
    this.winner = null;
    this.message = "Attack the computer board.";
    this.mode = "computer";
    this.currentPlayer = "human";
    this.awaitingPass = false;

    this.placeRandomFleet(this.human.gameboard);
    this.placeRandomFleet(this.computer.gameboard);
  }

  startPlacement() {
    this.human = new Player("human");
    this.computer = new Player("computer");
    this.phase = "placement";
    this.winner = null;
    this.pendingFleet = [5, 4, 3, 3, 2];
    this.placementOrientation = "horizontal";
    this.message = "Drag each ship onto your board.";
    this.mode = "computer";
    this.currentPlayer = "human";
    this.awaitingPass = false;

    this.placeRandomFleet(this.computer.gameboard);
  }

  toggleOrientation() {
    this.placementOrientation =
      this.placementOrientation === "horizontal" ? "vertical" : "horizontal";

    return this.placementOrientation;
  }

  placeHumanShip(length, coordinate, orientation) {
    if (this.phase !== "placement") {
      return false;
    }

    const shipIndex = this.pendingFleet.indexOf(length);

    if (shipIndex === -1) {
      return false;
    }

    const placed = this.human.gameboard.placeShip(
      length,
      coordinate,
      orientation,
    );

    if (!placed) {
      this.message = "That ship does not fit there.";
      return false;
    }

    this.pendingFleet.splice(shipIndex, 1);

    if (this.pendingFleet.length === 0) {
      this.phase = "playing";
      this.message = "Fleet ready. Attack the computer board.";
    } else {
      this.message = "Ship placed. Continue placing your fleet.";
    }

    return true;
  }

  placeRandomFleet(gameboard) {
    const fleetLengths = [5, 4, 3, 3, 2];

    fleetLengths.forEach((length) => {
      const legalPlacements = [];

      ["horizontal", "vertical"].forEach((orientation) => {
        for (let row = 0; row < 10; row += 1) {
          for (let column = 0; column < 10; column += 1) {
            const coordinates = [];

            for (let offset = 0; offset < length; offset += 1) {
              const nextRow = orientation === "vertical" ? row + offset : row;
              const nextColumn =
                orientation === "horizontal" ? column + offset : column;

              coordinates.push([nextRow, nextColumn]);
            }

            const isLegal = coordinates.every(
              ([nextRow, nextColumn]) =>
                nextRow < 10 &&
                nextColumn < 10 &&
                gameboard.getCell([nextRow, nextColumn]) === null,
            );

            if (isLegal) {
              legalPlacements.push([[row, column], orientation]);
            }
          }
        }
      });

      const randomIndex = Math.floor(this.random() * legalPlacements.length);
      const [coordinate, orientation] = legalPlacements[randomIndex];

      gameboard.placeShip(length, coordinate, orientation);
    });
  }

  startTwoPlayer() {
    this.human = new Player("player-one");
    this.computer = new Player("player-two");
    this.mode = "two-player";
    this.phase = "playing";
    this.winner = null;
    this.currentPlayer = "human";
    this.awaitingPass = true;
    this.message = "Pass the device to Player 1.";

    this.placeRandomFleet(this.human.gameboard);
    this.placeRandomFleet(this.computer.gameboard);
  }

  continueTurn() {
    if (this.mode !== "two-player" || !this.awaitingPass) {
      return false;
    }

    this.awaitingPass = false;
    const playerName = this.currentPlayer === "human" ? "Player 1" : "Player 2";
    this.message = `${playerName}, choose an enemy coordinate.`;
    return true;
  }

  twoPlayerAttack(coordinate) {
    if (
      this.mode !== "two-player" ||
      this.phase !== "playing" ||
      this.awaitingPass
    ) {
      return "invalid";
    }

    const defendingPlayer =
      this.currentPlayer === "human" ? this.computer : this.human;

    const result = defendingPlayer.gameboard.receiveAttack(coordinate);

    if (result === "repeat" || result === "invalid") {
      this.message = "Choose a coordinate you have not attacked.";
      return result;
    }

    if (defendingPlayer.gameboard.allShipsSunk()) {
      this.phase = "finished";
      this.winner =
        this.currentPlayer === "human" ? "player-one" : "player-two";
      this.message =
        this.currentPlayer === "human" ? "Player 1 wins!" : "Player 2 wins!";
      return result;
    }

    this.currentPlayer = this.currentPlayer === "human" ? "computer" : "human";
    this.awaitingPass = true;

    const nextPlayer = this.currentPlayer === "human" ? "Player 1" : "Player 2";
    this.message = `Pass the device to ${nextPlayer}.`;

    return result;
  }

  humanAttack(coordinate) {
    if (this.mode !== "computer" || this.phase !== "playing") {
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
