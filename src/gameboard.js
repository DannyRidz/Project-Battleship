import Ship from "./ship.js";

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.attacks = new Set();
    this.missedAttacks = new Set();
  }

  getCell([row, column]) {
    return this.board[row][column];
  }

  placeShip(length, [row, column], orientation) {
    if (
      !Number.isInteger(length) ||
      length <= 0 ||
      !Number.isInteger(row) ||
      !Number.isInteger(column) ||
      !["horizontal", "vertical"].includes(orientation)
    ) {
      return false;
    }

    const coordinates = [];

    for (let offset = 0; offset < length; offset += 1) {
      const nextRow = orientation === "vertical" ? row + offset : row;
      const nextColumn =
        orientation === "horizontal" ? column + offset : column;

      coordinates.push([nextRow, nextColumn]);
    }

    const canPlace = coordinates.every(
      ([nextRow, nextColumn]) =>
        nextRow >= 0 &&
        nextRow < 10 &&
        nextColumn >= 0 &&
        nextColumn < 10 &&
        this.board[nextRow][nextColumn] === null,
    );

    if (!canPlace) {
      return false;
    }

    const ship = new Ship(length);

    coordinates.forEach(([nextRow, nextColumn]) => {
      this.board[nextRow][nextColumn] = ship;
    });

    this.ships.push(ship);
    return true;
  }

  receiveAttack([row, column]) {
    if (
      !Number.isInteger(row) ||
      !Number.isInteger(column) ||
      row < 0 ||
      row >= 10 ||
      column < 0 ||
      column >= 10
    ) {
      return "invalid";
    }

    const coordinateKey = `${row},${column}`;

    if (this.attacks.has(coordinateKey)) {
      return "repeat";
    }

    this.attacks.add(coordinateKey);

    const ship = this.getCell([row, column]);

    if (ship !== null) {
      ship.hit();
      return "hit";
    }

    this.missedAttacks.add(coordinateKey);
    return "miss";
  }

  allShipsSunk() {
    return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
